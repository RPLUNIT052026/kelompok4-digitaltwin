import csv
import io
import os
import random
import re
import secrets
import sqlite3
from datetime import datetime, timedelta
from functools import wraps

from flask import (
    Flask,
    Response,
    jsonify,
    redirect,
    render_template,
    request,
    session,
    url_for,
)
from werkzeug.security import check_password_hash, generate_password_hash

from simulator import evaluate_closed_loop, start_background_simulator

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DB_PATH = os.path.join(BASE_DIR, "digital_twin_v7.db")
SCHEMA_PATH = os.path.join(BASE_DIR, "schema.sql")

app = Flask(__name__)
app.secret_key = os.environ.get("DT_SECRET_KEY", "digital-twin-room-v7-secret-key-2026")


def get_db():
    conn = sqlite3.connect(DB_PATH, timeout=10.0)
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA journal_mode=WAL;")
    conn.execute("PRAGMA synchronous=NORMAL;")
    conn.execute("PRAGMA foreign_keys=ON;")
    return conn


def slugify(text):
    slug = re.sub(r"[^a-z0-9]+", "-", text.lower().strip()).strip("-")
    return slug or f"room-{secrets.token_hex(3)}"


def init_db():
    conn = get_db()
    with open(SCHEMA_PATH, "r", encoding="utf-8") as f:
        conn.executescript(f.read())

    user_count = conn.execute("SELECT COUNT(*) FROM users").fetchone()[0]
    if user_count == 0:
        conn.execute(
            "INSERT INTO users (username, password_hash, role, full_name) VALUES (?, ?, ?, ?)",
            ("admin", generate_password_hash("admin123"), "admin", "Admin / Laboran"),
        )
        conn.execute(
            "INSERT INTO users (username, password_hash, role, full_name) VALUES (?, ?, ?, ?)",
            ("viewer", generate_password_hash("viewer123"), "viewer", "Viewer (Mahasiswa / Dosen)"),
        )

    room_count = conn.execute("SELECT COUNT(*) FROM rooms").fetchone()[0]
    if room_count == 0:
        default_rooms = [
            {
                "slug": "lab-komputer-1",
                "name": "Lab Komputer 1",
                "node_id": "NODE-01",
                "location": "Gedung FST, Lantai 2",
                "capacity": 32,
                "theme": "computer",
                "temp_on": 26.5,
                "temp_off": 23.5,
                "temp_alert": 29.5,
                "base_temp": 24.4,
                "base_hum": 58.0,
                "base_occ": 18,
            },
            {
                "slug": "lab-jaringan",
                "name": "Lab Jaringan Komputer",
                "node_id": "NODE-02",
                "location": "Gedung FST, Lantai 2",
                "capacity": 24,
                "theme": "network",
                "temp_on": 26.0,
                "temp_off": 23.0,
                "temp_alert": 29.0,
                "base_temp": 25.1,
                "base_hum": 60.5,
                "base_occ": 14,
            },
            {
                "slug": "ruang-server",
                "name": "Ruang Server Utama",
                "node_id": "NODE-03",
                "location": "Gedung FST, Lantai 1",
                "capacity": 6,
                "theme": "server",
                "temp_on": 23.0,
                "temp_off": 20.0,
                "temp_alert": 26.0,
                "base_temp": 21.6,
                "base_hum": 49.0,
                "base_occ": 1,
            },
        ]

        now = datetime.now()
        for item in default_rooms:
            api_key = f"dt_live_{secrets.token_hex(12)}"
            cur = conn.execute(
                """
                INSERT INTO rooms (slug, name, node_id, location, capacity, theme, api_key)
                VALUES (?, ?, ?, ?, ?, ?, ?)
                """,
                (
                    item["slug"],
                    item["name"],
                    item["node_id"],
                    item["location"],
                    item["capacity"],
                    item["theme"],
                    api_key,
                ),
            )
            room_id = cur.lastrowid
            conn.execute(
                """
                INSERT INTO thresholds (room_id, temp_on, temp_off, temp_alert, humidity_max)
                VALUES (?, ?, ?, ?, 75.0)
                """,
                (room_id, item["temp_on"], item["temp_off"], item["temp_alert"]),
            )

            t_val = item["base_temp"]
            h_val = item["base_hum"]
            o_val = item["base_occ"]
            for i in range(18, 0, -1):
                ts = (now - timedelta(seconds=i * 3)).strftime("%Y-%m-%d %H:%M:%S")
                t_val = round(t_val + random.uniform(-0.12, 0.15), 2)
                h_val = round(max(40.0, min(75.0, h_val + random.uniform(-0.4, 0.4))), 1)
                conn.execute(
                    """
                    INSERT INTO sensor_logs (room_id, temperature, humidity, occupancy, ac_state, status, source, recorded_at)
                    VALUES (?, ?, ?, ?, 0, 'OPTIMAL', 'SIMULATOR', ?)
                    """,
                    (room_id, t_val, h_val, o_val, ts),
                )

    conn.commit()
    conn.close()


def login_required(fn):
    @wraps(fn)
    def wrapper(*args, **kwargs):
        if "user_id" not in session:
            if request.path.startswith("/api/"):
                return jsonify({"error": "Unauthorized"}), 401
            return redirect(url_for("login"))
        return fn(*args, **kwargs)

    return wrapper


def admin_required(fn):
    @wraps(fn)
    def wrapper(*args, **kwargs):
        if "user_id" not in session:
            return jsonify({"error": "Unauthorized"}), 401
        if session.get("role") != "admin":
            return jsonify({"error": "Forbidden: Hanya Admin yang diizinkan"}), 403
        return fn(*args, **kwargs)

    return wrapper


@app.route("/")
def index():
    if "user_id" in session:
        return redirect(url_for("dashboard"))
    return redirect(url_for("login"))


@app.route("/login", methods=["GET", "POST"])
def login():
    if request.method == "POST":
        username = request.form.get("username", "").strip()
        password = request.form.get("password", "")

        conn = get_db()
        user = conn.execute("SELECT * FROM users WHERE username = ?", (username,)).fetchone()
        conn.close()

        if user and check_password_hash(user["password_hash"], password):
            session["user_id"] = user["id"]
            session["username"] = user["username"]
            session["role"] = user["role"]
            session["full_name"] = user["full_name"]
            return redirect(url_for("dashboard"))

        return render_template("login.html", error="Username atau password tidak sesuai.")

    if "user_id" in session:
        return redirect(url_for("dashboard"))
    return render_template("login.html", error=None)


@app.route("/logout")
def logout():
    session.clear()
    return redirect(url_for("login"))


@app.route("/dashboard")
@login_required
def dashboard():
    conn = get_db()
    rooms = conn.execute("SELECT * FROM rooms ORDER BY id ASC").fetchall()
    conn.close()

    selected_slug = request.args.get("room")
    if not selected_slug and rooms:
        selected_slug = rooms[0]["slug"]

    return render_template(
        "dashboard.html",
        rooms=[dict(r) for r in rooms],
        selected_slug=selected_slug,
        user={
            "username": session.get("username"),
            "role": session.get("role"),
            "full_name": session.get("full_name"),
        },
    )


@app.route("/kiosk")
def kiosk():
    conn = get_db()
    rooms = conn.execute("SELECT * FROM rooms ORDER BY id ASC").fetchall()
    conn.close()

    selected_slug = request.args.get("room")
    if not selected_slug and rooms:
        selected_slug = rooms[0]["slug"]

    return render_template(
        "kiosk.html",
        rooms=[dict(r) for r in rooms],
        selected_slug=selected_slug,
    )


@app.route("/api/public/overview", methods=["GET"])
def api_public_overview():
    conn = get_db()
    rooms = conn.execute(
        """
        SELECT r.id, r.slug, r.name, r.node_id, r.location, r.capacity, r.theme,
               r.acquisition_enabled, r.auto_cooling, r.ac_state
        FROM rooms r
        ORDER BY r.id ASC
        """
    ).fetchall()

    result = []
    for r in rooms:
        latest = conn.execute(
            """
            SELECT temperature, humidity, occupancy, ac_state, status, source, recorded_at
            FROM sensor_logs
            WHERE room_id = ?
            ORDER BY id DESC LIMIT 1
            """,
            (r["id"],),
        ).fetchone()

        item = dict(r)
        if latest:
            item.update(dict(latest))
        else:
            item.update(
                {
                    "temperature": 24.0,
                    "humidity": 55.0,
                    "occupancy": 0,
                    "status": "OPTIMAL",
                    "source": "SIMULATOR",
                    "recorded_at": "-",
                }
            )
        if int(r["acquisition_enabled"]) == 0:
            item["status"] = "PAUSED"
        result.append(item)

    conn.close()
    return jsonify(
        {
            "rooms": result,
            "system": {
                "simulator_active": True,
                "db_mode": "SQLite WAL",
                "room_count": len(result),
                "server_time": datetime.now().strftime("%H:%M:%S"),
            },
        }
    )


@app.route("/api/rooms", methods=["GET"])
@login_required
def api_list_rooms():
    conn = get_db()
    rooms = conn.execute(
        """
        SELECT r.*, t.temp_on, t.temp_off, t.temp_alert, t.humidity_max
        FROM rooms r
        JOIN thresholds t ON t.room_id = r.id
        ORDER BY r.id ASC
        """
    ).fetchall()
    conn.close()

    data = []
    for r in rooms:
        d = dict(r)
        if session.get("role") != "admin":
            d.pop("api_key", None)
        data.append(d)
    return jsonify({"rooms": data})


@app.route("/api/rooms", methods=["POST"])
@admin_required
def api_create_room():
    payload = request.get_json(silent=True) or {}
    name = (payload.get("name") or "").strip()
    if not name:
        return jsonify({"error": "Nama ruangan wajib diisi."}), 400

    location = (payload.get("location") or "Gedung Utama, Lantai 1").strip()
    theme = (payload.get("theme") or "auto").strip()
    if theme not in {"auto", "computer", "network", "server", "iot", "classroom"}:
        theme = "auto"

    try:
        capacity = max(1, min(500, int(payload.get("capacity", 30))))
        temp_on = float(payload.get("temp_on", 26.5))
        temp_off = float(payload.get("temp_off", 23.5))
        temp_alert = float(payload.get("temp_alert", 29.5))
    except (TypeError, ValueError):
        return jsonify({"error": "Nilai kapasitas atau suhu tidak valid."}), 400

    conn = get_db()
    total_rooms = conn.execute("SELECT COUNT(*) FROM rooms").fetchone()[0]
    node_id = (payload.get("node_id") or f"NODE-{total_rooms + 1:02d}").strip().upper()

    base_slug = slugify(name)
    slug = base_slug
    counter = 2
    while conn.execute("SELECT 1 FROM rooms WHERE slug = ?", (slug,)).fetchone():
        slug = f"{base_slug}-{counter}"
        counter += 1

    api_key = f"dt_live_{secrets.token_hex(12)}"
    cur = conn.execute(
        """
        INSERT INTO rooms (slug, name, node_id, location, capacity, theme, api_key)
        VALUES (?, ?, ?, ?, ?, ?, ?)
        """,
        (slug, name, node_id, location, capacity, theme, api_key),
    )
    room_id = cur.lastrowid

    conn.execute(
        """
        INSERT INTO thresholds (room_id, temp_on, temp_off, temp_alert, humidity_max)
        VALUES (?, ?, ?, ?, 75.0)
        """,
        (room_id, temp_on, temp_off, temp_alert),
    )

    init_temp = round((temp_on + temp_off) / 2.0, 2)
    now_str = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    conn.execute(
        """
        INSERT INTO sensor_logs (room_id, temperature, humidity, occupancy, ac_state, status, source, recorded_at)
        VALUES (?, ?, 56.0, ?, 0, 'OPTIMAL', 'SIMULATOR', ?)
        """,
        (room_id, init_temp, max(1, capacity // 4), now_str),
    )

    conn.commit()
    conn.close()
    return jsonify({"message": "Ruangan berhasil didaftarkan.", "slug": slug, "node_id": node_id}), 201


@app.route("/api/rooms/<slug>", methods=["DELETE"])
@admin_required
def api_delete_room(slug):
    conn = get_db()
    total = conn.execute("SELECT COUNT(*) FROM rooms").fetchone()[0]
    if total <= 1:
        conn.close()
        return jsonify({"error": "Minimal harus tersisa 1 ruangan aktif di sistem."}), 400

    room = conn.execute("SELECT id FROM rooms WHERE slug = ?", (slug,)).fetchone()
    if not room:
        conn.close()
        return jsonify({"error": "Ruangan tidak ditemukan."}), 404

    conn.execute("DELETE FROM rooms WHERE id = ?", (room["id"],))
    conn.commit()
    conn.close()
    return jsonify({"message": "Ruangan berhasil dihapus."})


@app.route("/api/rooms/<slug>/telemetry", methods=["GET"])
def api_room_telemetry(slug):
    conn = get_db()
    room = conn.execute(
        """
        SELECT r.*, t.temp_on, t.temp_off, t.temp_alert, t.humidity_max
        FROM rooms r
        JOIN thresholds t ON t.room_id = r.id
        WHERE r.slug = ?
        """,
        (slug,),
    ).fetchone()

    if not room:
        conn.close()
        return jsonify({"error": "Ruangan tidak ditemukan."}), 404

    logs = conn.execute(
        """
        SELECT temperature, humidity, occupancy, ac_state, status, source, recorded_at
        FROM sensor_logs
        WHERE room_id = ?
        ORDER BY id DESC LIMIT 30
        """,
        (room["id"],),
    ).fetchall()
    conn.close()

    history = [dict(row) for row in reversed(logs)]
    latest = (
        history[-1]
        if history
        else {
            "temperature": 24.0,
            "humidity": 55.0,
            "occupancy": 0,
            "ac_state": int(room["ac_state"]),
            "status": "OPTIMAL",
            "source": "SIMULATOR",
            "recorded_at": "-",
        }
    )

    if int(room["acquisition_enabled"]) == 0:
        latest["status"] = "PAUSED"

    room_dict = dict(room)
    if session.get("role") != "admin":
        room_dict.pop("api_key", None)

    return jsonify({"room": room_dict, "latest": latest, "history": history})


@app.route("/api/rooms/<slug>/control", methods=["POST"])
@admin_required
def api_room_control(slug):
    payload = request.get_json(silent=True) or {}
    conn = get_db()
    room = conn.execute(
        """
        SELECT r.*, t.temp_on, t.temp_off, t.temp_alert, t.humidity_max
        FROM rooms r
        JOIN thresholds t ON t.room_id = r.id
        WHERE r.slug = ?
        """,
        (slug,),
    ).fetchone()

    if not room:
        conn.close()
        return jsonify({"error": "Ruangan tidak ditemukan."}), 404

    room_id = room["id"]

    if "acquisition_enabled" in payload:
        val = 1 if payload["acquisition_enabled"] else 0
        conn.execute("UPDATE rooms SET acquisition_enabled = ? WHERE id = ?", (val, room_id))

    if "auto_cooling" in payload:
        val = 1 if payload["auto_cooling"] else 0
        conn.execute("UPDATE rooms SET auto_cooling = ? WHERE id = ?", (val, room_id))

    if "ac_state" in payload:
        val = 1 if payload["ac_state"] else 0
        conn.execute("UPDATE rooms SET ac_state = ?, auto_cooling = 0 WHERE id = ?", (val, room_id))

    if payload.get("trigger_alert"):
        conn.execute("UPDATE rooms SET alert_spike = 4, acquisition_enabled = 1 WHERE id = ?", (room_id,))

    if "thresholds" in payload and isinstance(payload["thresholds"], dict):
        th = payload["thresholds"]
        try:
            temp_on = float(th.get("temp_on", room["temp_on"]))
            temp_off = float(th.get("temp_off", room["temp_off"]))
            temp_alert = float(th.get("temp_alert", room["temp_alert"]))
            conn.execute(
                "UPDATE thresholds SET temp_on = ?, temp_off = ?, temp_alert = ? WHERE room_id = ?",
                (temp_on, temp_off, temp_alert, room_id),
            )
        except (TypeError, ValueError):
            conn.close()
            return jsonify({"error": "Format threshold tidak valid."}), 400

    conn.commit()
    conn.close()
    return jsonify({"message": "Pengaturan ruangan diperbarui."})


@app.route("/api/rooms/<slug>/export.csv", methods=["GET"])
@admin_required
def api_export_csv(slug):
    conn = get_db()
    room = conn.execute("SELECT id, name, node_id FROM rooms WHERE slug = ?", (slug,)).fetchone()
    if not room:
        conn.close()
        return jsonify({"error": "Ruangan tidak ditemukan."}), 404

    rows = conn.execute(
        """
        SELECT recorded_at, temperature, humidity, occupancy, ac_state, status, source
        FROM sensor_logs
        WHERE room_id = ?
        ORDER BY id DESC LIMIT 500
        """,
        (room["id"],),
    ).fetchall()
    conn.close()

    output = io.StringIO()
    writer = csv.writer(output)
    writer.writerow(["Waktu", "Ruangan", "Node", "Suhu (C)", "Kelembapan (%)", "Okupansi", "Status AC", "Kondisi", "Sumber"])
    for r in rows:
        writer.writerow(
            [
                r["recorded_at"],
                room["name"],
                room["node_id"],
                r["temperature"],
                r["humidity"],
                r["occupancy"],
                "ON" if r["ac_state"] == 1 else "STANDBY",
                r["status"],
                r["source"],
            ]
        )

    csv_content = output.getvalue()
    return Response(
        csv_content,
        mimetype="text/csv",
        headers={"Content-Disposition": f"attachment; filename=telemetry_{slug}.csv"},
    )


@app.route("/api/sensor", methods=["POST"])
def api_sensor_ingest():
    api_key = request.headers.get("X-API-Key", "").strip()
    payload = request.get_json(silent=True) or {}
    slug = (payload.get("room_slug") or "").strip()

    if not api_key or not slug:
        return jsonify({"error": "Header X-API-Key dan room_slug wajib disertakan."}), 401

    conn = get_db()
    room = conn.execute(
        """
        SELECT r.*, t.temp_on, t.temp_off, t.temp_alert, t.humidity_max
        FROM rooms r
        JOIN thresholds t ON t.room_id = r.id
        WHERE r.slug = ?
        """,
        (slug,),
    ).fetchone()

    if not room or room["api_key"] != api_key:
        conn.close()
        return jsonify({"error": "API Key atau ruangan tidak valid."}), 403

    try:
        temperature = float(payload["temperature"])
        humidity = float(payload["humidity"])
        occupancy = int(payload.get("occupancy", 0))
    except (KeyError, TypeError, ValueError):
        conn.close()
        return jsonify({"error": "Payload membutuhkan temperature, humidity, dan occupancy."}), 400

    ac_state, status = evaluate_closed_loop(room, room, temperature, humidity)
    now_str = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

    conn.execute("UPDATE rooms SET ac_state = ? WHERE id = ?", (ac_state, room["id"]))
    conn.execute(
        """
        INSERT INTO sensor_logs (room_id, temperature, humidity, occupancy, ac_state, status, source, recorded_at)
        VALUES (?, ?, ?, ?, ?, ?, 'ESP32', ?)
        """,
        (room["id"], temperature, humidity, occupancy, ac_state, status, now_str),
    )
    conn.commit()
    conn.close()

    return jsonify({"status": "ok", "cooling": ac_state, "condition": status})


init_db()
if os.environ.get("WERKZEUG_RUN_MAIN") == "true" or not app.debug:
    start_background_simulator(get_db, interval_sec=3.0)


if __name__ == "__main__":
    start_background_simulator(get_db, interval_sec=3.0)
    app.run(host="0.0.0.0", port=5000, debug=False)

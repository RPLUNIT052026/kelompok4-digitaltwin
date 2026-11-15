import math
import random
import threading
from datetime import datetime

_sim_thread = None
_sim_stop_event = threading.Event()


def evaluate_closed_loop(room_row, threshold_row, temperature, humidity):
    """Evaluasi logika Closed-Loop Auto-Cooling dan status kenyamanan."""
    temp_on = float(threshold_row["temp_on"])
    temp_off = float(threshold_row["temp_off"])
    temp_alert = float(threshold_row["temp_alert"])
    hum_max = float(threshold_row["humidity_max"])

    auto_cooling = int(room_row["auto_cooling"])
    ac_state = int(room_row["ac_state"])

    if auto_cooling == 1:
        if temperature >= temp_on:
            ac_state = 1
        elif temperature <= temp_off:
            ac_state = 0

    if temperature >= temp_alert:
        status = "CRITICAL"
    elif ac_state == 1:
        status = "COOLING"
    elif temperature >= (temp_on - 0.5) or humidity > hum_max:
        status = "WARNING"
    else:
        status = "OPTIMAL"

    return ac_state, status


def step_simulation_once(get_db_func):
    """Menjalankan satu siklus simulasi fisika ruangan untuk semua ruangan aktif."""
    conn = get_db_func()
    try:
        rooms = conn.execute(
            """
            SELECT r.*, t.temp_on, t.temp_off, t.temp_alert, t.humidity_max
            FROM rooms r
            JOIN thresholds t ON t.room_id = r.id
            ORDER BY r.id ASC
            """
        ).fetchall()

        now_str = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        hour_factor = math.sin((datetime.now().hour / 24.0) * math.pi)

        for r in rooms:
            if int(r["acquisition_enabled"]) != 1:
                continue

            last = conn.execute(
                "SELECT temperature, humidity, occupancy FROM sensor_logs WHERE room_id = ? ORDER BY id DESC LIMIT 1",
                (r["id"],),
            ).fetchone()

            theme = r["theme"] or "auto"
            cap = max(1, int(r["capacity"]))
            is_server = theme == "server" or "server" in r["name"].lower()

            if last:
                prev_temp = float(last["temperature"])
                prev_hum = float(last["humidity"])
                prev_occ = int(last["occupancy"])
            else:
                prev_temp = 21.5 if is_server else 24.6
                prev_hum = 52.0 if is_server else 59.0
                prev_occ = 1 if is_server else max(2, cap // 3)

            if is_server:
                occ_delta = random.choice([-1, 0, 0, 0, 1])
                new_occ = max(0, min(cap, prev_occ + occ_delta))
            else:
                target_occ = int(cap * (0.25 + 0.45 * max(0.2, hour_factor)))
                drift = 1 if prev_occ < target_occ else (-1 if prev_occ > target_occ else 0)
                new_occ = max(0, min(cap, prev_occ + drift + random.choice([-1, 0, 0, 1])))

            occ_ratio = new_occ / cap
            ac_state = int(r["ac_state"])
            alert_spike = int(r["alert_spike"])

            if alert_spike > 0:
                target_spike = float(r["temp_alert"]) + random.uniform(0.6, 1.4)
                new_temp = round(prev_temp + (target_spike - prev_temp) * 0.55, 2)
                new_hum = round(min(84.0, prev_hum + random.uniform(0.3, 1.1)), 1)
                conn.execute(
                    "UPDATE rooms SET alert_spike = ? WHERE id = ?",
                    (alert_spike - 1, r["id"]),
                )
            else:
                heat_gain = (0.04 + occ_ratio * 0.14 + (0.09 if is_server else 0.03))
                cooling_drop = 0.28 if ac_state == 1 else 0.0
                noise = random.uniform(-0.05, 0.06)
                new_temp = round(max(17.5, min(36.0, prev_temp + heat_gain - cooling_drop + noise)), 2)

                hum_shift = (-0.35 if ac_state == 1 else 0.18 * occ_ratio) + random.uniform(-0.25, 0.25)
                new_hum = round(max(38.0, min(85.0, prev_hum + hum_shift)), 1)

            new_ac_state, status = evaluate_closed_loop(r, r, new_temp, new_hum)

            conn.execute(
                "UPDATE rooms SET ac_state = ? WHERE id = ?",
                (new_ac_state, r["id"]),
            )
            conn.execute(
                """
                INSERT INTO sensor_logs (room_id, temperature, humidity, occupancy, ac_state, status, source, recorded_at)
                VALUES (?, ?, ?, ?, ?, ?, 'SIMULATOR', ?)
                """,
                (r["id"], new_temp, new_hum, new_occ, new_ac_state, status, now_str),
            )

            conn.execute(
                """
                DELETE FROM sensor_logs
                WHERE room_id = ? AND id NOT IN (
                    SELECT id FROM sensor_logs WHERE room_id = ? ORDER BY id DESC LIMIT 1500
                )
                """,
                (r["id"], r["id"]),
            )

        conn.commit()
    except Exception as exc:
        conn.rollback()
        print(f"[Simulator Warning] {exc}")
    finally:
        conn.close()


def _worker_loop(get_db_func, interval_sec=3.0):
    while not _sim_stop_event.is_set():
        step_simulation_once(get_db_func)
        _sim_stop_event.wait(interval_sec)


def start_background_simulator(get_db_func, interval_sec=3.0):
    global _sim_thread
    if _sim_thread is not None and _sim_thread.is_alive():
        return
    _sim_stop_event.clear()
    _sim_thread = threading.Thread(
        target=_worker_loop,
        args=(get_db_func, interval_sec),
        daemon=True,
        name="DigitalTwinSimulator",
    )
    _sim_thread.start()

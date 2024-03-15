const { formatDate, formatTime } = require('./util')

function manageTime(conn, req, res) {
    const { action } = req.body;
    if (action == "fetch") {
      const currentDate = formatDate(new Date());
      const currentTime = formatTime(new Date());
      const query = `SELECT event_id, appointment_date, appointment_time, appointment_name
      FROM event_appointment 
      WHERE appointment_date > ? OR (appointment_date = ? AND appointment_time > ?)
      ORDER BY appointment_date, appointment_time`;
      conn.query(
        query,
        [currentDate, currentDate, currentTime],
        (err, result) => {
          if (err) {
            res.status(500).send("Error retrieving upcoming event");
          } else {
            if (result.length > 0) {
              return res.json({
                status: "ok",
                currentDate,
                currentTime,
                event: result,
              });
            } else if (result.length == 0) {
              return res.json({ status: "no event" });
            }
          }
        }
      );
    } else if (action == "add") {
      const { date, time, name } = req.body;
      let query = `INSERT INTO event_appointment
      (appointment_date, appointment_time, appointment_name) VALUES (?, ?, ?)`;
      conn.query(query, [date, time, name], (err, result) => {
        if (err) {
          return res.json({ status: "error", msg: err.message });
        } else {
          return res.json({ status: "success", msg: "Add event successfully" });
        }
      });
    } else if (action == "del") {
      const { id } = req.body;
      let query = `DELETE FROM event_appointment
      WHERE event_id = ?`;
      conn.query(query, [id], (err, result) => {
        if (err) {
          return res.json({ status: "error", msg: err.message });
        } else {
          // console.log(result)
          return res.json({
            status: "success",
            msg: "delete event successfully",
          });
        }
      });
    }
}

module.exports = { manageTime }
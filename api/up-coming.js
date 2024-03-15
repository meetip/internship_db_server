const { formatDate, formatTime } = require('./util');

function upComing(conn, req, res) {
    const currentDate = formatDate(new Date());
    const currentTime = formatTime(new Date());
  const query = `SELECT appointment_date, appointment_time, appointment_name
    FROM event_appointment 
    WHERE appointment_date > ? OR (appointment_date = ? AND appointment_time > ?)
    ORDER BY appointment_date, appointment_time 
    LIMIT 1`;
  conn.query(query, [currentDate, currentDate, currentTime], (err, result) => {
    if (err) {
      // console.error(err);
      res.status(500).send("Error retrieving upcoming event");
    } else {
      // console.log(result);
      // res.json({status: 'ok', currentDate, currentTime, event: result})
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
  });
}

module.exports = { upComing };

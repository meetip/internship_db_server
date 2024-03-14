function studentquery(conn, req, res) {
  const { id } = req.body;

  const detectID = () => {
    if (isNaN(id)) {
      return `(u.fname LIKE '%${id}%' OR u.lname LIKE '%${id}%') `;
    } else {
      return `(u.username LIKE "${id}%" OR u.username LIKE "%${id}") `;
    }
  };

  let query = `
      SELECT DISTINCT u.username, u.fname, u.lname, u.email,
      u.minor, u.tel, u.role, s.intern_type 
      FROM user u
      LEFT JOIN senior_intern s ON u.username = s.std_id
      WHERE u.role = 'std'
      AND ${detectID()}
      ORDER BY u.username
      `;

  conn.query(query, (err, result) => {
    if (err) {
      return res.json({ status: "error", msg: err.message });
    }
    if (result.length > 0) {
      return res.json({ status: "found", data: result });
    } else {
      return res.json({ status: "404" });
    }
  });
}

module.exports = { studentquery };

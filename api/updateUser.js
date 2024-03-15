function updateUser(conn, req, res) {
    const { where, value, username } = req.body;
    try {
      const query = `
      UPDATE user
      SET ${where} = ?
      WHERE username = ?
      `;
      conn.query(query, [value, username], (err, result) => {
        if (err) {
          return res.json({ status: "error", msg: err.message });
        } else {
          return res.json({ status: "success", msg: "successfully" });
        }
      });
    } catch (error) {
      return res.json({ status: "error", msg: "Something went wrong!" });
    }
}

module.exports = { updateUser }
function resetPassword(conn, req, res) {
    const { oldPassword, newPassword, username } = req.body;

    function auth(oldPassword) {
      const query1 = "SELECT password FROM users WHERE username = ?";
      conn.query(query1, [username], (err, result) => {
        if (err) {
          return res.json({ status: "error", msg: err.message });
        } else if (result.length == 1) {
          if (result[0].password == oldPassword) {
            const query2 = "UPDATE users SET password = ? WHERE username = ?";
            conn.query(query2, [newPassword, username], (err, result) => {
              if (err) {
                return res.json({ status: "error", msg: err.message });
              } else {
                return res.json({
                  status: "success",
                  msg: "Password successfully updated",
                });
              }
            });
          } else {
            return res.json({
              status: "error",
              msg: "Old password is incorrect",
            });
          }
        } else {
          return res.json({ status: "error", msg: "User not found" });
        }
      });
    }
  
    auth(oldPassword);
}

module.exports = { resetPassword }
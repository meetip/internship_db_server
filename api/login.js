function login(conn, req, res, next) {
  const uid = req.body.username;
  const upassword = req.body.password;

  try {
    conn.execute(
      "SELECT * FROM users WHERE username = ?",
      [uid],
      (err, users, fields) => {
        if (err) {
          return res.json({ status: "error", msg: err });
        }
        if (users.length == 0) {
          return res.json({ status: "error", msg: "user not found" });
        }
        if (upassword == users[0].password) {
          return res.json({
            status: "approve",
            msg: "logged in",
            data: { ...users[0], password: "" },
          });
        } else {
          return res.json({ status: "error", msg: "username or password was wrong" });
        }
      }
    );
  } catch {
    res.json({ status: "error", msg: "Something went wrong!" });
  }
}

module.exports = { login };

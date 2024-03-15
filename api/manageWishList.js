function manageWishList(conn, req, res) {
    const { username, action, value } = req.body;
    if (action == "add") {
      try {
        const query = `
        INSERT INTO wishlist (std_id, co_id)
        VALUES (${username}, ${value});
        `;
        conn.query(query, (err, result) => {
          if (err) {
            res.json({ status: "error", msg: err });
            return;
          } else {
            res.json({ status: "success", msg: "add wishlist successfully" });
          }
        });
      } catch {
        res.json({ status: "error", msg: "Something went wrong!" });
      }
    } else if (action == "remove") {
      try {
        const query = `
        DELETE FROM wishlist
        WHERE std_id = ${username} AND co_id = ${value}
        `;
        conn.query(query, (err, result) => {
          if (err) {
            res.json({ status: "error", msg: err });
            return;
          } else {
            res.json({ status: "success", msg: "remove wishlist successfully" });
          }
        });
      } catch {
        res.json({ status: "error", msg: "Something went wrong!" });
      }
    }
}

module.exports = {manageWishList}
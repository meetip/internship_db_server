function manageContact(conn, req, res) {
    const { action, userQuery, data } = req.body;
  //   console.log(userQuery)
    if (action == "fetch") {
      try {
        let query;
        if (isNaN(userQuery)) {
          query = `
          SELECT co.*, con.* FROM co_contact con
          JOIN company co ON con.co_id = co.co_id
          WHERE co.co_name LIKE "%${userQuery}%"
          AND con.contact_name IS NOT NULL
          AND NOT con.contact_name = ""
          ORDER BY co.co_name
          `;
        } else {
          query = `
          SELECT co.*, con.* FROM co_contact con
          JOIN company co ON con.co_id = co.co_id
          WHERE co.co_id LIKE "${userQuery}%"
          AND con.contact_name IS NOT NULL
          AND NOT con.contact_name = ""
          ORDER BY co.co_name
          `;
        }
        conn.query(query, (err, result) => {
          if (err) {
            return res.json({ status: "error", msg: err });
          }
          if (result.length > 0) {
            return res.json({ status: "found", data: result });
          } else if (result.length == 0) {
            return res.json({ status: "404" });
          }
        });
      } catch (error) {
        console.error("Error delete student id :", error);
        res.status(500).send("Internal Server Error");
      }
    } else if (action == "del") {
      let query = `
          DELETE FROM co_contact
          WHERE co_id = ? AND contact_name = ?
          `;
      conn.query(query, [data.co_id, data.contact_name], (err, result) => {
        if (err) {
          return res.json({ status: "error", msg: err });
        } else {
          return res.json({ status: "success" });
        }
      });
    } else {
      res.status(500).send("Internal Server Error");
    }
  }
  
  module.exports = { manageContact };
  
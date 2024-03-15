function manageCompany(conn, req, res) {
  const { action, userQuery, data } = req.body;
//   console.log(userQuery)
  if (action == "fetch") {
    try {
      let query;
      if (isNaN(userQuery)) {
        query = `
        SELECT * FROM company WHERE co_name LIKE "%${userQuery}%"
        ORDER BY co_name
        `;
      } else {
        query = `
        SELECT * from company WHERE co_id LIKE "${userQuery}%"
        ORDER BY  co_name
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
        DELETE FROM company
        WHERE co_id = ? AND co_name = ?
        `;
    // console.log('delete')
    conn.query(query, [data.co_id, data.co_name], (err, result) => {
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

module.exports = { manageCompany };

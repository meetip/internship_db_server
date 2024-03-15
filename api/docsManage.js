function docsManage(conn, req, res) {
    const { action, docsName, docsLink } = req.body;
    if (action == "add") {
      let query = `INSERT INTO docs_store (docs_name, docs_link)
      VALUES (?, ?)`;
      conn.query(query, [docsName, docsLink], (err, result) => {
        if (err) {
          return res.json({ status: "error", msg: err.message });
        } else {
          return res.json({ status: "success", msg: "upload link successfully" });
        }
      });
    } else if (action == "del") {
      let query = `
      DELETE FROM docs_store
      WHERE docs_name = ? AND docs_link = ?`;
      conn.query(query, [docsName, docsLink], (err, result) => {
        if (err) {
          return res.json({ status: "error", msg: err.message });
        } else {
          return res.json({ status: "success", msg: "delete link successfully" });
        }
      });
    }
}

module.exports = { docsManage }
function getfiles(conn, req, res) {
  try {
    const query = `SELECT * FROM docs_store ORDER BY docs_name`;
    conn.query(query, (err, result) => {
      if (err) {
        // console.error(err);
        res.status(500).send("Error to get files");
      } else {
        if (result.length > 0) {
          res.json({ status: "success", data: result });
        } else if (result.length == 0) {
          res.json({ status: "404" });
        }
      }
    });
  } catch {
    res.json({ status: "error", msg: "Something went wrong!" });
  }
}

module.exports = { getfiles }
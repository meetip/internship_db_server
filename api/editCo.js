function editCo(conn, req, res) {
    const { action, co_id, update, std_id, col } = req.body;
    if (action == "edit") {
      try {
        const query = `
        UPDATE company
        SET ${conn.escapeId(col)} = ?
        WHERE co_id = ?
        `;
        // console.log(query);
        conn.query(query, [update, co_id], (err, result) => {
          if (err) {
            return res.json({ status: "error", msg: err.message });
          } else {
            return res.json({ status: "success", msg: "successfully" });
          }
        });
      } catch (error) {
        return res.json({ status: "error", msg: "Something went wrong!" });
      }
    } else if (action == "del") {
      try {
        const query = `
        DELETE FROM comment
        WHERE co_id = ? AND std_id = ?;
        `;
        conn.query(query, [co_id, std_id], (err, result) => {
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
}

module.exports = {editCo}
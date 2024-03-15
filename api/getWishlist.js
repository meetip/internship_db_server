function getWishlist(conn, req, res) {
    const username = req.body.username;
    try {
      const query = `SELECT DISTINCT c.*, co.contact_name,
      co.department, co.contact_tel, co.email
      FROM wishlist w
      JOIN user u ON w.std_id = u.username
      JOIN company c ON w.co_id = c.co_id
      LEFT JOIN co_contact co ON w.co_id = co.co_id
      WHERE w.std_id = ${username}
      ORDER BY c.co_name;
      `;
      conn.query(query, (err, result) => {
        if (err) {
          res.json({ status: "error", msg: err });
          return;
        }
        if (result.length > 0) {
          res.json({ status: "founded", data: result });
          return;
        } else {
          res.json({ status: "no assigned", data: "no wishlish assigned" });
        }
      });
    } catch {
      res.json({ status: "error", msg: "Something went wrong!" });
    }
}

module.exports = { getWishlist }
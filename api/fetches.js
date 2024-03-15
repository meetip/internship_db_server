function fetchprv(conn, req, res) {
  const query = `SELECT co_prv, COUNT(*) AS co_prv_count
    FROM company
    WHERE NOT co_prv = ''
    GROUP BY co_prv
    ORDER BY co_prv`;
  try {
    conn.query(query, (err, result) => {
      if (err) {
        res.json({ status: "error", msg: err });
        return;
      }
      res.json({ status: "founded", data: result });
    });
  } catch {
    res.json({ status: "error", msg: "Something went wrong!" });
  }
}

function fetchType(conn, req, res) {
  const query = `
    SELECT intern_type, COUNT(*) AS intern_type_count
    FROM senior_intern
    WHERE NOT intern_type = ''
    GROUP BY intern_type
    `;
  try {
    conn.query(query, (err, result) => {
      if (err) {
        res.json({ status: "error", msg: err });
        return;
      }
      res.json({ status: "founded", data: result });
    });
  } catch {
    res.json({ status: "error", msg: "Something went wrong!" });
  }
}

function fetchSearchResult(conn, req, res) {
  const { querytxt, prv, view, intern, coop, priv, grov } = req.body;
  // console.log(querytxt, prv, view, intern, coop, priv, grov);

  const internTypeFilter = () => {
    if ((intern && coop) || (!intern && !coop)) {
      return "istd.intern_type IN ('ฝึกงาน', 'สหกิจ')";
    } else if (intern) {
      return "istd.intern_type IN ('ฝึกงาน')";
    } else if (coop) {
      return "istd.intern_type IN ('สหกิจ')";
    }
  };

  const coTypeFilter = () => {
    if ((priv && grov) || (!priv && !grov)) {
      if (view) {
        return "AND co.co_type IN ('ราชการ', 'บริษัทเอกชน')";
      } else {
        return "co.co_type IN ('ราชการ', 'บริษัทเอกชน')";
      }
    } else if (priv) {
      if (view) {
        return "AND co.co_type IN ('บริษัทเอกชน')";
      } else {
        return "co.co_type IN ('บริษัทเอกชน')";
      }
    } else if (grov) {
      if (view) {
        return "AND co.co_type IN ('ราชการ')";
      } else {
        return "co.co_type IN ('ราชการ')";
      }
    }
  };

  const query = `
    SELECT DISTINCT co.*
    FROM company co
    ${view ? "JOIN senior_intern istd ON co.co_id = istd.co_id" : ""}
    ${view ? "LEFT JOIN user u ON istd.std_id = u.username" : ""}
    WHERE ${view ? internTypeFilter() : ""}
    ${coTypeFilter()}
    ${prv !== "" ? `AND co.co_prv = ?` : ""}
    ${querytxt !== "" ? `AND co.co_name LIKE "%${querytxt}%"` : ""}
    ${view ? "AND NOT istd.std_id = ''" : ""}
    ORDER BY co.co_name;
  `;
  // console.log(query)

  try {
    conn.query(query, [prv], (err, result) => {
      // console.log(err)
      if (err) {
        res.json({ status: "error", msg: err });
      } else if (result.length > 0) {
        res.json({ status: "founded", len: result.length, data: result });
      } else {
        res.json({ status: "no match" });
      }
    });
  } catch (error) {
    res.json({ status: "error", msg: "Something went wrong!" });
  }
}

function fetchCoDetails(conn, req, res) {
  const { co_id } = req.body;
  let query = `
  SELECT DISTINCT co.co_id, co.co_name,
  istd.std_id, u.fname, u.lname,
  istd.intern_type, c.comment 
  FROM company co
  JOIN senior_intern istd ON co.co_id = istd.co_id
  LEFT JOIN user u ON istd.std_id = u.username
  LEFT JOIN comment c ON istd.std_id = c.std_id
  WHERE co.co_id = ? AND NOT istd.intern_type = "" AND NOT istd.std_id = ''
  ORDER BY istd.std_id;
  `;

  try {
    conn.query(query, [co_id], (err, result) => {
      if (err) {
        return res.json({ status: "error", msg: err.message });
      }

      if (result.length > 0) {
        let contactQuery = `
        SELECT DISTINCT *
        FROM co_contact
        WHERE co_id = ? AND NOT contact_name = ''
        AND ((NOT contact_tel = "") OR (NOT email = ""))
        ORDER BY department
        `
        conn.query(contactQuery, [co_id], (err, contact)=>{
          if (err) {
            return res.json({ status: "error", msg: err.message });
          }
          return res.json({
            status: "founded",
            count: result.length,
            data: result,
            contact: contact
          });
        })
      } else {
        return res.json({ status: "no match" });
      }
    });
  } catch (error) {
    return res.json({ status: "error", msg: "Something went wrong!" });
  }
}

function fetchMinor(conn, req, res) {
  let query = 'SELECT DISTINCT minor FROM user WHERE minor IS NOT NULL AND NOT minor = "" ORDER BY minor'
  conn.query(query, (err, result)=>{
    if (err) {
      return res.json({ status: "error", msg: err.message });
    } else if (result.length > 0) {
      return res.json({state: 'success', data: result})
    } else {
      return res.json({status: 'notfound'})
    }
  })
}

module.exports = { fetchprv, fetchType, fetchSearchResult, fetchCoDetails, fetchMinor };

const uploadCompanyData = async (conn, fieldName, filePath, res) => {
  const csv = require("fast-csv");
  const fs = require("fs");
  try {
    const dbcol =
      fieldName === "companyName"
        ? "company"
        : fieldName === "companyContacts"
        ? "co_contact"
        : fieldName === 'interns'
        ? 'interns'
        : "comments";

    const csvRows = [];
    let insertCount = 0;
    let updateCount = 0;
    csv
      .parseFile(filePath, { headers: true })
      .on("data", async (data) => {
        csvRows.push(data);
      })
      .on("end", async () => {
        const existingRows = [];
        let query;

        for (let row of csvRows) {
          try {
            if (dbcol === "company") {
              if (row.co_id) {
                query = `SELECT * FROM company WHERE co_id = ${conn.escape(
                  row.co_id
                )}`;
              } else if (row.co_name) {
                query = `SELECT * FROM company WHERE co_name = ${conn.escape(
                  row.co_name
                )}`;
              }

              const result = await new Promise((resolve, reject) => {
                conn.query(query, (error, result) => {
                  if (error) {
                    reject(error);
                  } else {
                    resolve(result);
                  }
                });
              });

              if (result.length > 0) {
                existingRows.push(result);
              } else {
                let insertQuery = `
                    INSERT INTO company (co_name, co_address, co_prv, co_type)
                    VALUES (?, ?, ?, ?)`;

                conn.query(
                  insertQuery,
                  [row.co_name, row.co_address, row.co_prv, row.co_type],
                  (error, insertResult) => {
                    if (error) {
                      return res.json({ status: "error", msg: error });
                    }
                    if (insertResult) {
                      insertCount += 1;
                    }
                  }
                );
              }
            } else if (dbcol === "co_contact") {
              query = `SELECT * FROM co_contact 
              WHERE contact_name = ${conn.escape(row.contact_name)}`;

              const result = await new Promise((resolve, reject) => {
                conn.query(query, (error, result) => {
                  if (error) {
                    reject(error);
                  } else {
                    resolve(result);
                  }
                });
              });

              if (result.length > 0) {
                let updateQuery = `
                UPDATE co_contact
                SET department = ?,
                contact_tel = ?,
                email = ?
                WHERE co_id = ? AND contact_name = ?
                `;
                conn.query(
                  updateQuery,
                  [
                    row.department,
                    row.contact_tel,
                    row.email,
                    row.co_id,
                    row.contact_name,
                  ],
                  (error, updateResult) => {
                    if (error) {
                      return res.json({ status: "error", msg: error });
                    }
                    if (updateResult) {
                      updateCount += 1;
                    }
                  }
                );
              } else {
                let insertQuery = `
                    INSERT INTO co_contact (co_id, contact_name, 
                        department, contact_tel, email)
                    VALUES (?, ?, ?, ?, ?)`;

                conn.query(
                  insertQuery,
                  [
                    row.co_id,
                    row.contact_name,
                    row.department,
                    row.contact_tel,
                    row.email,
                  ],
                  (error, insertResult) => {
                    if (error) {
                      return res.json({ status: "error", msg: error });
                    }
                    if (insertResult) {
                      insertCount += 1;
                    }
                  }
                );
              }
            } else if (dbcol === "comments") {
              // Handle comments logic
              query = `SELECT * FROM comment 
              WHERE co_id = ${conn.escape(
                row.co_id
              )} AND std_id = ${conn.escape(row.std_id)}`;

              const result = await new Promise((resolve, reject) => {
                conn.query(query, (error, result) => {
                  if (error) {
                    reject(error);
                  } else {
                    resolve(result);
                  }
                });
              });

              if (result.length > 0) {
                let updateQuery = `
                UPDATE comment
                SET comment = ?
                WHERE co_id = ? AND std_id = ?
                `;
                conn.query(
                  updateQuery,
                  [row.comment, row.co_id, row.std_id],
                  (error, updateResult) => {
                    if (error) {
                      return res.json({ status: "error", msg: error });
                    }
                    if (updateResult) {
                      updateCount += 1;
                    }
                  }
                );
              } else {
                let insertQuery = `
                    INSERT INTO comment (co_id, std_id, comment)
                    VALUES (?, ?, ?)`;

                conn.query(
                  insertQuery,
                  [row.co_id, row.std_id, row.comment],
                  (error, insertResult) => {
                    if (error) {
                      return res.json({ status: "error", msg: error });
                    }
                    if (insertResult) {
                      insertCount += 1;
                    }
                  }
                );
              }
            }
            else if (dbcol === 'interns') {
                query = `SELECT * FROM senior_intern 
              WHERE co_id = ${conn.escape(
                row.co_id
              )} AND std_id = ${conn.escape(row.std_id)}`;

              const result = await new Promise((resolve, reject) => {
                conn.query(query, (error, result) => {
                  if (error) {
                    reject(error);
                  } else {
                    resolve(result);
                  }
                });
              });

              if (result.length > 0) {
                let updateQuery = `
                UPDATE senior_intern
                SET intern_type = ?
                WHERE co_id = ? AND std_id = ?
                `;
                conn.query(
                  updateQuery,
                  [row.intern_type, row.co_id, row.std_id],
                  (error, updateResult) => {
                    if (error) {
                      return res.json({ status: "error", msg: error });
                    }
                    if (updateResult) {
                      updateCount += 1;
                    }
                  }
                );
              } else {
                if (row.std_id && row.co_id) {
                    let insertQuery = `
                        INSERT INTO senior_intern (co_id, std_id, intern_type)
                        VALUES (?, ?, ?)`;
    
                    conn.query(
                      insertQuery,
                      [row.co_id, row.std_id, row.intern_type],
                      (error, insertResult) => {
                        if (error) {
                          return res.json({ status: "error", msg: error });
                        }
                        if (insertResult) {
                          insertCount += 1;
                        }
                      }
                    );
                }
              }
            }
          } catch (error) {
            console.error("Error executing query:", error);
          }
        }
        res.json({
          status: "success",
          msg: "Finished uploading the CSV file",
          effect: [
            csvRows.length - existingRows.length,
            insertCount,
            updateCount,
          ],
        });

        fs.unlink(filePath, (err) => {
          if (err) {
            console.error(err);
            res.status(500).send("Error deleting file");
            return;
          }
        });
      });
  } catch (error) {
    console.error("Error uploading CSV:", error);
    res.status(500).send("Internal Server Error");
  }
};

module.exports = { uploadCompanyData };

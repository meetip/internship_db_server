const csv = require('fast-csv')
const fs = require('fs')

async function uploadStudentCSV(conn, req, res) {
    // console.log(req.file.path);
  
    let csvRows = [];
    let insertCount = 0;
    let updateCount = 0;
  
    try {
      csvRows = await new Promise((resolve, reject) => {
        const rows = [];
        csv
          .parseFile(req.file.path, { headers: true })
          .on("data", (data) => rows.push(data))
          .on("end", () => resolve(rows))
          .on("error", (error) => reject(error));
      });
  
      for (let row of csvRows) {
        const result = await new Promise((resolve, reject) => {
          conn.query("SELECT * FROM users WHERE username = ?", [row.username], (error, result) => {
            if (error) {
              reject(error);
            } else {
              resolve(result);
            }
          });
        });
  
        if (result.length > 0) {
          await new Promise((resolve, reject) => {
            conn.query(
              `UPDATE users
              SET password = ?, role = ?, fname = ?, lname = ?,
              email = ?, tel = ?, minor = ?
              WHERE username = ?`,
              [
                row.password,
                row.role,
                row.fname,
                row.lname,
                row.email,
                row.tel,
                row.minor,
                row.username,
              ],
              (error, updateResult) => {
                if (error) {
                  reject(error);
                } else {
                  if (updateResult) {
                    updateCount += 1;
                  }
                  resolve();
                }
              }
            );
          });
        } else {
          await new Promise((resolve, reject) => {
            conn.query(
              `INSERT INTO users (
                role, username, password, fname, lname, email, tel, minor
              ) VALUES (
                ?, ?, ?, ?, ?, ?, ?, ?
              )`,
              [
                row.role,
                row.username,
                row.password,
                row.fname,
                row.lname,
                row.email,
                row.tel,
                row.minor,
              ],
              (error, insertResult) => {
                if (error) {
                  reject(error);
                } else {
                  if (insertResult) {
                    insertCount += 1;
                  }
                  resolve();
                }
              }
            );
          });
        }
      }
  
      // Send the response after all database operations are completed
      res.json({
        status: "success",
        msg: "Finished uploading the CSV file",
        effect: [insertCount, updateCount],
      });
  
      // Delete the file after sending the response
      fs.unlink(req.file.path, (err) => {
        if (err) {
          console.error(err);
          res.status(500).send("Error deleting file");
        }
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ status: "error", msg: error.message });
    }
  };
  
  module.exports = { uploadStudentCSV };
  
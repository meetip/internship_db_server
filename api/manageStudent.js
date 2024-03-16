function manageStudent(conn, req, res) {
    const { action, userQuery, data } = req.body;
    // console.log(userQuery)
    if (action == 'fetch') {
        // console.log('fetching')
        try {
            let query;
            if (isNaN(userQuery)) { // Check if userQuery is not a number
                query = `
                    SELECT * FROM users WHERE (fname LIKE "%${userQuery}%"
                    OR lname LIKE "%${userQuery}%")
                    AND NOT role = 'adm'
                    ORDER BY username
                `;
            } else {
                const len = userQuery.length;
                if (len == 3) {
                    query = `
                        SELECT * FROM users WHERE username LIKE "%${userQuery}"
                        AND NOT role = 'adm'
                        ORDER BY username
                    `;
                } else if (len <= 9) {
                    query = `
                        SELECT * FROM users WHERE username LIKE "${userQuery}%"
                        AND NOT role = 'adm'
                        ORDER BY username
                    `;
                }
            }
            conn.query(query, (err, result) => {
                if (err) {
                    return res.json({ status: 'error', msg: err });
                }
                if (result.length > 0) {
                    return res.json({ status: 'found', data: result });
                } else {
                    return res.json({ status: '404' });
                }
            });
        } catch (error) {
            console.error("Error delete student id :", error);
            res.status(500).send("Internal Server Error");
        }
    }
    else if (action == 'del') {
        let query = `
        DELETE FROM users
        WHERE username = ? AND fname = ?
        `
        // console.log('delete')
        conn.query(query, [data.username, data.fname], (err, result)=>{
            if (err) {
                return res.json({ status: 'error', msg: err });
            }
            else {
                return res.json({status: 'success'})
            }
        })
    } else {
        res.status(500).send("Internal Server Error");
    }
}

module.exports = { manageStudent };

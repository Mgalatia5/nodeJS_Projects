// const express = require('express');
// const mysql = require('mysql');

// const app = express();

// // Parse JSON request body
// app.use(express.json());

// // Serve static files from the 'public' directory
// app.use(express.static('public'));

// // MySQL Connection Pool
// const pool = mysql.createPool({
//     connectionLimit: 10,
//     host: 'localhost',
//     user: 'root',
//     password: '',
//     database: 'crud_demo'
// });

// // Test MySQL connection
// pool.getConnection((err, connection) => {
//     if (err) throw err; // not connected!

//     console.log('Connected to MySQL database');

//     // Release the connection
//     connection.release();
// });

// // Middleware function to handle MySQL errors
// function handleDisconnect() {
//     pool.on('error', function (err) {
//         if (!err.fatal) return;
//         if (err.code !== 'PROTOCOL_CONNECTION_LOST') throw err;

//         console.log('Re-connecting lost connection: ' + err.stack);

//         pool = mysql.createPool({
//             connectionLimit: 10,
//             host: 'localhost',
//             user: 'root',
//             password: '',
//             database: 'crud_demo'
//         });
//         handleDisconnect();
//     });
// }

// handleDisconnect();

// // Create a new user
// app.post('/users', (req, res) => {
//     const { name, email } = req.body;
//     pool.query('INSERT INTO users (name, email) VALUES (?, ?)', [name, email], (err, result) => {
//         if (err) throw err;
//         res.send('User added successfully.');
//     });
// });

// // Get all users
// app.get('/users', (req, res) => {
//     pool.query('SELECT * FROM users', (err, rows) => {
//         if (err) throw err;
//         res.json(rows);
//     });
// });

// // Get a user by ID
// app.get('/users/:id', (req, res) => {
//     const userId = req.params.id;
//     pool.query('SELECT * FROM users WHERE id = ?', userId, (err, rows) => {
//         if (err) throw err;
//         if (rows.length > 0) {
//             res.json(rows[0]);
//         } else {
//             res.send('User not found.');
//         }
//     });
// });

// // Update a user by ID
// app.put('/users/:id', (req, res) => {
//     const userId = req.params.id;
//     const { name, email } = req.body;
//     pool.query('UPDATE users SET name = ?, email = ? WHERE id = ?', [name, email, userId], (err, result) => {
//         if (err) throw err;
//         res.send('User updated successfully.');
//     });
// });

// // Delete a user by ID
// app.delete('/users/:id', (req, res) => {
//     const userId = req.params.id;
//     pool.query('DELETE FROM users WHERE id = ?', userId, (err, result) => {
//         if (err) throw err;
//         res.send('User deleted successfully.');
//     });
// });

// // Start server
// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => {
//     console.log(`Server started on port ${PORT}`);
// });


const express = require('express');
const mysql = require('mysql');

const app = express();

// Middleware to parse JSON request body
app.use(express.json());

// Serve static files from the 'public' directory
app.use(express.static('public'));

// MySQL Connection Pool
const pool = mysql.createPool({
    connectionLimit: 10,
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'crud_demo'
});

// Test MySQL connection
pool.getConnection((err, connection) => {
    if (err) throw err;
    console.log('Connected to MySQL database');
    connection.release();
});

// Middleware function to handle MySQL errors
function handleDisconnect() {
    pool.on('error', function (err) {
        if (!err.fatal) return;
        if (err.code !== 'PROTOCOL_CONNECTION_LOST') throw err;
        console.log('Re-connecting lost connection: ' + err.stack);
        pool = mysql.createPool({
            connectionLimit: 10,
            host: 'localhost',
            user: 'root',
            password: '',
            database: 'crud_demo'
        });
        handleDisconnect();
    });
}

handleDisconnect();

// API routes for CRUD operations

// Create a new user
app.post('/users', (req, res) => {
    const { name, email } = req.body;
    pool.query('INSERT INTO users (name, email) VALUES (?, ?)', [name, email], (err, result) => {
        if (err) throw err;
        res.send('User added successfully.');
    });
});

// Get all users
app.get('/users', (req, res) => {
    pool.query('SELECT * FROM users', (err, rows) => {
        if (err) throw err;
        res.json(rows);
    });
});

// Get a user by ID
app.get('/users/:id', (req, res) => {
    const userId = req.params.id;
    pool.query('SELECT * FROM users WHERE id = ?', userId, (err, rows) => {
        if (err) throw err;
        if (rows.length > 0) {
            res.json(rows[0]);
        } else {
            res.send('User not found.');
        }
    });
});

// Update a user by ID
app.put('/users/:id', (req, res) => {
    const userId = req.params.id;
    const { name, email } = req.body;
    pool.query('UPDATE users SET name = ?, email = ? WHERE id = ?', [name, email, userId], (err, result) => {
        if (err) throw err;
        res.send('User updated successfully.');
    });
});

// Delete a user by ID
app.delete('/users/:id', (req, res) => {
    const userId = req.params.id;
    pool.query('DELETE FROM users WHERE id = ?', userId, (err, result) => {
        if (err) throw err;
        res.send('User deleted successfully.');
    });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});

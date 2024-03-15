
const mysql = require('mysql');


const connection = mysql.createConnection({
    host: '127.0.0.1',
    port: '3000',
    user: 'root',
    password: '4963',
    database: 'aginginplace'
});
 
connection.connect();
 
connection.query('SELECT 1 + 1 AS solution', function (error, results, fields) {
  if (error) throw error;
  console.log('The solution is: ', results[0].solution);
});
 
connection.end();




// app.use(express.json());

// const conn = mysql.createConnection({

// });

// app.post('/signup', (req, res) => {
//   const { username, password, email, gender, role, name, birthDate, telephoneNumber } = req.body;

//   const query = `INSERT INTO users (username, password, email, gender, role, name, birthDate, telephoneNumber) 
//                  VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
  
//   conn.query(query, [username, password, email, gender, role, name, birthDate, telephoneNumber], (error, results) => {
//     if (error) {
//       console.error('Error inserting user:', error);
//       res.status(500).json({ error: 'An error occurred while registering user.' });
//     } else {
//       console.log('User registered successfully');
//       res.status(200).json({ message: 'User registered successfully' });
//     }
//   });
// });

// app.listen(port, () => {
//   console.log(`Server is running on http://localhost:${port}`);
// });

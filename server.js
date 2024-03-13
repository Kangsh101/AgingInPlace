const express = require('express');
const mysql = require('mysql');
const session = require('express-session');

const path = require('path');
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(session({  
  secret: 'mySecretKey', 
  resave: false,
  saveUninitialized: false
}));

app.use(express.static(path.join(__dirname, 'build')));

app.get('*', function(req, res) {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

const connection = mysql.createConnection({
  host: '127.0.0.1',
  user: 'kangsh',
  password: '3360',
  database: 'aginginplace'
});

connection.connect((err) => {
  if (err) {
    console.error('DB 연결 실패: ' + err.stack);
    return;
  }
  console.log('DB 연결 성공');
});

//회원가입
app.post('/api/signup', (req, res) => {
  const { username, password, email, name, birthdate, gender, phoneNumber,role} = req.body;

  const query = `INSERT INTO members (username, password, email, name, birthdate, gender, phoneNumber,role) VALUES (?,?, ?, ?, ?, ?, ?, ?)`;

  connection.query(query, [username, password, email, name, birthdate, gender,  phoneNumber,role], (err, result) => {
    if (err) {
      console.error('회원가입 실패: ' + err.stack);
      res.status(500).send('회원가입 실패');
      return;
    }
    console.log('회원가입 성공');
    res.status(200).send('회원가입 성공');
  });
});

//로그인
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;

  const query = `SELECT * FROM members WHERE username = ? AND password = ?`;

  connection.query(query, [username, password], (err, result) => {
    if (err) {
      console.error('로그인 실패: ' + err.stack);
      res.status(500).send('로그인 실패');
      return;
    }
    if (result.length === 0) {
      res.status(401).send('아이디 또는 비밀번호가 올바르지 않습니다.');
      return;
    }
    req.session.userId = result[0].id;
    console.log('세션에 저장된 userId:', req.session.userId);

    res.status(200).json(result[0]);
  });
});

// 아이디
app.post('/findUser', (req, res) => {
  const { name, email } = req.body;
  connection.query('SELECT username FROM members WHERE name = ? AND email = ?', [name, email], (error, results, fields) => {
    if (error) {
      res.status(500).json({ error: 'Internal Server Error' });
      return;
    }
    if (results.length === 0) {
      res.status(404).json({ error: 'User not found' });
      return;
    }
    const username = results[0].username;
    res.json({ username });
  });
});

app.post('/findUserPhone', (req, res) => {
  const { name, phoneNumber } = req.body;
  connection.query('SELECT username FROM members WHERE name = ? AND phoneNumber = ?', [name, phoneNumber], (error, results, fields) => {
    if (error) {
      res.status(500).json({ error: 'Internal Server Error' });
      return;
    }
    if (results.length === 0) {
      res.status(404).json({ error: 'User not found' });
      return;
    }
    const username = results[0].username;
    res.json({ username });
  });
});

// 비번

app.post('/findUser1', (req, res) => {
  const { name, email } = req.body;
  connection.query('SELECT password FROM members WHERE name = ? AND email = ?', [name, email], (error, results, fields) => {
    if (error) {
      res.status(500).json({ error: 'Internal Server Error' });
      return;
    }
    if (results.length === 0) {
      res.status(404).json({ error: 'User not found' });
      return;
    }
    const password  = results[0].password ;
    res.json({ password  });
  });
});

app.post('/findUserPhone2', (req, res) => {
  const { name, phoneNumber } = req.body;
  connection.query('SELECT password FROM members WHERE name = ? AND phoneNumber = ?', [name, phoneNumber], (error, results, fields) => {
    if (error) {
      res.status(500).json({ error: 'Internal Server Error' });
      return;
    }
    if (results.length === 0) {
      res.status(404).json({ error: 'User not found' });
      return;
    }
    const password  = results[0].password ;
    res.json({ password  });
  });
});







//내정보 아직 안됌
// server/routes/user.js


const router = express.Router();

router.get('/userinfo', (req, res) => {
    if (req.session.userId) {
        const query = `SELECT id, username, email, phoneNumber, gender, name, role FROM members WHERE id = ?`;
        connection.query(query, [req.session.userId], (err, result) => {
            if (err) {
                console.error('사용자 정보 조회 실패: ' + err.stack);
                res.status(500).send('사용자 정보 조회 실패');
                return;
            }
            if (result.length === 0) {
                res.status(404).send('사용자 정보를 찾을 수 없음');
                return;
            }
            res.status(200).json(result[0]);
        });
    } else {
        res.status(401).send('인증되지 않은 사용자');
    }
});


module.exports = router;







app.get('*', function(req, res) {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.get('/', (req, res) => {
  res.send('Welcome to the Aging In Place API!');
});

const port = 3000;
app.listen(port, () => {
  console.log(`서버 시작: http://localhost:${port}`);
});
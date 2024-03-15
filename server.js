const express = require('express');
const mysql = require('mysql');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const cors = require('cors');

const path = require('path');
const app = express();
app.use(cookieParser());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(session({  
  secret: 'mySecretKey', 
  resave: false,
  saveUninitialized: false
}));

app.use(cors({
  origin: 'http://localhost:5000',
  credentials: true,
  optionsSuccessStatus: 200, 
}));

app.use(express.static(path.join(__dirname, 'build')));



const connection = mysql.createConnection({
  host: '127.0.0.1',
  user: 'kangsh',
  password: '3360',
  port :3306,
  database: 'aginginplace'
});

app.use((req, res, next) => {
  res.set('Cache-Control', 'no-store, no-cache, must-revalidate, private');
  next();
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
    const user = result[0];
    req.session.userId = user.id; 

    console.log('세션에 저장된 기본키:', req.session.userId);

    res.status(200).json(user);
  });
});



app.get('/api/customers', (req, res) => {
  const userId = req.session.userId; 

  connection.query(
    "SELECT gender, name, role, phoneNumber, birthdate FROM members WHERE id = ?;",
    [userId], 
    (err, rows, fields) => {
      if (err) {
        console.error('회원 정보 조회 실패: ' + err.stack);
        res.status(500).send('회원 정보 조회 실패');
        return;
      }
      res.send(rows);
    }
  );
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
  console.log("sadad")
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




app.get('/api/members', (req, res) => {
  connection.query(
    "SELECT * FROM MEMBERS",
    (err,rows,fileds) => {
      res.send(rows);
    }
  )
  
});

app.post('/api/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error('세션 삭제 실패:', err);
      res.status(500).send('세션 삭제 실패');
      return;
    }
    console.log('세션 삭제 완료');
    res.status(200).send('로그아웃 성공');
  });
});





// app.get('/api/userinfo', (req, res) => {
//   res.send([
//     {
//     'gender' : '여자',
//     'name' : '강암이',
//     'role' : '환자',
//     'phoneNumber': '01033402939',
//     'birthdate' : '2010-01-12'
//   }])
    
// });


app.get('/', (req, res) => {
  res.send('Hello, World!');
});

app.get('*', function(req, res) {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

const port = 5000;
app.listen(port, () => {
  console.log(`서버가 http://localhost:${port}`);
});
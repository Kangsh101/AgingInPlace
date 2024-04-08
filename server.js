const express = require('express');
const mysql = require('mysql');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const cors = require('cors');

const path = require('path');
const app = express();

const kangsh = 'USE aginginplace';

app.use(cookieParser());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(session({  
  secret: 'mySecretKey', 
  resave: false,
  saveUninitialized: false
}));

app.use(cors({
  origin: 'http://www.aginginplaces.net/',
  methods: ['GET', 'POST'],
  credentials: true,
  optionsSuccessStatus: 200, 
}));

app.use(express.static(path.join(__dirname, 'build')));


const connection = require('./src/db');


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

  const query = `INSERT INTO members (username, password, email, name, birthdate, gender, phoneNumber, role, is_active) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1)`;

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
    if (user.is_active !== 1) {
      res.status(401).send('비활성화된 계정입니다');
      return;
    }
    req.session.userId = user.id;

    console.log('세션에 저장된 기본키:', req.session.userId);

    res.status(200).json(user);
  });
});

// 안드로이드 로그인
app.post('/api/android/login', (req, res) => {
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
    if (user.is_active !== 1) {
      res.status(401).send('비활성화된 계정입니다');
      return;
    }

    // 여기서 사용자를 인증하고 고유한 식별자를 생성하여 반환합니다.
    const userId = user.id; // 사용자의 고유한 ID

    // 쿠키에 사용자 ID를 저장합니다.
    res.cookie('userId', userId, { httpOnly: true }); // httpOnly: true로 설정하여 JavaScript에서 쿠키에 접근하지 못하도록 합니다.

    console.log('사용자 인증 및 식별자 생성:', userId);
    res.status(200).json({ userId });
  });
});

// 안드로이드 사용자 정보 가져오기
app.get('/api/android/userinfo', (req, res) => {
  // 쿠키에서 사용자 ID를 추출합니다.
  const userId = req.cookies.userId;

  // 사용자 ID를 사용하여 데이터베이스에서 사용자 정보를 가져옵니다.
  connection.query(
    "SELECT gender, name, role, phoneNumber, birthdate, email FROM members WHERE id = ?;",
    [userId], 
    (err, rows, fields) => {
      if (err) {
        console.error('회원 정보 조회 실패: ' + err.stack);
        res.status(500).json({ error: '회원 정보 조회 실패' }); // JSON 형식으로 오류 응답
        return;
      }

      if (rows.length === 0) {
        console.error('사용자 정보가 없습니다.');
        res.status(404).json({ error: '사용자 정보가 없습니다.' }); // JSON 형식으로 오류 응답
        return;
      }

      // 조회된 사용자 정보를 JSON 형식으로 응답
      const user = rows[0];
      const userInfo = {
        gender: user.gender,
        name: user.name,
        role: user.role,
        phoneNumber: user.phoneNumber,
        birthdate: user.birthdate,
        email: user.email
      };
      res.status(200).json(userInfo); // JSON 형식으로 사용자 정보 응답
    }
  );
});

// 사용자 정보 업데이트
app.post('/api/updateuserinfo', (req, res) => {
  const userId = req.session.userId;
  const { name, gender, phoneNumber, role, email } = req.body;

  connection.query(
    "UPDATE members SET name = ?, gender = ?, phoneNumber = ?, role = ?, email = ? WHERE id = ?",
    [name, gender, phoneNumber, role, email, userId],
    (err, result) => {
      if (err) {
        console.error('사용자 정보 업데이트 실패:', err);
        res.status(500).send('사용자 정보 업데이트 실패');
        return;
      }
      console.log('사용자 정보가 성공적으로 업데이트되었습니다.');
      res.status(200).send('사용자 정보가 성공적으로 업데이트되었습니다.');
    }
  );
});



// 내정보 유저정보 가져오기
app.get('/api/userinfo', (req, res) => {
  const userId = req.session.userId; 

 console.log('현재 로그인된 사용자의 세션 ID:', userId);
  connection.query(
    "SELECT gender, name, role, phoneNumber, birthdate ,email FROM members WHERE id = ?;",
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

// 관리자 페이지에 사용자 정보 가져오기
app.get('/api/cmsusers', (req, res) => {
  connection.query(
    "SELECT id, username, email, name, birthdate, gender, phoneNumber, role, joinDate FROM members WHERE role = '환자' OR role = '보호자'",
    (err, rows, fields) => {
      if (err) {
        console.error('사용자 정보 조회 실패: ' + err.stack);
        res.status(500).send('사용자 정보 조회 실패');
        return;
      }
      res.json(rows);
    }
  );
});


// 비밀번호 변경
app.post('/api/changepassword', (req, res) => {
  const userId = req.session.userId;
  const { currentPassword, newPassword } = req.body;

  connection.query(
      "SELECT * FROM members WHERE id = ? AND password = ?",
      [userId, currentPassword],
      (err, result) => {
          if (err) {
              console.error('비밀번호 변경 실패: ' + err.stack);
              res.status(500).send('비밀번호 변경 실패');
              return;
          }
          if (result.length === 0) {
              res.status(401).send('현재 비밀번호가 올바르지 않습니다.');
              return;
          }

          connection.query(
              "UPDATE members SET password = ? WHERE id = ?",
              [newPassword, userId],
              (updateErr, updateResult) => {
                  if (updateErr) {
                      console.error('비밀번호 업데이트 실패: ' + updateErr.stack);
                      res.status(500).send('비밀번호 업데이트 실패');
                      return;
                  }
                  res.status(200).send('비밀번호가 성공적으로 변경되었습니다.');
              }
          );
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
// 로그인 여부 확인 api
app.get('/api/checklogin', (req, res) => {
  if (req.session.userId) {
    res.status(200).json({ isLoggedIn: true });
  } else {
    res.status(200).json({ isLoggedIn: false });
  }
});


// QnA 게시판 등록 api
app.post('/api/post', (req, res) => {
  const { title, content } = req.body;
  const userId = req.session.userId;
  const query = `SELECT name FROM members WHERE id = ?`;

  connection.query(query, [userId], (err, result) => {
    if (err) {
      console.error('사용자 이름 조회 중 오류 발생:', err);
      res.status(500).json({ error: '사용자 이름 조회 중 오류 발생' });
      return;
    }

    if (result.length === 0) {
      console.error('사용자를 찾을 수 없습니다.');
      res.status(404).json({ error: '사용자를 찾을 수 없습니다.' });
      return;
    }

    const name = result[0].name;

    const insertQuery = `INSERT INTO boards (title, content, board_type, is_answer, name, create_at) VALUES (?, ?, 'QnA', 'Y', ?, NOW())`;

    connection.query(insertQuery, [title, content, name], (insertErr, insertResult) => {
      if (insertErr) {  
        console.error('글 저장 중 오류 발생:', insertErr);
        res.status(500).json({ error: '글 저장 중 오류 발생' });
        return;
      }
      console.log('글이 성공적으로 저장되었습니다.');
      res.status(200).json({ message: '글이 성공적으로 저장되었습니다.' });
    });
  });
});

// QnA 게시판만 검색 API
app.get('/api/qnaposts', (req, res) => {
  const query = `SELECT * FROM boards WHERE board_type = 'QnA'`;

  connection.query(query, (err, results) => {
    if (err) {
      console.error('QNA 게시글 조회 중 오류 발생:', err);
      res.status(500).json({ error: 'QNA 게시글 조회 중 오류 발생' });
      return;
    }
    
    res.status(200).json(results);
  });
});

// 검색 기능.
app.post('/api/search-posts', (req, res) => {
  const { searchType, searchKeyword } = req.body;
  let query = "";
  if (searchType === "title") {
    query = `SELECT * FROM boards WHERE board_type = 'QnA' AND title LIKE '%${searchKeyword}%'`;
  } else if (searchType === "author") {
    query = `SELECT * FROM boards WHERE board_type = 'QnA' AND name LIKE '%${searchKeyword}%'`;
  } else {
    res.status(400).json({ error: '유효하지 않은 검색 조건입니다.' });
    return;
  }

  connection.query(query, (err, result) => {
    if (err) {
      console.error('검색 중 오류 발생:', err);
      res.status(500).json({ error: '검색 중 오류 발생' });
      return;
    }

    res.status(200).json(result); 
  });
});


app.get('/api/qnaposts/:postId', (req, res) => {
  const postId = req.params.postId;
  const query = `SELECT * FROM boards WHERE board_id = ?`;

  connection.query(query, [postId], (err, result) => {
    if (err) {
      console.error('게시글 조회 중 오류 발생:', err);
      res.status(500).json({ error: '게시글 조회 중 오류 발생' });
      return;
    }

    if (result.length === 0) {
      console.error('해당 ID의 게시글을 찾을 수 없습니다.');
      res.status(404).json({ error: '해당 ID의 게시글을 찾을 수 없습니다.' });
      return;
    }

    const post = result[0];
    res.status(200).json(post);
  });
});


// server.js
app.get('/api/getUserName', (req, res) => {
  if (req.session.userId) {
    const query = 'SELECT name FROM members WHERE id = ?';
    connection.query(query, [req.session.userId], (err, result) => {
      if (err) {
        console.error('사용자 이름 조회 중 오류 발생:', err);
        res.status(500).json({ error: '사용자 이름 조회 중 오류 발생' });
        return;
      }
      if (result.length === 0) {
        console.error('해당 ID의 사용자를 찾을 수 없습니다.');
        res.status(404).json({ error: '해당 ID의 사용자를 찾을 수 없습니다.' });
        return;
      }
      const userName = result[0].name;
      res.status(200).json({ userName: userName });
    });
  } else {
    res.status(200).json({ userName: null });
  }
});

// QnA 게시글 삭제
app.delete('/api/qnaposts/:id', (req, res) => {
  const postId = req.params.id;

  connection.query('DELETE FROM boards WHERE board_id = ?', postId, (error, results) => {
    if (error) {
      console.error('게시글 삭제 실패:', error);
      res.status(500).json({ success: false, message: '게시글 삭제 실패' });
    } else {
      console.log('게시글 삭제 성공');
      res.status(200).json({ success: true, message: '게시글 삭제 성공' });
    }
  });
});




// 공지사항 등록 api
app.post('/api/addNotice', (req, res) => {
  const { title, content } = req.body;
  const userId = req.session.userId; 
  const query = `SELECT name FROM members WHERE id = ?`;

  connection.query(query, [userId], (err, result) => {
    if (err) {
      console.error('사용자 이름 조회 중 오류 발생:', err);
      res.status(500).json({ error: '사용자 이름 조회 중 오류 발생' });
      return;
    }

    if (result.length === 0) {
      console.error('사용자를 찾을 수 없습니다.');
      res.status(404).json({ error: '사용자를 찾을 수 없습니다.' });
      return;
    }

    const name = result[0].name;

    const insertQuery = `INSERT INTO boards (title, content, board_type, is_answer, name, create_at) VALUES (?, ?, '공지사항', 'N', ?, NOW())`;

    connection.query(insertQuery, [title, content, name], (insertErr, insertResult) => {
      if (insertErr) {
        console.error('공지사항 저장 중 오류 발생:', insertErr);
        res.status(500).json({ error: '공지사항 저장 중 오류 발생' });
        return;
      }
      console.log('공지사항이 성공적으로 저장되었습니다.');
      res.status(200).json({ message: '공지사항이 성공적으로 저장되었습니다.' });
    });
  });
});
// 공지사항 조회 api
app.get('/api/notices', (req, res) => {
  const query = `SELECT * FROM boards WHERE board_type = '공지사항' ORDER BY create_at DESC`;

  connection.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching notices from database:', err);
      res.status(500).json({ error: 'Error fetching notices from database' });
      return;
    }
    res.json(results);
  });
});

//게시글 삭제
app.delete('/api/notices/:id', (req, res) => {
  const postId = req.params.id;

  connection.query('DELETE FROM boards WHERE board_id = ?', postId, (error, results) => {
    if (error) {
      console.error('게시글 삭제 실패:', error);
      res.status(500).json({ success: false, message: '게시글 삭제 실패' });
    } else {
      console.log('게시글 삭제 성공');
      res.status(200).json({ success: true, message: '게시글 삭제 성공' });
    }
  });
});

// 공지사항

//FAQ 쪽 server
//FAQ 등록 API
app.post('/api/addFaQ', (req, res) => {
  const { title, content } = req.body;
  const userId = req.session.userId; 
  const query = `SELECT name FROM members WHERE id = ?`;
  connection.query(query, [userId], (err, result) => {
    if (err) {
      console.error('사용자 이름 조회 중 오류 발생:', err);
      res.status(500).json({ error: '사용자 이름 조회 중 오류 발생' });
      return;
    }
    if (result.length === 0) {
      console.error('사용자를 찾을 수 없습니다.');
      res.status(404).json({ error: '사용자를 찾을 수 없습니다.' });
      return;
    }
    const name = result[0].name;
    const insertQuery = `INSERT INTO boards (title, content, board_type, is_answer, name, create_at) VALUES (?, ?, 'FAQ', 'N', ?, NOW())`;
    connection.query(insertQuery, [title, content, name], (insertErr, insertResult) => {
      if (insertErr) {
        console.error('공지사항 저장 중 오류 발생:', insertErr);
        res.status(500).json({ error: 'FAQ 저장 중 오류 발생' });
        return;
      }
      console.log('FAQ 이 성공적으로 저장되었습니다.');
      res.status(200).json({ message: 'FAQ 페이지가 성공적으로 저장되었습니다.' });
    });
  });
});

//FAQ 조회 API
app.get('/api/faq', (req, res) => {
  const query = `SELECT * FROM boards WHERE board_type = 'FAQ' ORDER BY create_at DESC`;

  connection.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching notices from database:', err);
      res.status(500).json({ error: 'Error fetching notices from database' });
      return;
    }
    res.json(results);
  });
});
//FAQ 게시글 삭제 .
app.delete('/api/faq/:id', (req, res) => {
  const postId = req.params.id;

  connection.query('DELETE FROM boards WHERE board_id = ?', postId, (error, results) => {
    if (error) {
      console.error('게시글 삭제 실패:', error);
      res.status(500).json({ success: false, message: '게시글 삭제 실패' });
    } else {
      console.log('게시글 삭제 성공');
      res.status(200).json({ success: true, message: '게시글 삭제 성공' });
    }
  });
});
//FAQ.

// 관리자인지 확인하고 접근 하도록 하기 위한
app.get('/api/checkRole', (req, res) => {
  const userId = req.session.userId;

  if (!userId) {
    res.status(401).send('세션이 만료되었습니다.');
    return;
  }

  const query = `SELECT role FROM members WHERE id = ?`;

  connection.query(query, [userId], (err, result) => {
    if (err) {
      console.error('역할 확인 실패:', err.stack);
      res.status(500).send('역할 확인 실패');
      return;
    }

    if (result.length === 0) {
      res.status(404).send('사용자를 찾을 수 없습니다.');
      return;
    }

    const role = result[0].role;
    res.status(200).json({ role });
  });
});


// 유저 비활성하
app.put('/api/deactivateUser/:userId', (req, res) => {
  const userId = req.params.userId;

  const query = `UPDATE members SET is_active = 0 WHERE id = ?`;

  connection.query(query, [userId], (err, result) => {
    if (err) {
      console.error('비활성화 오류:', err);
      res.status(500).send('서버 오류');
    } else {
      res.sendStatus(200);
    }
  });
});
// 유저 활성화
app.put('/api/activateUser/:userId', (req, res) => {
  const userId = req.params.userId;

  const query = `UPDATE members SET is_active = 1 WHERE id = ?`;

  connection.query(query, [userId], (err, result) => {
    if (err) {
      console.error('활성화 오류:', err);
      res.status(500).send('서버 오류');
    } else {
      res.sendStatus(200); 
    }
  });
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
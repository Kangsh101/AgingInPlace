const express = require('express');
const mysql = require('mysql');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const multer = require('multer');
const axios = require('axios');
const bodyParser = require('body-parser');
const qs = require('qs'); 


const path = require('path');
const app = express();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/')
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
  }
});
const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, 
    fieldSize: 10 * 1024 * 1024, 
  }
});


const kangsh = 'USE aginginplace';

app.use(cookieParser());
app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

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
// app.post('/api/signup', (req, res) => {
//   const { username, password, email, name, birthdate, gender, phoneNumber, role, patientId  } = req.body;

//   const query = `INSERT INTO members (username, password, email, name, birthdate, gender, phoneNumber, role, is_active, patientId ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1, ?)`;

//   connection.query(query, [username, password, email, name, birthdate, gender, phoneNumber, role, patientId ], (err, result) => {
//     if (err) {
//       console.error('회원가입 실패: ' + err.stack);
//       res.status(500).send('회원가입 실패');
//       return;
//     }
//     console.log('회원가입 성공');
//     res.status(200).send('회원가입 성공');
//   });
// });

app.post('/api/signup', (req, res) => {
  const { username, password, email, name, birthdate, gender, phoneNumber, role, patientId } = req.body;

  const insertGuardianQuery = `INSERT INTO members (username, password, email, name, birthdate, gender, phoneNumber, role, is_active, patientId) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1 ,?)`;

  connection.query(insertGuardianQuery, [username, password, email, name, birthdate, gender, phoneNumber, role, patientId], (err, result) => {
    if (err) {
      console.error('회원가입 실패: ' + err.stack);
      res.status(500).send('회원가입 실패');
      return;
    }
    const guardianId = result.insertId;

    // 환자 레코드에 보호자 ID 추가
    const updatePatientQuery = `UPDATE members SET guardianId = ? WHERE id = ?`;
    connection.query(updatePatientQuery, [guardianId, patientId], (updateErr, updateResult) => {
      if (updateErr) {
        console.error('보호자 ID 업데이트 실패:', updateErr);
        res.status (500).send('보호자 정보 업데이트 실패');
        return;
      }
      console.log('보호자 정보 업데이트 성공');
      res.status(200).send('회원가입 성공');
    });
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
    [userId], // userId 값을 플레이스홀더에 전달
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
// app.get('/api/userinfo', (req, res) => {
//   const userId = req.session.userId; 

//  console.log('현재 로그인된 사용자의 세션 ID:', userId);
//   connection.query(
//     "SELECT gender, name, role, phoneNumber, birthdate ,email FROM members WHERE id = ?;",
//     [userId], 
//     (err, rows, fields) => {
//       if (err) {
//         console.error('회원 정보 조회 실패: ' + err.stack);
//         res.status(500).send('회원 정보 조회 실패');
//         return;
//       }
//       res.send(rows);
//     }
//   );
// });
app.get('/api/userinfo', (req, res) => {
  const userId = req.session.userId;

  console.log('현재 로그인된 사용자의 세션 ID:', userId);
  connection.query(
    "SELECT gender, name, role, phoneNumber, birthdate, email FROM members WHERE id = ?;",
    [userId], 
    (err, rows, fields) => {
      if (err) {
        console.error('회원 정보 조회 실패: ' + err.stack);
        res.status(500).send('회원 정보 조회 실패');
        return;
      }
      if (rows.length > 0) {
        res.send(rows[0]); // 첫 번째 행만 반환
      } else {
        res.status(404).send('User not found');
      }
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
app.post('/api/qna/posts', upload.single('image'), async (req, res) => {  
  const { title, content } = req.body;
  const userId = req.session.userId; 
  const board_master_id = 1; 

  if (!userId) {
    return res.status(401).json({ error: '로그인 상태가 필요합니다.' });
  }
  
  try {
    const userQuery = 'SELECT role FROM members WHERE id = ?';
    const userResult = await queryAsync(userQuery, [userId]); 
    if (userResult.length === 0) {
      return res.status(404).json({ error: '사용자 정보를 찾을 수 없습니다.' });
    }
    const userRole = userResult[0].role;

    const boardQuery = 'SELECT write_type FROM board_master WHERE id = ?';
    const boardResult = await queryAsync(boardQuery, [board_master_id]); 
    if (boardResult.length === 0) {
      return res.status(404).json({ error: '게시판 정보를 찾을 수 없습니다.' });
    }
    const boardWriteType = boardResult[0].write_type;

    const allowedRoles = boardWriteType.split(',').map(role => role.trim()); 
    if (!allowedRoles.includes(userRole)) {
      return res.status(403).json({ error: '이 게시판에 글을 쓸 권한이 없습니다.' });
    }

    let imageUrl = '';
    if (req.file) {
      imageUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
    }

    const query = `INSERT INTO board_posts (board_master_id, title, content, user_id) VALUES (?, ?, ?, ?)`;
    connection.query(query, [board_master_id, title, content, userId], (err, result) => {
      if (err) {
        console.error('글 저장 중 오류 발생:', err);
        res.status(500).json({ error: '글 저장 중 오류 발생' });
        return;
      }
      res.status(200).json({ message: '글이 성공적으로 저장되었습니다.', postId: result.insertId });
    });
  } catch (error) {
    console.error('서버 오류:', error);
    res.status(500).json({ error: '서버 내부 오류' });
  }
});
function queryAsync(query, params) {
  return new Promise((resolve, reject) => {
    connection.query(query, params, (error, results) => {
      if (error) reject(error);
      else resolve(results);
    });
  });
}



// QnA 게시판만 검색 API
app.get('/api/qnaposts', (req, res) => {
  const query = `
    SELECT bp.*, m.name as user_name 
    FROM board_posts bp
    JOIN members m ON bp.user_id = m.id
    WHERE bp.board_master_id = 1
    ORDER BY bp.created_at DESC
  `;

  connection.query(query, (err, results) => {
    if (err) {
      console.error('QNA 게시글 조회 중 오류 발생:', err);
      res.status(500).json({ error: 'QNA 게시글 조회 중 오류 발생' });
      return;
    }
    
    res.status(200).json(results);
  });
});

// QnA 검색.
app.post('/api/search-posts', (req, res) => {
  const { searchType, searchKeyword } = req.body;
  let query = "";

  if (searchType === "title") {
    query = `SELECT bp.*, m.name as user_name 
             FROM board_posts bp 
             JOIN members m ON bp.user_id = m.id 
             WHERE bp.board_master_id = 1 AND bp.title LIKE ?`;
  } else if (searchType === "author") {
    query = `SELECT bp.*, m.name as user_name 
             FROM board_posts bp 
             JOIN members m ON bp.user_id = m.id 
             WHERE bp.board_master_id = 1 AND m.name LIKE ?`;
  } else if (searchType === "title_author") {
    query = `SELECT bp.*, m.name as user_name 
             FROM board_posts bp 
             JOIN members m ON bp.user_id = m.id 
             WHERE bp.board_master_id = 1 AND (bp.title LIKE ? OR m.name LIKE ?)`;
  } else {
    res.status(400).json({ error: '유효하지 않은 검색 조건입니다.' });
    return;
  }

  const searchValue = `%${searchKeyword}%`;
  const queryValues = searchType === "title_author" ? [searchValue, searchValue] : [searchValue];

  connection.query(query, queryValues, (err, result) => {
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
  const query = `
    SELECT bp.*, m.name as user_name 
    FROM board_posts bp
    JOIN members m ON bp.user_id = m.id
    WHERE bp.post_id = ?
  `;

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

  connection.query('DELETE FROM board_posts WHERE post_id = ?', postId, (error, results) => {
    if (error) {
      console.error('게시글 삭제 실패:', error);
      res.status(500).json({ success: false, message: '게시글 삭제 실패' });
    } else {
      console.log('게시글 삭제 성공');
      res.status(200).json({ success: true, message: '게시글 삭제 성공' });
    }
  });
});

// QnA 게시판 업데이트
app.put('/api/qnaposts/:postId', (req, res) => {
  const { title, content } = req.body; 
  const { postId } = req.params; 

  const query = 'UPDATE board_posts SET title = ?, content = ? WHERE post_id = ?'; 

  connection.query(query, [title, content, postId], (error, results) => { 
    if (error) {
      console.error('게시글 업데이트 실패:', error);
      res.status(500).send('게시글 업데이트 실패');
    } else {
      console.log('게시글 업데이트 성공');
      res.status(200).send('게시글 업데이트 성공');
    }
  });
});


//공지사항 검색 
app.post('/api/notice/search', (req, res) => {
  const { searchType, searchKeyword } = req.body;
  let query = "";

  if (searchType === "title") {
    query = `SELECT bp.*, m.name as user_name 
             FROM board_posts bp 
             JOIN members m ON bp.user_id = m.id 
             WHERE bp.board_master_id = 2 AND bp.title LIKE ?`;
  } else if (searchType === "author") {
    query = `SELECT bp.*, m.name as user_name 
             FROM board_posts bp 
             JOIN members m ON bp.user_id = m.id 
             WHERE bp.board_master_id = 2 AND m.name LIKE ?`;
  } else if (searchType === "title_author") {
    query = `SELECT bp.*, m.name as user_name 
             FROM board_posts bp 
             JOIN members m ON bp.user_id = m.id 
             WHERE bp.board_master_id = 2 AND (bp.title LIKE ? OR m.name LIKE ?)`;
  } else {
    res.status(400).json({ error: '유효하지 않은 검색 조건입니다.' });
    return;
  }

  const searchValue = `%${searchKeyword}%`;
  const queryValues = searchType === "title_author" ? [searchValue, searchValue] : [searchValue];

  connection.query(query, queryValues, (err, result) => {
    if (err) {
      console.error('검색 중 오류 발생:', err);
      res.status(500).json({ error: '검색 중 오류 발생' });
      return;
    }

    res.status(200).json(result);
  });
});


// 공지사항 등록 api
app.post('/api/addNotice', (req, res) => {
  const { title, content } = req.body;
  const boardMasterId = 2; // 공지사항의 board_master_id는 2번입니다.

  const query = 'INSERT INTO board_posts (board_master_id, title, content, user_id) VALUES (?, ?, ?, ?)';

  // 여기서 user_id는 실제 사용자 ID로 설정해야 합니다. 세션 또는 다른 방법으로 가져올 수 있습니다.
  const userId = req.session.userId || 1; // 예시로 userId를 1로 설정

  connection.query(query, [boardMasterId, title, content, userId], (error, results) => {
    if (error) {
      console.error('공지사항 등록 실패:', error);
      res.status(500).json({ error: '공지사항 등록 실패' });
    } else {
      console.log('공지사항 등록 성공');
      res.status(200).json({ message: '공지사항이 성공적으로 등록되었습니다.' });
    }
  });
});

// 공지사항 목록
app.get('/api/notices', (req, res) => {
  const query = `
    SELECT bp.*, m.name as user_name, bm.board_name 
    FROM board_posts bp
    JOIN members m ON bp.user_id = m.id
    JOIN board_master bm ON bp.board_master_id = bm.id
    WHERE bp.board_master_id = 2
    ORDER BY bp.created_at DESC
  `;

  connection.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching notices from database:', err);
      res.status(500).json({ error: 'Error fetching notices from database' });
      return;
    }
    res.json(results);
  });
});

app.get('/api/notices/:postId', (req, res) => {
  const postId = req.params.postId;
  const query = `
    SELECT bp.*, m.name as user_name, bm.board_name 
    FROM board_posts bp
    JOIN members m ON bp.user_id = m.id
    JOIN board_master bm ON bp.board_master_id = bm.id
    WHERE bp.post_id = ?
  `;

  connection.query(query, [postId], (err, result) => {
    if (err) {
      console.error('Error fetching notice from database:', err);
      res.status(500).json({ error: 'Error fetching notice from database' });
      return;
    }

    if (result.length === 0) {
      console.error('No notice found with the given ID.');
      res.status(404).json({ error: 'No notice found with the given ID.' });
      return;
    }

    const post = result[0];
    res.status(200).json(post);
  });
});


//공지사항 게시글 삭제
app.delete('/api/notices/:id', (req, res) => {
  const { id } = req.params;

  const query = `DELETE FROM board_posts WHERE post_id = ?`;
  connection.query(query, [id], (err, result) => {
    if (err) {
      console.error('게시글 삭제 중 오류 발생:', err);
      res.status(500).json({ error: '게시글 삭제 중 오류 발생' });
      return;
    }
    res.status(200).json({ success: true, message: '게시글이 삭제되었습니다.' });
  });
});

// 공지사항 수정
app.put('/api/notices/:id', (req, res) => {
  const { id } = req.params;
  const { title, content } = req.body;

  const query = `UPDATE board_posts SET title = ?, content = ? WHERE post_id = ?`;
  connection.query(query, [title, content, id], (err, result) => {
    if (err) {
      console.error('게시글 수정 중 오류 발생:', err);
      res.status(500).json({ error: '게시글 수정 중 오류 발생' });
      return;
    }
    res.status(200).json({ success: true, message: '게시글이 수정되었습니다.' });
  });
});

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

// 회원가입 환자 체크
app.post('/api/check-patient', (req, res) => {
  const { patientName, phoneNumber } = req.body;
  const query = `SELECT id FROM members WHERE role = "환자" AND name = ? AND phoneNumber = ?`;

  connection.query(query, [patientName, phoneNumber], (err, results) => {
    if (err) {
      console.error('쿼리 오류:', err);
      res.status(500).json({ message: '서버 오류' });
      return;
    }
    if (results.length > 0) {
      res.json({ message: '있음', patientId: results[0].id });
    } else {
      res.json({ message: '없음' });
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



// guardianId로 환자 이름 가져오기
app.get('/api/getPatientName', (req, res) => {
  const guardianId = req.session.userId; 

  const query = `SELECT name FROM members WHERE id = (SELECT patientId FROM members WHERE id = ?)`;
  connection.query(query, [guardianId], (err, result) => {
    if (err) {
      console.error('환자 이름 조회 실패:', err);
      res.status(500).send('서버 오류');
    } else if (result.length === 0) {
      res.status(404).send('환자 정보를 찾을 수 없습니다.');
    } else {
      res.json({ patientName: result[0].name });
    }
  });
});



//톰캣에서 다운로드 가져오는 로직
app.post('/downloadFile', async (req, res) => {
  try {
    const response = await axios({
      url: 'http://13.124.80.232:8080/downloadCsv/activityAll',
      method: 'POST', // 적절한 HTTP 메서드로 설정
      responseType: 'arraybuffer' // blob 대신 arraybuffer로 설정
    });

    // 헤더 설정
    res.writeHead(200, {
      'Content-Type': 'application/octet-stream', // MIME 타입 설정
      'Content-Disposition': 'attachment; filename="download.csv"'
    });

    // 데이터를 바이너리 형태로 클라이언트에 전송
    res.end(Buffer.from(response.data)); // Buffer.from을 사용하여 ArrayBuffer를 처리
  } catch (error) {
    console.error('Error downloading file from Tomcat:', error);
    res.status(500).send('Failed to download file');
  }
});

app.post('/chart/calories', async (req, res) => {
  const username = 'Lee'; // username을 'Lee'로 설정

  try {
    const response = await axios.post('http://43.200.2.115:8080/chart/calories', qs.stringify({ username }), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching data from Java API server:', error.response?.data || error.message);
    res.status(500).json({ error: 'Error fetching data from Java API server' });
  }
});

app.post('/chart/steps', async (req, res) => {
  const username = 'Lee'; 

  try {
    const response = await axios.post('http://43.200.2.115:8080/chart/steps', qs.stringify({ username }), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching data from Java API server:', error.response?.data || error.message);
    res.status(500).json({ error: 'Error fetching data from Java API server' });
  }
});

app.post('/chart/sleep_duration', async (req, res) => {
  const username = 'ChartTest2'; 

  try {
    const response = await axios.post('http://43.200.2.115:8080/chart/duration', qs.stringify({ username }), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching data from Java API server:', error.response?.data || error.message);
    res.status(500).json({ error: 'Error fetching data from Java API server' });
  }
});

app.post('/chart/rem', async (req, res) => {
  const username = 'ChartTest2'; 

  try {
    const response = await axios.post('http://43.200.2.115:8080//chart/rem', qs.stringify({ username }), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching data from Java API server:', error.response?.data || error.message);
    res.status(500).json({ error: 'Error fetching data from Java API server' });
  }
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
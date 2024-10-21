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
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } 
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

  app.post('/api/upload', upload.single('image'), (req, res) => {
    if (!req.file) {
      return res.status(400).json({ error: '파일이 업로드되지 않았습니다.' });
    }
  
    const imageUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
    res.status(200).json({ imageUrl });
  });
  
  const bcrypt = require('bcrypt');
  const saltRounds = 10; 

  app.post('/api/signup', (req, res) => {
    const { username, password, email, name, birthdate, gender, phoneNumber, role, patientId } = req.body;

    bcrypt.hash(password, saltRounds, (err, hashedPassword) => {
      if (err) {
        console.error('비밀번호 해싱 실패: ' + err.stack);
        res.status(500).send('회원가입 실패');
        return;
      }
  
      const insertGuardianQuery = `INSERT INTO members (username, password, email, name, birthdate, gender, phoneNumber, role, is_active, patientId) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1, ?)`;

      connection.query(insertGuardianQuery, [username, hashedPassword, email, name, birthdate, gender, phoneNumber, role, patientId], (err, result) => {
        if (err) {
          console.error('회원가입 실패: ' + err.stack);
          res.status(500).send('회원가입 실패');
          return;
        }
        const guardianId = result.insertId;

        const updatePatientQuery = `UPDATE members SET guardianId = ? WHERE id = ?`;
        connection.query(updatePatientQuery, [guardianId, patientId], (updateErr, updateResult) => {
          if (updateErr) {
            console.error('보호자 ID 업데이트 실패:', updateErr);
            res.status(500).send('보호자 정보 업데이트 실패');
            return;
          }
          console.log('보호자 정보 업데이트 성공');
          res.status(200).send('회원가입 성공');
        });
      });
    });
  });

//로그인
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  const query = 'SELECT * FROM members WHERE username = ?';

  connection.query(query, [username], (err, results) => {
    if (err) {
      console.error('로그인 실패: ' + err.stack);
      res.status(500).send('로그인 실패');
      return;
    }
    
    if (results.length === 0) {

      res.status(401).send('아이디 또는 비밀번호가 올바르지 않습니다.');
      return;
    }

    const user = results[0];

    if (!user.password.startsWith('$2b$')) {

      if (user.password === password) {

        bcrypt.hash(password, saltRounds, (err, hashedPassword) => {
          if (err) {
            console.error('비밀번호 해싱 실패: ' + err.stack);
            res.status(500).send('로그인 실패');
            return;
          }

          const updateQuery = 'UPDATE members SET password = ? WHERE id = ?';
          connection.query(updateQuery, [hashedPassword, user.id], (err) => {
            if (err) {
              console.error('비밀번호 업데이트 실패: ' + err.stack);
              res.status(500).send('로그인 실패');
              return;
            }

            req.session.userId = user.id;
            req.session.userRole = user.role;

            console.log('세션에 저장된 기본키:', req.session.userId);
            console.log('세션에 저장된 역할:', req.session.userRole);

            res.status(200).json(user);
          });
        });
      } else {

        res.status(401).send('아이디 또는 비밀번호가 올바르지 않습니다.');
      }
    } else {

      bcrypt.compare(password, user.password, (err, isMatch) => {
        if (err) {
          console.error('비밀번호 비교 실패: ' + err.stack);
          res.status(500).send('로그인 실패');
          return;
        }

        if (!isMatch) {

          res.status(401).send('아이디 또는 비밀번호가 올바르지 않습니다.');
          return;
        }

        if (user.is_active !== 1) {

          res.status(401).send('비활성화된 계정입니다');
          return;
        }

        req.session.userId = user.id;
        req.session.userRole = user.role;

        console.log('세션에 저장된 기본키:', req.session.userId);
        console.log('세션에 저장된 역할:', req.session.userRole);

        res.status(200).json(user);
      });
    }
  });
});


// 안드로이드 로그인
app.post('/api/android/login', (req, res) => {
  const { username, password } = req.body;

  const query = 'SELECT * FROM members WHERE username = ?';

  connection.query(query, [username], (err, results) => {
    if (err) {
      console.error('로그인 실패: ' + err.stack);
      res.status(500).send('로그인 실패');
      return;
    }

    const user = results[0];


    if (!user.password.startsWith('$2b$')) {

      if (user.password === password) {

        bcrypt.hash(password, saltRounds, (err, hashedPassword) => {
          if (err) {
            console.error('비밀번호 해싱 실패: ' + err.stack);
            res.status(500).send('로그인 실패');
            return;
          }

          const updateQuery = 'UPDATE members SET password = ? WHERE id = ?';
          connection.query(updateQuery, [hashedPassword, user.id], (err) => {
            if (err) {
              console.error('비밀번호 업데이트 실패: ' + err.stack);
              res.status(500).send('로그인 실패');
              return;
            }

            req.session.userId = user.id;
            req.session.userRole = user.role;

            console.log('세션에 저장된 기본키:', req.session.userId);
            console.log('세션에 저장된 역할:', req.session.userRole);

            res.status(200).json(user);
          });
        });
      } else {

        res.status(401).send('아이디 또는 비밀번호가 올바르지 않습니다.');
      }
    } else {

      bcrypt.compare(password, user.password, (err, isMatch) => {
        if (err) {
          console.error('비밀번호 비교 실패: ' + err.stack);
          res.status(500).send('로그인 실패');
          return;
        }

        if (!isMatch) {

          res.status(401).send('아이디 또는 비밀번호가 올바르지 않습니다.');
          return;
        }

        if (user.is_active !== 1) {

          res.status(401).send('비활성화된 계정입니다');
          return;
        }

        req.session.userId = user.id;
        req.session.userRole = user.role;

        console.log('세션에 저장된 기본키:', req.session.userId);
        console.log('세션에 저장된 역할:', req.session.userRole);

        res.status(200).json(user);
      });
    }
  });
});

//안드로이드 회원가입
app.post('/api/android/signup', (req, res) => {
  const { username, password, email, name, birthdate, gender, phoneNumber, role, patientId } = req.body;

  bcrypt.hash(password, saltRounds, (err, hashedPassword) => {
    if (err) {
      console.error('비밀번호 해싱 실패: ' + err.stack);
      res.status(500).send('회원가입 실패');
      return;
    }

  const insertGuardianQuery = 'INSERT INTO members (username, password, email, name, birthdate, gender, phoneNumber, role, is_active, patientId) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1 ,?)';

  connection.query(insertGuardianQuery, [username, hashedPassword, email, name, birthdate, gender, phoneNumber, role, patientId], (err, result) => {
    if (err) {
      console.error('회원가입 실패: ' + err.stack);
      res.status(500).send('회원가입 실패');
      return;
    }
    const guardianId = result.insertId;

    const updatePatientQuery = `UPDATE members SET guardianId = ? WHERE id = ?`;
    connection.query(updatePatientQuery, [guardianId, patientId], (updateErr, updateResult) => {
      if (updateErr) {
        console.error('보호자 ID 업데이트 실패:', updateErr);
        res.status(500).send('보호자 정보 업데이트 실패');
        return;
      }
      console.log('보호자 정보 업데이트 성공');
      res.status(200).send('회원가입 성공');
    });
  });
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

//CIST question 가져오기 모바일
app.get('/api/android/cist_questions', (req, res) => {
  const query = 'SELECT * FROM CIST_Questions';

  connection.query(query, (err, results) => {
    if (err) {
      console.error('Failed to fetch questions: ' + err.stack);
      res.status(500).send('Failed to fetch questions');
      return;
    }
    res.json(results);
  });
});

//CIST response 저장하기 모바일
app.post('/api/android/cist_responses', (req, res) => {
  // 쿠키에서 사용자 ID를 추출합니다.
  const userId = req.cookies.userId;
  const { response, question_id } = req.body;

  if (!userId) {
    return res.status(400).json({ message: "사용자 ID가 없습니다." });
  }

  // 사용자 ID를 사용하여 members 테이블에서 test_id를 가져옵니다.
  const getTestIdQuery = 'SELECT test_id FROM members WHERE id = ?';

  connection.query(getTestIdQuery, [userId], (err, results) => {
    if (err) {
      return res.status(500).json({ message: "데이터베이스 오류입니다.", error: err });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: "사용자를 찾을 수 없습니다." });
    }

    const test_id = results[0].test_id;

    // CIST_Responses 테이블에 응답을 저장하는 쿼리
    const insertResponseQuery = 'INSERT INTO CIST_Responses (test_id, question_id, response) VALUES (?, ?, ?)';

    connection.query(insertResponseQuery, [test_id, question_id, response], (err, result) => {
      if (err) {
        return res.status(500).json({ message: "서버 응답 저장 중 오류가 발생했습니다.", error: err });
      }

      return res.status(200).json({ message: "서버 응답이 성공적으로 저장되었습니다." });
    });
  });
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
// 진단명 추가 환자만 가져오는 api
app.get('/api/cmsusersAdd', (req, res) => {
  const query = `
    SELECT p.id, p.name AS patientName, p.gender, p.role, g.name AS guardianName
    FROM members p
    LEFT JOIN members g ON p.guardianId = g.id
    WHERE p.role = '환자'
  `;
  connection.query(query, (err, rows, fields) => {
    if (err) {
      console.error('사용자 정보 조회 실패: ' + err.stack);
      res.status(500).send('사용자 정보 조회 실패');
      return;
    }
    res.json(rows);
  });
});
// CMS 수면/운동량 유저정보 가져오기 API
app.get('/api/PatientCriteriaAdd', (req, res) => {
  const query = `
    SELECT id, name, birthdate, gender, role FROM members WHERE role = '환자'
  `;
  connection.query(query, (err, rows, fields) => {
    if (err) {
      console.error('사용자 정보 조회 실패: ' + err.stack);
      res.status(500).send('사용자 정보 조회 실패');
      return;
    }
    res.json(rows);
  });
});

// 진단명 추가 부분 상세페이지 api
app.get('/api/patient/:id', (req, res) => {
  const { id } = req.params;
  connection.query(
    `SELECT * FROM members WHERE id = ?`, [id],
    (err, rows, fields) => {
      if (err) {
        console.error('환자 정보 조회 실패: ' + err.stack);
        res.status(500).send('환자 정보 조회 실패');
        return;
      }
      res.json(rows[0]);
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


// 특정 title에 해당하는 모든 문제를 가져오는 API
app.get('/api/cist_questions_by_title/:title', (req, res) => {
  const { title } = req.params;
  const query = 'SELECT * FROM CIST_Questions WHERE title = ?';

  connection.query(query, [title], (err, results) => {
    if (err) {
      console.error('Failed to fetch questions:', err.stack);
      res.status(500).send('Failed to fetch questions');
      return;
    }
    res.json(results);
  });
});
app.post('/api/cist_questions', upload.single('image'), (req, res) => {
  const { type, title, question_text, correct_answer } = req.body;
  let imageUrl = '';

  if (req.file) {
    imageUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
  }

  const query = `
    INSERT INTO CIST_Questions (type, title, question_text, image_url, correct_answer) 
    VALUES (?, ?, ?, ?, ?)
  `;

  connection.query(
    query,
    [type, title, question_text, imageUrl, correct_answer],
    (err, result) => {
      if (err) {
        console.error('CIST 질문 저장 실패:', err.stack);
        res.status(500).send('CIST 질문 저장 실패');
        return;
      }
      res.status(200).send('CIST 질문 저장 성공');
    }
  );
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

// QnA 게시판 검색(답글도) API
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
    
    // Fetching answers for each post
    const postIds = results.map(post => post.post_id);
    if (postIds.length === 0) {
      return res.status(200).json(results);
    }

    const answersQuery = `
      SELECT ba.*, m.name as user_name
      FROM board_answers ba
      JOIN members m ON ba.user_id = m.id
      WHERE ba.post_id IN (?)
      ORDER BY ba.created_at ASC
    `;

    connection.query(answersQuery, [postIds], (err, answers) => {
      if (err) {
        console.error('답글 조회 중 오류 발생:', err);
        res.status(500).json({ error: '답글 조회 중 오류 발생' });
        return;
      }

      const postsWithAnswers = results.map(post => {
        return {
          ...post,
          answers: answers.filter(answer => answer.post_id === post.post_id)
        };
      });

      res.status(200).json(postsWithAnswers);
    });
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


//QnA 상세 페이지 
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

// 댓글 등록
app.post('/api/qna/comments', (req, res) => {
  const { postId, content } = req.body;
  const userId = req.session.userId;

  if (!userId) {
    return res.status(401).json({ error: '로그인이 필요합니다.' });
  }

  const query = 'INSERT INTO board_comment (post_id, user_id, content) VALUES (?, ?, ?)';
  connection.query(query, [postId, userId, content], (err, result) => {
    if (err) {
      console.error('댓글 등록 실패:', err);
      res.status(500).json({ error: '댓글 등록 실패' });
    } else {
      res.status(200).json({ success: true, commentId: result.insertId });
    }
  });
});

// 댓글 수정
app.put('/api/qna/comments/:commentId', (req, res) => {
  const { content } = req.body;
  const { commentId } = req.params;
  const userId = req.session.userId;

  if (!userId) {
    return res.status(401).json({ error: '로그인이 필요합니다.' });
  }

  const query = 'UPDATE board_comment SET content = ? WHERE comment_id = ? AND user_id = ?';
  connection.query(query, [content, commentId, userId], (err, result) => {
    if (err) {
      console.error('댓글 수정 실패:', err);
      res.status(500).json({ error: '댓글 수정 실패' });
    } else {
      res.status(200).json({ success: true });
    }
  });
});

// 댓글 삭제
app.delete('/api/qna/comments/:commentId', (req, res) => {
  const { commentId } = req.params;
  const userId = req.session.userId;

  if (!userId) {
    return res.status(401).json({ error: '로그인이 필요합니다.' });
  }

  const query = 'DELETE FROM board_comment WHERE comment_id = ? AND user_id = ?';
  connection.query(query, [commentId, userId], (err, result) => {
    if (err) {
      console.error('댓글 삭제 실패:', err);
      res.status(500).json({ error: '댓글 삭제 실패' });
    } else {
      res.status(200).json({ success: true });
    }
  });
});
// 댓글 가져오기
app.get('/api/qna/comments/:postId', (req, res) => {
  const postId = req.params.postId;

  const query = `
    SELECT bc.*, m.name as user_name 
    FROM board_comment bc
    JOIN members m ON bc.user_id = m.id
    WHERE bc.post_id = ?
    ORDER BY bc.created_at ASC
  `;

  connection.query(query, [postId], (err, results) => {
    if (err) {
      console.error('댓글 조회 실패:', err);
      res.status(500).json({ error: '댓글 조회 실패' });
    } else {
      res.status(200).json(results);
    }
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

  connection.query('DELETE FROM board_answers WHERE post_id = ?', [postId], (answerErr) => {
    if (answerErr) {
      console.error('답글 삭제 실패:', answerErr);
      return res.status(500).json({ error: '답글 삭제 실패' });
    }

    connection.query('DELETE FROM board_comment WHERE post_id = ?', [postId], (commentErr) => {
      if (commentErr) {
        console.error('댓글 삭제 실패:', commentErr);
        return res.status(500).json({ error: '댓글 삭제 실패' });
      }

      connection.query('DELETE FROM board_posts WHERE post_id = ?', [postId], (postErr) => {
        if (postErr) {
          console.error('게시글 삭제 실패:', postErr);
          return res.status(500).json({ error: '게시글 삭제 실패' });
        }

        res.status(200).json({ success: true, message: '게시글 삭제 성공' });
      });
    });
  });
});


// QnA 게시글 수정 API
app.put('/api/qnaposts/:postId', (req, res) => {
  const { postId } = req.params;
  const { title, content } = req.body;

  const query = 'UPDATE board_posts SET title = ?, content = ? WHERE post_id = ?';
  connection.query(query, [title, content, postId], (err, result) => {
    if (err) {
      console.error('게시글 업데이트 실패:', err);
      res.status(500).json({ success: false, message: '게시글 업데이트 실패' });
    } else {
      res.status(200).json({ success: true, message: '게시글 업데이트 성공' });
    }
  });
});

//답글 등록
app.post('/api/qna/answers', (req, res) => {
  const { postId, content, title } = req.body; // 여기에서 postId를 정확히 받고 있는지 확인
  const userId = req.session.userId;

  if (!userId) {
    return res.status(401).json({ error: '로그인이 필요합니다.' });
  }

  const query = 'INSERT INTO board_answers (title, post_id, user_id, content) VALUES (?, ?, ?, ?)';
  connection.query(query, [title,postId, userId, content], (err, result) => {
    if (err) {
      console.error('답글 등록 실패:', err);
      res.status(500).json({ error: '답글 등록 실패' });
    } else {
      res.status(200).json({ success: true, answerId: result.insertId });
    }
  });
});

// 답글 수정
app.put('/api/qna/answers/:answerId', (req, res) => {
  const { answerId } = req.params;
  const { title, content } = req.body;
  const userId = req.session.userId;

  if (!userId) {
    return res.status(401).json({ error: '로그인이 필요합니다.' });
  }

  const query = 'UPDATE board_answers SET title = ?, content = ? WHERE answer_id = ? AND user_id = ?';
  connection.query(query, [title, content, answerId, userId], (err, result) => {
    if (err) {
      console.error('답글 수정 실패:', err);
      return res.status(500).json({ error: '답글 수정 실패' });
    }

    if (result.affectedRows === 0) {
      return res.status(403).json({ error: '수정 권한이 없습니다.' });
    }

    res.status(200).json({ success: true, message: '답글 수정 성공' });
  });
});


// 답글 삭제
app.delete('/api/qna/answers/:answerId', (req, res) => {
  const { answerId } = req.params;
  const userId = req.session.userId;

  if (!userId) {
    return res.status(401).json({ error: '로그인이 필요합니다.' });
  }

  const query = 'DELETE FROM board_answers WHERE answer_id = ? AND user_id = ?';
  connection.query(query, [answerId, userId], (err, result) => {
    if (err) {
      console.error('답글 삭제 실패:', err);
      return res.status(500).json({ error: '답글 삭제 실패' });
    }

    if (result.affectedRows === 0) {
      return res.status(403).json({ error: '삭제 권한이 없습니다.' });
    }

    res.status(200).json({ success: true, message: '답글 삭제 성공' });
  });
});

app.get('/api/qna/answers/:answerId', (req, res) => {
  const { answerId } = req.params;

  const query = `
    SELECT ba.*, m.name as user_name 
    FROM board_answers ba
    JOIN members m ON ba.user_id = m.id
    WHERE ba.answer_id = ?
  `;

  connection.query(query, [answerId], (err, result) => {
    if (err) {
      console.error('답글 조회 실패:', err);
      return res.status(500).json({ error: '답글 조회 실패' });
    }

    if (result.length === 0) {
      return res.status(404).json({ error: '답글을 찾을 수 없습니다.' });
    }

    res.status(200).json(result[0]);
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
// 공지사항 상세페이지
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


// FAQ 등록
app.post('/api/addFaq', (req, res) => {
  const { title, content } = req.body;
  const user_id = req.session.userId;

  if (!user_id) {
    return res.status(401).json({ error: '로그인이 필요합니다.' });
  }

  const query = `INSERT INTO board_posts (board_master_id, title, content, user_id, created_at) VALUES (3, ?, ?, ?, NOW())`;

  connection.query(query, [title, content , user_id], (err, result) => {
    if (err) {
      console.error('FAQ 등록 중 오류 발생:', err);
      res.status(500).json({ error: 'FAQ 등록 중 오류 발생' });
      return;
    }
    res.status(200).json({ success: true, message: 'FAQ가 성공적으로 등록되었습니다.' });
  });
});

// FAQ 조회
app.get('/api/faq', (req, res) => {
  const query = `
    SELECT bp.*, m.name as user_name 
    FROM board_posts bp
    JOIN members m ON bp.user_id = m.id
    WHERE bp.board_master_id = 3 
    ORDER BY bp.created_at DESC
  `;

  connection.query(query, (err, results) => {
    if (err) {
      console.error('FAQ 게시글 조회 중 오류 발생:', err);
      res.status(500).json({ error: 'FAQ 게시글 조회 중 오류 발생' });
      return;
    }
    res.json(results);
  });
});

// FAQ 삭제
app.delete('/api/faq/:id', (req, res) => {
  const postId = req.params.id;
  const query = 'DELETE FROM board_posts WHERE post_id = ?';

  connection.query(query, [postId], (err, result) => {
    if (err) {
      console.error('FAQ 게시글 삭제 중 오류 발생:', err);
      res.status(500).json({ error: 'FAQ 게시글 삭제 중 오류 발생' });
      return;
    }
    res.status(200).json({ success: true });
  });
});

// 단일 FAQ 조회
app.get('/api/faq/:id', (req, res) => {
  const postId = req.params.id;
  const query = `
    SELECT bp.*, m.name as user_name 
    FROM board_posts bp
    JOIN members m ON bp.user_id = m.id
    WHERE bp.post_id = ?
  `;

  connection.query(query, [postId], (err, result) => {
    if (err) {
      console.error('FAQ 조회 중 오류 발생:', err);
      res.status(500).json({ error: 'FAQ 조회 중 오류 발생' });
      return;
    }
    res.json(result[0]);
  });
});

// FAQ 수정
app.put('/api/faq/:id', (req, res) => {
  const postId = req.params.id;
  const { title, content } = req.body;
  const user_id = req.session.userId;

  if (!user_id) {
    return res.status(401).json({ error: '로그인이 필요합니다.' });
  }

  const query = `UPDATE board_posts SET title = ?, content = ?, user_id = ? WHERE post_id = ?`;

  connection.query(query, [title, content, user_id, postId], (err, result) => {
    if (err) {
      console.error('FAQ 수정 중 오류 발생:', err);
      res.status(500).json({ error: 'FAQ 수정 중 오류 발생' });
      return;
    }
    res.status(200).json({ success: true, message: 'FAQ가 성공적으로 수정되었습니다.' });
  });
});


// FAQ 조회
app.get('/api/faq', (req, res) => {
  const query = `
    SELECT bp.*, m.name as user_name 
    FROM board_posts bp
    JOIN members m ON bp.user_id = m.id
    WHERE bp.board_master_id = 3 
    ORDER BY bp.created_at DESC
  `;

  connection.query(query, (err, results) => {
    if (err) {
      console.error('FAQ 게시글 조회 중 오류 발생:', err);
      res.status(500).json({ error: 'FAQ 게시글 조회 중 오류 발생' });
      return;
    }
    res.json(results);
  });
});

// FAQ 삭제
app.delete('/api/faq/:id', (req, res) => {
  const postId = req.params.id;
  const query = 'DELETE FROM board_posts WHERE post_id = ?';

  connection.query(query, [postId], (err, result) => {
    if (err) {
      console.error('FAQ 게시글 삭제 중 오류 발생:', err);
      res.status(500).json({ error: 'FAQ 게시글 삭제 중 오류 발생' });
      return;
    }
    res.status(200).json({ success: true });
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
// CMS
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
// 환자별로 운동량 / 수면시간 설정 엔드포인트
// 수정된 환자 기준 저장/업데이트 엔드포인트
app.post('/api/patientcriteria', (req, res) => {
  const { patient_id, sleep_startTime, sleep_endTime, exercise_amount, added_date } = req.body;

  const checkQuery = 'SELECT * FROM cms_patientdata WHERE patient_id = ?';
  connection.query(checkQuery, [patient_id], (err, results) => {
    if (err) {
      console.error('Error checking data:', err);
      res.status(500).json({ error: 'Error saving patient criteria' });
      return;
    }
    if (results.length > 0) {
      // 기존 데이터가 있는 경우 업데이트
      const updateQuery = `
        UPDATE cms_patientdata 
        SET sleep_startTime = ?, sleep_endTime = ?, exercise_amount = ?, added_date = ?
        WHERE patient_id = ?`;
      connection.query(updateQuery, [sleep_startTime, sleep_endTime, exercise_amount, added_date, patient_id], (err, result) => {
        if (err) {
          console.error('Error updating data:', err);
          res.status(500).json({ error: 'Error saving patient criteria' });
          return;
        }
        res.status(200).json({ message: 'Patient criteria updated successfully' });
      });
    } else {
      // 기존 데이터가 없는 경우 삽입
      const insertQuery = `
        INSERT INTO cms_patientdata (patient_id, sleep_startTime, sleep_endTime, exercise_amount, added_date) 
        VALUES (?, ?, ?, ?, ?)`;
      connection.query(insertQuery, [patient_id, sleep_startTime, sleep_endTime, exercise_amount, added_date], (err, result) => {
        if (err) {
          console.error('Error inserting data:', err);
          res.status(500).json({ error: 'Error saving patient criteria' });
          return;
        }
        res.status(200).json({ message: 'Patient criteria saved successfully' });
      });
    }
  });
});
// 환자 기준 데이터를 가져오는 엔드포인트
app.get('/api/patientcriteria/:id', (req, res) => {
  const patient_id = req.params.id;

  const query = `
    SELECT sleep_startTime, sleep_endTime, exercise_amount 
    FROM cms_patientdata 
    WHERE patient_id = ?`;
  connection.query(query, [patient_id], (err, results) => {
    if (err) {
      console.error('Error fetching data:', err);
      res.status(500).json({ error: 'Error fetching patient criteria' });
      return;
    }

    if (results.length > 0) {
      res.status(200).json(results[0]);
    } else {
      res.status(404).json({ error: 'No data found' });
    }
  });
});

// 진단명 추가.
app.post('/api/addDiagnosis', (req, res) => {
  const { patientId, diagnoses, enteredBy } = req.body;

  const query = 'INSERT INTO diagnoses (patient_id, diagnosis, diagnosis_date, entered_by) VALUES ?';
  const values = diagnoses.map(diagnosis => [patientId, diagnosis, new Date(), enteredBy]);

  connection.query(query, [values], (error, results) => {
    if (error) {
      console.error('Error adding diagnoses:', error);
      res.status(500).json({ message: 'Error adding diagnoses', error });
      return;
    }
    res.status(200).json({ message: 'Diagnoses added successfully' });
  });
});


//약물 추가
app.post('/api/addMedications', (req, res) => {
  const { patientId, medications, enteredBy } = req.body;

  const query = 'INSERT INTO medications (patient_id, medication, dosage, frequency, start_date, end_date, entered_by) VALUES ?';
  const values = medications.map(medication => [patientId, medication.name, medication.dosage, medication.frequency, new Date(), null, enteredBy]);

  connection.query(query, [values], (error, results) => {
    if (error) {
      console.error('Error adding medications:', error);
      res.status(500).json({ message: 'Error adding medications', error });
      return;
    }
    res.status(200).json({ message: 'Medications added successfully' });
  });
});


// 진단명목록 데이터 가져오기 엔드포인트
app.get('/api/getUserDetails', (req, res) => {
  const userId = req.session.userId;

  const query = `
    SELECT id, role, name, patientId
    FROM members
    WHERE id = ?;
  `;

  connection.query(query, [userId], (err, results) => {
    if (err) {
      console.error('사용자 정보 조회 실패:', err);
      res.status(500).json({ message: '사용자 정보 조회 실패', error: err });
    } else if (results.length === 0) {
      res.status(404).json({ message: '사용자 정보를 찾을 수 없습니다.' });
    } else {
      res.status(200).json(results[0]);
    }
  });
});

// 진단명 목록 보여주기 엔드포인트 
app.get('/api/getPatientDetails', (req, res) => {
  const userId = req.session.userId;

  connection.query('SELECT role, patientId FROM members WHERE id = ?', [userId], (err, userResults) => {
      if (err) {
          console.error('사용자 정보 조회 실패:', err);
          res.status(500).json({ message: '사용자 정보 조회 실패', error: err });
      } else if (userResults.length === 0) {
          res.status(404).json({ message: '사용자 정보를 찾을 수 없습니다.' });
      } else {
          const userRole = userResults[0].role;
          const patientId = userRole === '보호자' ? userResults[0].patientId : userId;

          // 환자 정보 가져오기
          connection.query('SELECT name AS patientName FROM members WHERE id = ?', [patientId], (err, patientResults) => {
              if (err || patientResults.length === 0) {
                  console.error('환자 이름 조회 실패:', err);
                  res.status(500).json({ message: '환자 이름 조회 실패', error: err });
              } else {
                  const patientName = patientResults[0].patientName;

                  // 진단명 가져오기
                  connection.query('SELECT id, diagnosis AS name FROM diagnoses WHERE patient_id = ?', [patientId], (err, diagnosesResults) => {
                      if (err) {
                          console.error('진단명 조회 실패:', err);
                          res.status(500).json({ message: '진단명 조회 실패', error: err });
                      } else {
                          // 약물 가져오기
                          connection.query('SELECT id, medication, dosage, frequency FROM medications WHERE patient_id = ?', [patientId], (err, medicationsResults) => {
                              if (err) {
                                  console.error('약물 조회 실패:', err);
                                  res.status(500).json({ message: '약물 조회 실패', error: err });
                              } else {
                                  const patientDetails = {
                                      patientName: patientName,
                                      diagnoses: diagnosesResults,
                                      medications: medicationsResults
                                  };

                                  res.status(200).json(patientDetails);
                              }
                          });
                      }
                  });
              }
          });
      }
  });
});


// 진단명 추가 API
app.post('/api/addDiagnosisByAdmin', (req, res) => {
  const { patientId, diagnoses, enteredBy } = req.body;

  const query = 'INSERT INTO diagnoses (patient_id, diagnosis, diagnosis_date, entered_by) VALUES ?';
  const values = diagnoses.map(diagnosis => [patientId, diagnosis, new Date(), enteredBy]);

  connection.query(query, [values], (error, results) => {
    if (error) {
      console.error('Error adding diagnoses:', error);
      res.status(500).json({ message: 'Error adding diagnoses', error });
      return;
    }
    res.status(200).json({ message: 'Diagnoses added successfully' });
  });
});

// 약물 정보 추가 API
app.post('/api/addMedicationsByAdmin', (req, res) => {
  const { patientId, medications, enteredBy } = req.body;

  const query = 'INSERT INTO medications (patient_id, medication, dosage, frequency, start_date, end_date, entered_by) VALUES ?';
  const values = medications.map(medication => [patientId, medication.name, medication.dosage, medication.frequency, new Date(), null, enteredBy]);

  connection.query(query, [values], (error, results) => {
    if (error) {
      console.error('Error adding medications:', error);
      res.status(500).json({ message: 'Error adding medications', error });
      return;
    }
    res.status(200).json({ message: 'Medications added successfully' });
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

app.get('/api/currentUser', (req, res) => {
  const userId = req.session.userId;
  if (!userId) {
    return res.status(401).send('User not logged in');
  }
  res.status(200).json({ userId });
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
app.get('/api/patient/:id/diagnoses', (req, res) => {
  const patientId = req.params.id;

  const query = 'SELECT id, diagnosis, diagnosis_date, entered_by FROM diagnoses WHERE patient_id = ?';
  connection.query(query, [patientId], (err, results) => {
    if (err) {
      console.error('Error fetching diagnoses:', err);
      res.status(500).send('Error fetching diagnoses');
      return;
    }
    res.json(results);
  });
});

// 환자의 복용약물 목록 가져오기
app.get('/api/patient/:id/medications', (req, res) => {
  const patientId = req.params.id;

  const query = 'SELECT id, medication as name, dosage, frequency FROM medications WHERE patient_id = ?';
  connection.query(query, [patientId], (err, results) => {
    if (err) {
      console.error('Error fetching medications:', err);
      res.status(500).send('Error fetching medications');
      return;
    }
    res.json(results);
  });
});
// 진단명 삭제
app.delete('/api/diagnoses/:id', (req, res) => {
  const diagnosisId = req.params.id;

  const query = 'DELETE FROM diagnoses WHERE id = ?';
  connection.query(query, [diagnosisId], (err, result) => {
    if (err) {
      console.error('Error deleting diagnosis:', err);
      res.status(500).send('Error deleting diagnosis');
      return;
    }
    if (result.affectedRows === 0) {
      res.status(404).send('Diagnosis not found');
      return;
    }
    res.status(200).send('Diagnosis deleted successfully');
  });
});

// 복용약물 삭제
app.delete('/api/medications/:id', (req, res) => {
  const medicationId = req.params.id;
  const query = 'DELETE FROM medications WHERE id = ?';
  connection.query(query, [medicationId], (err, result) => {
    if (err) {
      console.error('Error deleting medication:', err);
      res.status(500).send('Error deleting medication');
      return;
    }
    if (result.affectedRows === 0) {
      res.status(404).send('Medication not found');
      return;
    }
    res.status(200).send('Medication deleted successfully');
  });
});


// 진단명을 삭제하는 API
app.delete('/api/deleteDiagnosis', (req, res) => {
  const { diagnosisId } = req.body;

  if (!diagnosisId) {
      return res.status(400).json({ message: '진단 ID가 필요합니다.' });
  }

  const query = 'DELETE FROM diagnoses WHERE id = ?';
  connection.query(query, [diagnosisId], (err, results) => {
      if (err) {
          console.error('진단명 삭제 실패:', err);
          res.status(500).json({ message: '진단명 삭제 실패', error: err });
      } else {
          res.status(200).json({ message: '진단명이 성공적으로 삭제되었습니다.' });
      }
  });
});

// 약물을 삭제하는 API
app.delete('/api/deleteMedication', (req, res) => {
  const { medicationId } = req.body;

  if (!medicationId) {
      return res.status(400).json({ message: '약물 ID가 필요합니다.' });
  }

  const query = 'DELETE FROM medications WHERE id = ?';
  connection.query(query, [medicationId], (err, results) => {
      if (err) {
          console.error('약물 삭제 실패:', err);
          res.status(500).json({ message: '약물 삭제 실패', error: err });
      } else {
          res.status(200).json({ message: '약물이 성공적으로 삭제되었습니다.' });
      }
  });
});


// 사용자 id 가져오기
app.get('/api/getUserId', (req, res) => {
  if (req.session.userId) {
    res.status(200).json({ userId: req.session.userId });
  } else {
    res.status(401).json({ error: 'User not logged in' });
  }
});
// 환자 정보 불러오기
app.get('/api/getPatientInfo', (req, res) => {
  const guardianId = req.session.userId;

  const query = `SELECT p.id AS patientId, p.name AS patientName 
                 FROM members p 
                 WHERE p.id = (
                   SELECT g.patientId 
                   FROM members g 
                   WHERE g.id = ?
                 )`;
  connection.query(query, [guardianId], (err, result) => {
    if (err) {
      console.error('환자 정보 조회 실패:', err);
      res.status(500).send('서버 오류');
    } else if (result.length === 0) {
      res.status(404).send('환자 정보를 찾을 수 없습니다.');
    } else {
      res.json({ patientName: result[0].patientName, patientId: result[0].patientId });
    }
  });
});

// 인지선별검사 CIST
app.post('/api/cist_questions', (req, res) => {
  const { type, question_text, answer_options, correct_answer } = req.body;

  const query = `INSERT INTO CIST_Questions (type, question_text, answer_options, correct_answer) VALUES (?, ?, ?, ?)`;

  connection.query(query, [type, question_text, JSON.stringify(answer_options), correct_answer], (err, result) => {
    if (err) {
      console.error('CIST 질문 저장 실패: ' + err.stack);
      res.status(500).send('CIST 질문 저장 실패');
      return;
    }
    res.status(200).send('CIST 질문 저장 성공');
  });
});

//현재 날짜를 가져옴.
app.get('/api/current_date', (req, res) => {
  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth() + 1; // 월은 0부터 시작하므로 1을 더해줌
  const date = currentDate.getDate();
  const day = currentDate.getDay(); // 0: 일요일, 1: 월요일, ..., 6: 토요일

  res.json({ year, month, date, day });
});
// 질문 목록 불러오기 API
app.get('/api/cist_questions', (req, res) => {
  const query = 'SELECT * FROM CIST_Questions';

  connection.query(query, (err, results) => {
    if (err) {
      console.error('Failed to fetch questions: ' + err.stack);
      res.status(500).send('Failed to fetch questions');
      return;
    }
    res.json(results);
  });
});
// 질문 삭제
app.delete('/api/cist_questions/:id', (req, res) => {
  const questionId = req.params.id;
  const query = 'DELETE FROM CIST_Questions WHERE id = ?';

  connection.query(query, [questionId], (err, results) => {
    if (err) {
      console.error('Failed to delete question: ' + err.stack);
      res.status(500).send('Failed to delete question');
      return;
    }
    res.status(200).send('Question deleted successfully');
  });
});
// 수정을 위한 특정 질문 가져오기
app.get('/api/cist_questions/:id', (req, res) => {
  const questionId = req.params.id;
  const query = 'SELECT * FROM CIST_Questions WHERE id = ?';

  connection.query(query, [questionId], (err, result) => {
    if (err) {
      console.error('Failed to fetch question: ' + err.stack);
      res.status(500).send('Failed to fetch question');
      return;
    }
    res.json(result[0]);
  });
});
// 질문 업데이트 엔드포인트
app.put('/api/cist_questions/:id', (req, res) => {
  const questionId = req.params.id;
  const { type, question_text, answer_options, correct_answer } = req.body;
  const query = 'UPDATE CIST_Questions SET type = ?, question_text = ?, answer_options = ?, correct_answer = ? WHERE id = ?';

  connection.query(query, [type, question_text, JSON.stringify(answer_options), correct_answer, questionId], (err, result) => {
    if (err) {
      console.error('Failed to update question: ' + err.stack);
      res.status(500).send('Failed to update question');
      return;
    }
    res.status(200).send('Question updated successfully');
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

// 환자 데이터 가져오는 API
app.get('/api/patient-data', (req, res) => {
  if (!req.session.userId) {
    res.status(403).send('로그인이 필요합니다');
    return;
  }

  const { date } = req.query;
  let query = '';
  let queryParams = [];

  console.log('userId:', req.session.userId);
  console.log('userRole:', req.session.userRole);
  console.log('date:', date);

  if (req.session.userRole === 'patient') {
    query = 'SELECT * FROM patient_data WHERE user_id = ? AND DATE(created_at) = ?';
    queryParams = [req.session.userId, date];
  } else if (req.session.userRole === 'guardian') {
    query = 'SELECT * FROM patient_data WHERE user_id = (SELECT patientId FROM members WHERE id = ?) AND DATE(created_at) = ?';
    queryParams = [req.session.userId, date];
  } else {
    // 일반인 역할을 처리하기 위한 로직을 추가합니다.
    query = 'SELECT * FROM patient_data WHERE user_id = ? AND DATE(created_at) = ?'; // 또는 적절한 쿼리를 설정합니다.
    queryParams = [req.session.userId, date];
  }

  if (!query) {
    console.error('Query not set');
    res.status(500).send('Query not set');
    return;
  }

  connection.query(query, queryParams, (err, results) => {
    if (err) {
      console.error('데이터 조회 실패:', err.stack); // 상세한 오류 메시지 로깅
      res.status(500).send('데이터 조회 실패');
      return;
    }
    console.log('Fetched patient data:', results); // 데이터 확인용
    res.json(results);
  });
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
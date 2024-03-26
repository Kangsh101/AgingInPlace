import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import '../css/Login.css';
import axios from 'axios';

const Login = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!username || !password) {
      alert('아이디와 비밀번호를 입력하세요.');
      return;
    }

    try {
      const response = await axios.post('/api/login', {
        username,
        password
      });
    
      if (response.status === 200) {
        const user = response.data;
        if (user) {
          if (user.is_active === 1) {
            onLogin(true);
            navigate('/main');
          } else {
            alert('비활성화된 계정입니다.');
          }
        } else {
          alert('아이디 또는 비밀번호를 확인하세요.');
        }
      } else if (response.status === 401) {
        const errorMessage = response.data;
        if (errorMessage === '아이디 또는 비밀번호가 올바르지 않습니다.') {
          alert('아이디 또는 비밀번호를 확인하세요.');
        } else if (errorMessage === '비활성화된 계정입니다') {
          alert('비활성화된 계정입니다.');
        } else {
          alert('서버 오류가 발생했습니다.');
        }
      } else {
        alert('서버 오류가 발생했습니다.');
      }
    } catch (error) {
      console.error('로그인 오류:', error);
      alert('아이디 또는 비밀번호가 올바르지 않습니다.');
    }
  }       

  return (
    <div className='login-container'>
      <div>
        <div className="login-layout">
          <h2 className='login-lg'>로그인</h2>
          
          <div className="row">
            <div className="login-box col-lg-2">
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <input type="text" id="username" title="아이디" name="username" value={username} onChange={(e) => setUsername(e.target.value)} className="form-control" placeholder="아이디" />
                </div>
                <div className="form-group">
                  <input type="password" id="password" title="비밀번호" name="password" value={password} onChange={(e) => setPassword(e.target.value)} className="form-control" placeholder="비밀번호" />
                </div>
                <div className="find-group">
                  <Link to="/signup" className="text-primary">
                    회원가입 | 
                  </Link>
                  <Link to="/Idppl" className="findPd">
                     아이디 찾기 |
                  </Link>
                  <Link to="/Passwordppl" className="findPd">
                    비밀번호 찾기
                  </Link>
                </div>
                <button  type="submit" className="login-btt">
                  로그인
                </button>
              </form>
              <div className="social-login">
                <strong>간편 로그인</strong>
                <div className="social-icon">
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;

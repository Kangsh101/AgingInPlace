import React from 'react';
import { Link, useNavigate } from 'react-router-dom'; 
import '../css/Header.css';

const Header = ({ isLoggedIn, setIsLoggedIn }) => {
  const navigate = useNavigate(); 

  const handleLogout = async () => {
    try {
      setIsLoggedIn(false); 
      localStorage.removeItem('isLoggedIn'); 
      navigate('/main');
    } catch (error) {
      console.error('로그아웃 오류:', error);
      alert('로그아웃에 실패했습니다.');
    }
  };

  return (
    <header className="header-container">
      <div>
        <Link to="/main">
          <img src="/images/loginlogo.png" alt="Your Logo" className='hadervar-logo'/>
        </Link>
      </div>
      <nav className="nav-container">
        <ul>
          <li className='Header-nav'><Link to="/contents">프로그램 콘텐츠</Link></li>
          <li className='Header-nav'><Link to="/page2">커뮤니티</Link></li>
        </ul>
      </nav>
      <div className="auth-buttons">
        {isLoggedIn ? (
          <>
            <button className='Header-nav' onClick={handleLogout}>로그아웃</button>
            <button className='Header-nav'><Link to="/mypage">내정보</Link></button>
          </>
        ) : (
          <>
            <button className='Header-loginbtt'><Link to="/login">로그인</Link></button>
            <button className='Header-signupbtt'><Link to="/signup">회원가입</Link></button>
          </>
        )}
        <button className='Header-nav'><Link to="/customer-service">고객센터</Link></button>
      </div>
    </header>
  );
};

export default Header;

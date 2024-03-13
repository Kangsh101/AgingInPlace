import React from 'react';
import { Link} from 'react-router-dom'; 
import '../css/Header.css';

const Header = ({ isLoggedIn, onLogout }) => {
  const handleLogout = async () => {
    window.location.href = '/main';
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
          <li className='Header-nav'><Link to="/Contents">프로그램 콘텐츠</Link></li>
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
            <button className='Header-loginbtt'><Link to="/login">login</Link></button>
            <button className='Header-signupbtt'><Link to="/signup">회원가입</Link></button>
          </>
        )}
        <button className='Header-nav'><Link to="/customer-service">고객센터</Link></button>
      </div>
    </header>
  );
};

export default Header;

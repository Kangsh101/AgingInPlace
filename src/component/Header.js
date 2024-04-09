import React from 'react';
import { Link, useNavigate } from 'react-router-dom'; 
import '../css/Header.css';

const Header2 = ({ isLoggedIn, setIsLoggedIn }) => {
  const navigate = useNavigate(); 

  const handleLogout = async () => {
    try {
      const response = await fetch('/api/logout', {
        method: 'POST',
      });
  
      if (response.ok) {
        setIsLoggedIn(false); 
        localStorage.removeItem('isLoggedIn'); 
        navigate('/main'); 
      } else {
        throw new Error('로그아웃 실패');
      }
    } catch (error) {
      console.error('로그아웃 오류:', error);
      alert('로그아웃에 실패했습니다.');
    }
  };

  return (
    <div className="is-preload landing" id="page-wrapper">
      <header id="header">
        <h1 id="logo"><a href="/">Landed</a></h1>
        <nav id="nav">
          <ul>
            <li><a href="/contents">프로그램 콘텐츠</a></li>
            <li>
              <a href="qnapage">커뮤니티</a>
            </li>
            {!isLoggedIn && (
              <>
                <li><a href="/signup" >회원가입</a></li>
                <li><a href="login" className="button primary">로그인</a></li>
              </>
            )}
            {isLoggedIn && (
              <>
                <li><a href="/elements">내정보</a></li>
                <li><button onClick={handleLogout} className="button primary">로그아웃</button></li>
              </>
            )}
          </ul>
        </nav>
      </header>
    </div>
  );
};

export default Header2;

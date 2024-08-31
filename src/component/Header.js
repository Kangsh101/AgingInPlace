import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom'; 
import '../css/Header.css';

const Header = ({ isLoggedIn, setIsLoggedIn }) => {
  const navigate = useNavigate(); 
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleDropdownToggle = () => {
    setIsMenuOpen(!isMenuOpen);
  };
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
  useEffect(() => {
    const handleMouseEnter = () => {
      setIsMenuOpen(true);
    };

    const handleMouseLeave = () => {
      setIsMenuOpen(false);
    };

    const navLiElements = document.querySelectorAll('#nav > ul ');
    navLiElements.forEach(li => {
      li.addEventListener('mouseenter', handleMouseEnter);
      li.addEventListener('mouseleave', handleMouseLeave);
    });

    return () => {
      navLiElements.forEach(li => {
        li.removeEventListener('mouseenter', handleMouseEnter);
        li.removeEventListener('mouseleave', handleMouseLeave);
      });
    };
  }, []);

  return (
    <div className="is-preload landing" id="page-wrapper">
      <header id="header">
        <h1 id="logo"><a href="/">Aging In Place</a></h1>

        <nav id="nav" className={isMenuOpen ? 'navPanel-visible' : ''}>

          <ul>
            {isLoggedIn && (
                <>
                  <li><a href="/patientChart">환자 데이터</a></li>
                </>
              )}
              <li><a href="/contents">프로그램 콘텐츠</a></li>
              <li>
              <Link to="#" onMouseEnter={handleDropdownToggle} onMouseLeave={handleDropdownToggle}>
                커뮤니티
                {isMenuOpen && (
                  <ul className={`submenu ${isLoggedIn ? 'submenu-logged-in' : ''}`}>
                    <li className='comusub'>
                      <Link to="/notice">공지사항</Link>
                    </li>
                    <li className='comusub'>
                      <Link to="/qnapage">QnA</Link>
                    </li>
                    <li className='comusub'>
                      <Link to="/faqpage">FAQ</Link>
                    </li>

                  </ul>
                )}
              </Link>
            </li>
            {!isLoggedIn && (
              <>
                <li><a href="/signup" >회원가입</a></li>
                <li><a href="login" id='font-bold' className="button primary">로그인</a></li>
              </>
            )}
            {isLoggedIn && (
              <>
                <li><a href="/mypage">내 정보</a></li>
                <li><button onClick={handleLogout} className="button primary">로그아웃</button></li>
              </>
            )}

          </ul>
        </nav>
      </header>
    </div>
  );
};

export default Header;

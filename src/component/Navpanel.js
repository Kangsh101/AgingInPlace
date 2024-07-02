import React, { useState, useEffect, useRef } from 'react';
import '../css/NewMain.css';
import { Link , useNavigate} from 'react-router-dom';

const Navpanel = ({ isLoggedIn, setIsLoggedIn }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isNavOpen, setIsNavOpen] = useState(false); 
  const navPanelRef = useRef(null);
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
  useEffect(() => {
    const handleScroll = () => {
      // 스크롤 이벤트에 따른 동작 수행
    };

    window.addEventListener('scroll', handleScroll);

    // 페이지 로드 시 애니메이션 재생
    const timeout = setTimeout(() => {
      setIsLoaded(true);
    }, 100);

    // useEffect의 반환 함수를 이용하여 언마운트 시 타이머 해제 및 이벤트 핸들러 제거
    return () => {
      clearTimeout(timeout);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const toggleNav = () => {
    setIsNavOpen(!isNavOpen);
    if (!isNavOpen) {
      document.body.classList.add('navPanel-visible');
    } else {
      document.body.classList.remove('navPanel-visible');
    }
  };
  
  return (
    <div className={`wrapper ${isLoaded ? 'is-preload' : ''}`}>
      <div id="titleBar">
        <a href="#navPanel" className={`toggle ${isNavOpen ? 'active' : ''}`} onClick={toggleNav}></a>
        <span className="title">Aging In Place</span>
      </div>
      <div id="navPanel" ref={navPanelRef} className={isNavOpen ? 'visible' : ''}>
        <nav>
          <ul>
            <li><a href="login" className='link'>Home</a></li>
            {!isLoggedIn && (
              <>
                <li><a href="/login" className='link3'>로그인</a></li>
                <li><a href="/signup" className='link3'>회원가입</a></li>
              </>
            )}
            {isLoggedIn && (
              <>
                <li><a onClick={handleLogout} className="link3">로그아웃</a></li>
                <li><a href="/mypage" className='link3'>내정보</a></li>
              </>
            )}
            <li><a href="contents" className='link3'>프로그램 콘텐츠</a></li>
            <li>
                <a href="notice" className='link3'>커뮤니티</a>
                <ul>
                    <li><a href="notice" className='link2'>공지사항</a></li>
                    <li><a href="qnapage" className='link2'>QnA 게시판</a></li>
                    <li><a href="faqpage" className='link2'>FAQ 게시판</a></li>
                </ul>
            </li>
          </ul>
        </nav>
      </div>
      <div className="content">
      </div>
    </div>
  );
};

export default Navpanel;

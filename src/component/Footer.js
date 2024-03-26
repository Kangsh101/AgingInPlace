import React from 'react';
import { Link } from 'react-router-dom';
import '../css/Footer.css';

const Footer = () => {
  
  return (
    <footer className="footer-container">
      <div className="upper-section">
        <p className='abcds'>공지사항</p>
        <Link to="/notice" className='babago'>바로가기</Link>
      </div>
      <div className='abcds'>
        <span className='fooati'>Dementia Prevention System</span>
      </div>
      <div className='abcds'>
        <span className='footit'>대표</span> <span className='fontwhwjd'>홍길동 </span> <span className='footit'>주소</span> <span className='fontwhwjd'>충북 진천군 진천읍</span> {/* 수정된 부분 */}
      </div>
      <div className='abcds'>
        <span className='footit'>사업자등록번호</span> <span className='fontwhwjd'>113-03222-1132 </span> {/* 수정된 부분 */}
      </div>
      <div className="lower-section">
        <span>이용약관 | 개인정보처리방침 | 이메일 무단 수집거부 | 고객센터</span>
      </div>
    </footer>
  );
};

export default Footer;

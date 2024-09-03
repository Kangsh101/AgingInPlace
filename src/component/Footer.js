import React from 'react';
import { Link } from 'react-router-dom';
import '../css/Footer.css';

const Footer = ({ userRole }) => {
  return (
    <footer id="footer">
      <ul className="icons">
        <li><span className="label1">대표</span> <span className='footer-label1'>홍길동</span></li>
        <li><span className="label1">사업자등록번호</span><span className='footer-label2'>113-03123-2103</span></li>
      </ul>
      <ul className="copyright">
        <li><Link to="/footerms">&copy; 이용약관</Link></li>
        <li><Link to="/fooprivacypolicy">개인정보처리방침</Link></li>
        <li><Link to="/foonoemailcollection">이메일 무단 수집거부</Link></li>
        {(userRole === 'admin' || userRole === 'doctor') && (
          <li><Link to="/cms">관리자</Link></li>
        )}
      </ul>
    </footer>
  );
};

export default Footer;

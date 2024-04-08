import React from 'react';
import { Link } from 'react-router-dom';
import '../css/Footer.css';

const Footer = () => {
  
  return (
    <footer id="footer">

    <ul className="icons">
  
      <li><span className="label1">대표</span> <span className='footer-label1'>홍길동</span></li>
      <li><span className="label1">사업자등록번호</span><span className='footer-label2'>113-03123-2103</span></li>
      <li><a href="#" className="icon brands alt fa-linkedin-in"><span className="label">LinkedIn</span></a></li>
      <li><a href="#" className="icon brands alt fa-instagram"><span className="label">Instagram</span></a></li>
      <li><a href="#" className="icon brands alt fa-github"><span className="label">GitHub</span></a></li>
      <li><a href="#" className="icon solid alt fa-envelope"><span className="label">Email</span></a></li>
    </ul>
    <ul className="copyright">
      <li>&copy; 이용약관  </li><li> 개인정보처리방침 </li><li>이메일 무단 수집거부</li>
      <li>고객센터</li>
      {/* <li>Design: <a href="http://html5up.net">HTML5 UP</a></li> */}
    </ul>
    
  </footer>
  );
};

export default Footer;

import React from 'react';
import { Link } from 'react-router-dom'; 
import '../css/Section.css';

const Section3 = () => {
  return (
    <div className='section-container'>
      <ol className="nav nav-pills nav-pills-step">
        <li className="nav-item"><span className="num">01</span> 약관동의</li>
        <li className="nav-item"><span className="num">02</span> 가입정보입력</li>
        <li className="nav-item active"><span className="num">03</span> 가입완료</li>
      </ol>
      <h3>회원가입이 완료되었습니다.</h3>
      <Link to="/login">
        <button className='Section-btt'>로그인</button>
      </Link>
    </div>
  );
};

export default Section3;

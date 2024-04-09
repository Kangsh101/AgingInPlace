import React, { useState } from 'react';
import '../css/Section.css';

const Section1 = ({ handleNext }) => {
  const [agreement1, setAgreement1] = useState(false);
  const [agreement2, setAgreement2] = useState(false);
  const [allAgreed, setAllAgreed] = useState(false);

  const handleCheckAll = () => {
    const newAllAgreed = !allAgreed;
    setAllAgreed(newAllAgreed);
    setAgreement1(newAllAgreed);
  };

  const handleIndividualCheck = (agreement) => {
    if (agreement === 1) {
      setAgreement1(!agreement1);
    }
    setAllAgreed(agreement1);
  };

  const handleNextButton = () => {
    if (agreement1) {
      handleNext();
    } else {
      alert('동의가 필요합니다.');
    }
  };
   return (
    <div className='section-container'>
      <ol className="nav nav-pills nav-pills-step">
        <li className="nav-item active"><span className="num">01</span> 약관동의</li>
        <li className="nav-item"><span className="num">02</span> 가입정보입력</li>
        <li className="nav-item"><span className="num">03</span> 가입완료</li>
      </ol>
      <div>
        <div className="terms-scroll">
          <div className='pscheck-box1'>
          <label>
              <input  type="checkbox" checked={agreement1} onChange={handleCheckAll} />
              <span className='pschecks'>(필수)</span> 개인정보 수집 및 이용 동의 </label>
          </div>

          
          
          <div className='Section1Text'>
            <textarea rows="15" cols="65" placeholder="약관 내용asㄴㅁㅇㅇㄴㅁㅇㄴㅁdadsadadadadasdadsadadadadasdadsadadadad
            asdadsadadadadasdadsaddadasdadsadadadad" readOnly></textarea>
          </div>
        </div>

        <div>
         <button className='nextBtt' onClick={handleNextButton}>다음</button>
        </div>
        
      </div>
    </div>
  );
};

export default Section1;

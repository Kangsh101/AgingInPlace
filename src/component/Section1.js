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
      alert('약관에 동의해주세요.');
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
          <div className='col-6 col-12-medium'>
              <div className="col-4 col-12-medium">
									<input type="checkbox" id="priority-low" checked={agreement1} onChange={handleCheckAll} />
									<label htmlFor="priority-low"><span className='pschecks'>(필수)</span> 개인정보 수집 및 이용 동의</label>
							</div>
            </div>
          <div className='Section1Text'>
            <textarea rows="15" cols="65" placeholder="개인정보보호법에 따라 네이버에 회원가입 신청하시
                   는 분께 수집하는 개인정보의 항목, 개인정보의 수집 및 이용목적, 개인정보의 보유 및 이용기간, 동의 거부권 및 동의 거부 
                   시 불이익에 관한 사항을 안내 드리오니 자세히 읽은 후 동의하여 주시기 바랍니다.
                    1. 수집하는 개인정보
                    이용자는 회원가입을 하지 않아도 정보 
                    2. 수집한 개인정보의 이용
                   및 법정대리인의 본인 확인, 이용자 식별, 회원탈퇴 의사의 확인 등 회원관리를 위하여 개인정보를 이용합니다." readOnly>
            </textarea>
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

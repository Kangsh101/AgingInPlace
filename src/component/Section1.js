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
            <textarea rows="15" cols="65" placeholder="(1) 개인정보의 수집 이용 목적∙
                경도인지장애가 치매로 진행되는 위험요인을 확인하여 치매로의 진행을 예방하고 관리하기 위함입니다 .
                (2) 수집하려는 개인 ( 민감 ) 정보의 항목 예 ) 귀하의 성별 , 나이 , 학력을 수집할 예정입니다 .
                (3) 개인정보의 보유 및 이용 기간 귀하의 개인 ( 민감 ) 정보는 연구를 위해 3년간 사용되며 수집된 정보는 개인정보 보호법에 따라 철저하게 관리됩니다 .
                (4) 귀하는 위 개인 ( 민감 ) 정보 수집 및 이용 , 제공에 대한 수락 여부를 자유롭게 결정할 수 있습니다 . 귀하가 개인 ( 민감 ) 정보 수집 및 이용 , 제공에 수락하지 않는 경우에도 귀하에 대한 진료와 처방에 어떠한 불이익도 발생하지 않습니다 . 본 연구에서 수집하는 개인정보는 연구목적으로만 사용됩니다 . 수집된 자료는 치매예방을 위한 연구로 진행되며 , 연구자료는 익명으로 처리하여 국제공동연구팀의 여러 나라 자료와 함께 비교 분석을 위하여 국제공동연구팀에게 제공됩니다 . 또한 , 수집된 모든 연구자료는 추후 이차자료분석 등의 학술적 연구에 활용될 수 있어 익명으로 처리하여 제 3 자에게 제공될 수 있습니다. " readOnly>
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

import React, { useState, useEffect } from 'react';
import '../css/Section2.css';

const Section2 = ({ userData, handleInputChange, handleNext }) => {
  const [passwordMismatch, setPasswordMismatch] = useState(false);
  const [emailId, setEmailId] = useState('');
  const [emailDomain, setEmailDomain] = useState('');
  const [showCustomDomain, setShowCustomDomain] = useState(false);
  const [customDomain, setCustomDomain] = useState('');
  const [gender, setGender] = useState('');
  const [role, setRole] = useState('');
  const [nextSession, setNextSession] = useState(false);
  const [isGuardian, setIsGuardian] = useState(false);
  const [guardianName, setGuardianName] = useState('');
  const [isPatientExist, setIsPatientExist] = useState(null);
  const [showMarginBottom ,setShowMarginBottom] = useState(false);
  const [patientPhoneNumber, setPatientPhoneNumber] = useState('');
  const [isPatient, setIsPatient] = useState(false);

  const [patientHeight, setPatientHeight] = useState('');
  const [patientWeight, setPatientWeight] = useState('');

  const isFormComplete = () => {
    return (
      userData.username !== '' &&
      userData.password !== '' &&
      userData.confirmPassword !== '' &&
      userData.name !== '' &&
      userData.birthdate !== '' &&
      userData.role !== '' &&
      userData.phoneNumber !== ''
    );
  };

  const handleNextClick = () => {
    if (isFormComplete()) {
      const usernameRegex = /^[a-z0-9_-]{5,20}$/; 
      const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d)[A-Za-z\d]{8,16}$/;
      const nameRegex = /^[a-zA-Z가-힣\s]{2,50}$/; // 이름: 영문, 한글, 공백만 허용 (2~50자)

      if (!nameRegex.test(userData.name)) {
        alert('이름에는 숫자가 포함될 수 없습니다. 올바른 이름을 입력하세요.');
        return;
      }

      if (!usernameRegex.test(userData.username)) {
        alert('아이디는 5~20자의 영문 소문자, 숫자와 특수기호(_),(-)만 사용 가능합니다.');
        return;
      }

      if (!passwordRegex.test(userData.password)) {
        alert('비밀번호는 8~16자의 영문과 숫자를 각각 최소 1개 이상 포함해야 합니다.');
        return;
      }

      if (userData.password !== userData.confirmPassword) {
        alert('비밀번호와 비밀번호 확인이 틀립니다. 다시 확인해주세요.');
        return;
      }
  
      if (isPatient) {
        if (!patientHeight || !patientWeight) {
          alert('키와 몸무게를 모두 입력해주세요.');
          return;
        }
  
        const heightValue = parseFloat(patientHeight);
        const weightValue = parseFloat(patientWeight);
  
        if (isNaN(heightValue) || heightValue < 100 || heightValue > 250) {
          alert('키는 100 ~ 250 사이의 숫자만 입력할 수 있으며, 소수점 첫째 자리까지 입력 가능합니다.');
          return;
        }
  
        if (isNaN(weightValue) || weightValue < 10 || weightValue > 200) {
          alert('몸무게는 10 ~ 200 사이의 숫자만 입력할 수 있으며, 소수점 첫째 자리까지 입력 가능합니다.');
          return;
        }
      }
      if (!emailId || !emailDomain || (showCustomDomain && !customDomain)) {
        alert('이메일을 입력하거나 옵션을 선택하세요.');
        return;
      }
      if (isGuardian) {
        if (isPatientExist === false) {
          alert('환자 성함을 확인해주세요.');
          return;
        }
        if (!isPatientExist) {
          alert('환자 성함과 전화번호가 일치하지 않습니다.');
          return;
        }
        if (!guardianName) {
          alert('환자 성함을 입력하고 확인해주세요.');
          return;
        }
      }
      if (!gender) {
        alert('성별을 선택해주세요.');
        return;
      }
      if (!role) {
        alert('타입을 선택해주세요.');
        return;
      }
      const email = showCustomDomain ? `${emailId}@${customDomain}` : `${emailId}@${emailDomain}`;
      handleInputChange({ target: { name: 'email', value: email } });
      handleInputChange({ target: { name: 'role', value: role } });
      handleInputChange({ target: { name: 'patientName', value: guardianName } });
      setNextSession(true);
    } else {
      if (userData.username === '') {
        alert('아이디를 입력하세요.');
      } else if (userData.password === '') {
        alert('비밀번호를 입력하세요.');
      } else if (userData.confirmPassword === '') {
        alert('비밀번호 확인을 입력하세요.');
      } else if (userData.password !== userData.confirmPassword) {
        alert('비밀번호와 비밀번호확인이 틀립니다.');
      } else if (userData.name === '') {
        alert('이름을 입력하세요.');
      } else if (userData.birthdate === '') {
        alert('생년월일을 입력하세요.');
      } else if (userData.phoneNumber === '') {
        alert('전화번호를 입력하세요.');
      }
    }
  };

  useEffect(() => {
    if (nextSession) {
      handleNext();
    }
  }, [nextSession]);

  const handleEmailIdChange = (e) => {
    const { value } = e.target;
    setEmailId(value);
  };

  const handleEmailDomainChange = (e) => {
    const { value } = e.target;
    setEmailDomain(value);
    setShowCustomDomain(value === '직접입력');
  };

  const handleCustomDomainChange = (e) => {
    const { value } = e.target;
    setCustomDomain(value);
  };

  const handleGenderChange = (e) => {
    const selectedGender = e.target.value;
    setGender(selectedGender);
    handleInputChange({ target: { name: 'gender', value: selectedGender } });
  };

  const handleRoleChange = (e) => {
    const selectedRole = e.target.value;
    setRole(selectedRole);
    setIsPatient(selectedRole === '환자'); // 환자 선택 시 처리
    setIsGuardian(selectedRole === '보호자');
    handleInputChange({ target: { name: 'role', value: selectedRole } });
  };
  const handlePatientHeightChange = (e) => {
    setPatientHeight(e.target.value);
    handleInputChange({ target: { name: 'height', value: e.target.value } });
  };

  const handlePatientWeightChange = (e) => {
    setPatientWeight(e.target.value);
    handleInputChange({ target: { name: 'weight', value: e.target.value } });
  };


  const handleGuardianNameChange = (e) => {
    const { value } = e.target;
    setGuardianName(value);
  };

  const handleGuardianNameConfirm = () => {
    fetch('/api/check-patient', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ patientName: guardianName, phoneNumber: patientPhoneNumber })
    })
    .then(response => response.json())
    .then(data => {
      setIsPatientExist(data.message === '있음');
      if (data.message === '있음') {
        handleInputChange({ target: { name: 'patientId', value: data.patientId } });
        setShowMarginBottom(true);
        alert('확인 되었습니다.'); 
      } else {
        alert('환자 성함과 전화번호가 일치하지 않습니다.'); 
        setShowMarginBottom(false);
      }
    })
    .catch(error => {
      console.error('오류:', error);
      alert('일치하는 환자가 없습니다.');
    });
  };
  
  const handlePatientPhoneNumberChange = (e) => {
    setPatientPhoneNumber(e.target.value);
  };
  return (
    <div className='section-container'>
      <ol className="nav nav-pills nav-pills-step">
        <li className="nav-item"><span className="num">01</span> 약관동의</li>
        <li className="nav-item active"><span className="num">02</span> 가입정보입력</li>
        <li className="nav-item"><span className="num">03</span> 가입완료</li>
      </ol>
      <div className='signup-info'>
        <h3 className='section2-title'>가입정보입력</h3>
      </div>
      <div className='signup-id'>
        <div className='Section2-container'>
          <div id='section2-id'>
            <input type='text' id='userid' name='username' value={userData.username} onChange={handleInputChange} placeholder='아이디' className='Section2-field' />
          </div>
          <div id='section2-id'>
            <input type='password' id='userpassword' name='password' value={userData.password} onChange={handleInputChange} placeholder='비밀번호' className='Section2-field' />
          </div>
          <div>
            <input type='password' id='confirmPassword' name='confirmPassword' value={userData.confirmPassword} onChange={handleInputChange} placeholder='비밀번호 확인' className='Section2-field' />
            {passwordMismatch && <p className='error-message'>비밀번호가 일치하지 않습니다.</p>}
          </div>
          <div className='email-container'>
            <input type='text' id='emailId' name='emailId' value={emailId} onChange={handleEmailIdChange} placeholder='이메일' className='Section2-field input-email' />
            <span> @ </span>
            {showCustomDomain ? (
              <>
                <input type='text' id='customDomain' value={customDomain} onChange={handleCustomDomainChange} placeholder='' className='input-field' />
                <button onClick={() => setShowCustomDomain(false)}>확인</button>
              </>
            ) : (
              <select id='emailDomain' value={emailDomain} onChange={handleEmailDomainChange} className='select-field11'>
                <option value=''>옵션 선택</option>
                <option value='naver.com'>naver.com</option>
                <option value='gmail.com'>gmail.com</option>
                <option value='daum.com'>daum.com</option>
              </select>
            )}
          </div>
          <div className='genderradio-container'>
            <div className="row gtr-uniform gtr-50">
              <div className="col-4 col-12-medium">
                <input type="radio" id="priority-low" name="gender" value="남성" checked={gender === "남성"} onChange={handleGenderChange} />
                <label htmlFor="priority-low">남성</label>
                <input type="radio" id="priority-normal" name="gender" value="여성" checked={gender === '여성'} onChange={handleGenderChange} />
                <label htmlFor="priority-normal">여성</label>
              </div>
            </div>
          </div>
          <select id='role' value={role} onChange={handleRoleChange} className='select-field1'>
            <option value='' disabled hidden>타입 선택</option>
            <option value='환자'>환자</option>
            <option value='보호자'>보호자</option>
            <option value='일반인'>일반인</option>
          </select>
          <div>
          {isPatient && (
            <>
               <input type="text" name="height" id='height-css' value={patientHeight} onChange={handlePatientHeightChange}  placeholder="키 (cm)" />
               <input type="text" name="weight" id='weight-css' value={patientWeight} onChange={handlePatientWeightChange}  placeholder="몸무게 (kg)" />
            </>
            )}
            {isGuardian && (
              <>
                <input type='text' id='guardianName' name='guardianName' value={guardianName} onChange={handleGuardianNameChange} placeholder='환자 이름' className='Section2-field' />
                <input type='text' id='patientPhoneNumber' name='patientPhoneNumber' value={patientPhoneNumber} onChange={handlePatientPhoneNumberChange} placeholder='환자 전화번호'/>
                <button className='button11' onClick={handleGuardianNameConfirm}>확인</button>
                {isPatientExist !== null && (
                  <p className={`section2-role${isPatientExist ? 't' : 'f'}`}>{isPatientExist ? '확인 되었습니다.' : '일치하는 환자가 없습니다.'}</p>
                )}
              </>
            )}
          </div>
        </div>
        <div>
          <input type='text' id='name' name='name' value={userData.name} onChange={handleInputChange} placeholder='이름' className='Section2-field'></input>
        </div>

        <div>
          <input type='text' id='birthdate' name='birthdate' value={userData.birthdate} onChange={handleInputChange} placeholder='생년월일 8자' className='Section2-field'></input>
        </div>
        <div>
          <input type='text' id='phoneNumber' name='phoneNumber' value={userData.phoneNumber} onChange={handleInputChange} placeholder='전화번호' className='Section2-field'></input>
        </div>
      </div>
      <button onClick={() => handleNextClick()} className="button primary" id='Section2Btt'>
        다음
      </button>

    </div>
  );
};

export default Section2;
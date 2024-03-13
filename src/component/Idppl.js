import React, { useState } from 'react';
import '../css/idppl.css';
import { Link } from 'react-router-dom';

const Idppl = () => {
  const [findMethod, setFindMethod] = useState('email');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [verificationCodeSent, setVerificationCodeSent] = useState(false);
  const [foundUsername, setFoundUsername] = useState('');
  const [searched, setSearched] = useState(false); 
  const [showInputFields, setShowInputFields] = useState(true); 
  const [showFindButtons, setShowFindButtons] = useState(true); 
  const [showRadioButtons, setShowRadioButtons] = useState(true); 

  const handleFindMethodChange = (event) => {
    const selectedMethod = event.target.value;
    setFindMethod(selectedMethod);
  };

  const handleNameChange = (event) => {
    setName(event.target.value);
  };

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handlePhoneChange = (event) => {
    setPhoneNumber(event.target.value);
  };

  const handleSendVerificationCode = () => {
    setVerificationCodeSent(true);
  };

  const handleVerificationCodeChange = (event) => {
    setVerificationCode(event.target.value);
  };

  const handleVerify = () => {
  };

  const handleFindUsername = () => {
    fetch('/findUser', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, name }) 
    })
      .then(response => response.json())
      .then(data => {
        if (data.username) {
          setFoundUsername(data.username);
          setSearched(true); 
          setShowInputFields(false);
          setShowFindButtons(false); 
          setShowRadioButtons(false); 
        } else {
          alert('사용자를 찾을 수 없습니다.');
        }
      })
      .catch(error => console.error('Error:', error));
  };

  const handleFindUserPhone = () => {
    fetch('/findUserPhone', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ name, phoneNumber })
    })
      .then(response => response.json())
      .then(data => {
        if (data.username) {
          setFoundUsername(data.username);
          setSearched(true); 
          setShowInputFields(false); 
          setShowFindButtons(false); 
          setShowRadioButtons(false); 
        } else {
          alert('사용자를 찾을 수 없습니다.');
        }
      })
      .catch(error => console.error('Error:', error));
  };
  
  return (
    <div>
      <h2 className='idididid'>아이디 찾기</h2>
      <div className='ddd'>
        <div className="idbox col-lg-2">
          {showRadioButtons && (
            <div>
              <div className='idradio2'>
                <input type="radio"  id="findByEmail"  name="findMethod"  value="email"  checked={findMethod === 'email'}  onChange={handleFindMethodChange}  />
                <label htmlFor="findByEmail">이메일로 찾기</label>
              </div>
              <div className='idradio'>
                <input  type="radio"  id="findByPhone"  name="findMethod"   value="phoneNumber"  checked={findMethod === 'phoneNumber'}  onChange={handleFindMethodChange}   />
                <label htmlFor="findByPhone">전화번호로 찾기</label>
              </div>
            </div>
          )}

          <div>
            {showInputFields && (
             <div>
                <label htmlFor="name">이름 : </label>
                <input type='text' id='name' name='name' value={name} onChange={handleNameChange} placeholder='이름' className='idfieldname' />
                {findMethod === 'email' && (
                <div className='idemail'>
                    <label htmlFor="email" className='Idpplemail'>이메일 :</label>
                    <input type='text' id='email' name='email' value={email} onChange={handleEmailChange} placeholder='예) kangsh4969@naver.com' className='idfield2' />
                    <button onClick={handleSendVerificationCode} className='fieldbtt'>인증번호 받기</button>
                </div>
                )}
                {findMethod === 'phoneNumber' && (
                <div className='idemail'>
                    <label htmlFor="phoneNumber" className='Idpplemail'>전화번호 : </label>
                    <input type='text' id='phoneNumber' name='phoneNumber' value={phoneNumber} onChange={handlePhoneChange} placeholder='예) 01033604963' className='idfield2' />
                    <button onClick={handleSendVerificationCode} className='fieldbtt'>인증번호 받기</button>
                </div>
                )}
                {verificationCodeSent && (
                <div>
                    <input type='text' id='verificationCode' name='verificationCode' value={verificationCode} onChange={handleVerificationCodeChange} placeholder='인증번호입력' className='inzzm' />
                    <button onClick={handleVerify} className='fieldbtt1'>확인</button>
                </div>
                )}
             </div>
            )}
            <div className="button-group">
            {!searched && (
                <button onClick={findMethod === 'email' ? handleFindUsername : handleFindUserPhone} className='idbttckck'>아이디 찾기</button>
            )}
            </div>
          </div>
          <div>
            {searched && (
              <div >
                <p className='namanane'>아이디 : {foundUsername}</p>
                <div className='Idpplgood'>                 
                    <button><Link to="/Passwordppl" className='Idpplgoodtext1'>비밀번호 찾기</Link></button>
                    <button><Link to="/Login"className='Idpplgoodtext' >로그인</Link></button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Idppl;

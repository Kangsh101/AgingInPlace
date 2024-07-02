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
    <article id="main">
      <div className="Idppl-container">
        <div className="row gtr-150">
          <div className="">
            <header className='major'> 
              <h2 className='aaaaaa'>아이디 찾기</h2>
            </header>
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
                  <label htmlFor="name" className='idpass-nowrap' >이름 </label>
                  <div className='idemail'>
                    
                    <input type='text' id='name' name='name' value={name} onChange={handleNameChange} placeholder='이름' className='idfieldname' />
                    </div>
                    {findMethod === 'email' && (
                      <div>
                        <label htmlFor="email" className='idpass-nowrap'>이메일</label>
                        <div className='idemail'>       
                            <input type='text' id='email' name='email' value={email} onChange={handleEmailChange} placeholder='예) kangsh4969@naver.com' className='idfield2' />
                            {/* <button onClick={handleSendVerificationCode} className='button' id='email-btt'>인증번호 받기</button> */}
                        </div>
                      </div>

                    )}
                    {findMethod === 'phoneNumber' && (
                    <div>
                      <label htmlFor="phoneNumber" className='idpass-nowrap'>전화번호</label>
                      <div className='idemail2'>
                          
                          <input type='text' id='phoneNumber' name='phoneNumber' value={phoneNumber} onChange={handlePhoneChange} placeholder='예) 01033604963' className='idfield2' />
                          {/* <button onClick={handleSendVerificationCode} className='button' id='email-btt'>인증번호 받기</button> */}
                      </div>
                    </div>
                    )}
                    {verificationCodeSent && (
                    <div className='inzzngbubun'>
                        <input type='text' id='verificationCode' name='verificationCode' value={verificationCode} onChange={handleVerificationCodeChange} placeholder='인증번호입력' className='inzzm' />
                        <button onClick={handleVerify} className='button' id='inzzngbubun-btt'>확인</button>
                    </div>
                    )}
                </div>
                )}
                <div className="button-group">
                {!searched && (
                    <button onClick={findMethod === 'email' ? handleFindUsername : handleFindUserPhone} className='button primary' id='idckwrl-btt'>아이디 찾기</button>
                )}
                </div>
              </div>
              <div>
                {searched && (
                  <div >
                    <span className='IdPassword-span'>고객님의 정보와 일치하는 아이디 입니다.</span>
                    <p className='namanane'> {foundUsername}</p>
                    <div className='Idpplgood'>                 
                        <Link to="/Login"className='button primary' id='Ckw-btt' >로그인</Link>
                        <Link to="/Passwordppl" className='button primary' id='Ckwpass-btt'>비밀번호 찾기</Link>        
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
          </div>
        </div>
      </div>
    </article>
  );
};

export default Idppl;

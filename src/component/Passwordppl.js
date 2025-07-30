import React, { useState } from 'react';
import '../css/idppl.css';
import { Link } from 'react-router-dom';

const Passwordppl = () => {
  const [findMethod, setFindMethod] = useState('email');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [verificationCodeSent, setVerificationCodeSent] = useState(false);
  const [foundPassword, setFoundPassword] = useState('');
  const [searched, setSearched] = useState(false);
  const [showInputFields, setShowInputFields] = useState(true);
  const [showFindButtons, setShowFindButtons] = useState(true);
  const [showRadioButtons, setShowRadioButtons] = useState(true);

  const handleFindMethodChange = (event) => {
    setFindMethod(event.target.value);
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

  const handleFindPassword = () => {
    const url =
      findMethod === 'email'
        ? '/api/findUserPassword'
        : '/api/findUserPasswordByPhone';

    const body = findMethod === 'email'
      ? { name, email }
      : { name, phoneNumber };

    fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.temporaryPassword) {
          setFoundPassword(data.temporaryPassword);
          setSearched(true);
          setShowInputFields(false);
          setShowFindButtons(false);
          setShowRadioButtons(false);
        } else {
          alert(data.message || '사용자를 찾을 수 없습니다.');
        }
      })
      .catch((error) => console.error('Error:', error));
  };

  return (
    <article id="main">
      <div className="Passwordppl-container">
        <div className="row gtr-150">
          <div>
            <header className="major">
              <h2 className="aaaaaa">비밀번호 찾기</h2>
            </header>
            <div className="ddd">
              <div className="idbox col-lg-2">
                {showRadioButtons && (
                  <div>
                    <div className="idradio2">
                      <input
                        type="radio"
                        id="findByEmail"
                        name="findMethod"
                        value="email"
                        checked={findMethod === 'email'}
                        onChange={handleFindMethodChange}
                      />
                      <label htmlFor="findByEmail">이메일로 찾기</label>
                    </div>
                    <div className="idradio">
                      <input
                        type="radio"
                        id="findByPhone"
                        name="findMethod"
                        value="phoneNumber"
                        checked={findMethod === 'phoneNumber'}
                        onChange={handleFindMethodChange}
                      />
                      <label htmlFor="findByPhone">전화번호로 찾기</label>
                    </div>
                  </div>
                )}

                <div>
                  {showInputFields && (
                    <div>
                      <label htmlFor="name" className="idpass-nowrap">
                        이름
                      </label>
                      <div className="idemail">
                        <input
                          type="text"
                          id="name"
                          name="name"
                          value={name}
                          onChange={handleNameChange}
                          placeholder="이름"
                          className="idfieldname"
                        />
                      </div>
                      {findMethod === 'email' && (
                        <div>
                          <label htmlFor="email" className="idpass-nowrap">
                            이메일
                          </label>
                          <div className="idemail">
                            <input
                              type="text"
                              id="email"
                              name="email"
                              value={email}
                              onChange={handleEmailChange}
                              placeholder="예) ghdrlfehd@naver.com"
                              className="idfield2"
                            />
                          </div>
                        </div>
                      )}
                      {findMethod === 'phoneNumber' && (
                        <div>
                          <label htmlFor="phoneNumber" className="idpass-nowrap">
                            전화번호
                          </label>
                          <div className="idemail">
                            <input
                              type="text"
                              id="phoneNumber"
                              name="phoneNumber"
                              value={phoneNumber}
                              onChange={handlePhoneChange}
                              placeholder="예) 01012345678"
                              className="idfield2"
                            />
                          </div>
                        </div>
                      )}
                      {/* {verificationCodeSent && (
                        <div className="inzzngbubun">
                          <input
                            type="text"
                            id="verificationCode"
                            name="verificationCode"
                            value={verificationCode}
                            onChange={handleVerificationCodeChange}
                            placeholder="인증번호 입력"
                            className="inzzm"
                          />
                          <button
                            onClick={handleVerify}
                            className="button"
                            id="inzzngbubun-btt"
                          >
                            확인
                          </button>
                        </div>
                      )} */}
                    </div>
                  )}
                  <div className="button-group">
                    {!searched && (
                      <button
                        onClick={handleFindPassword}
                        className="button primary"
                        id="idckwrl-btt"
                      >
                        비밀번호 찾기
                      </button>
                    )}
                  </div>
                </div>
                {searched && (
                  <div>
                    <span className="IdPassword-span">
                      임시 비밀번호가 발급되었습니다.
                    </span>
                    <p className="namanane">{foundPassword}</p>
                    <div className="Idpplgood">
                      <Link to="/Idppl" className="button primary" id="Ckw-btt">
                        아이디 찾기
                      </Link>
                      <Link to="/Login" className="button primary" id="Ckwpass-btt">
                        로그인
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
};

export default Passwordppl;

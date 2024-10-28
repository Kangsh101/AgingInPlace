import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../css/EditProfile.css';

const EditProfile = () => {
  const [name, setName] = useState('');
  const [gender, setGender] = useState('남성');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [role, setRole] = useState('환자');
  const [email, setEmail] = useState('');
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [userInfo, setUserInfo] = useState(null);

  // 사용자 정보 가져오기
  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await axios.get('/api/userinfo2', { withCredentials: true });
        if (response.status === 200) {
          const userInfo = response.data;
          setName(userInfo.name);
          setGender(userInfo.gender);
          setPhoneNumber(userInfo.phoneNumber);
          setRole(userInfo.role);
          setEmail(userInfo.email);
          setHeight(userInfo.height_cm || '');
          setWeight(userInfo.weight_kg || '');
          setUserInfo(userInfo);
        } else {
          console.error('Failed to fetch user info');
        }
      } catch (error) {
        console.error('Error fetching user info:', error);
      }
    };
    fetchUserInfo();
  }, []);

  const handleSave = async () => {
    try {
      const response = await axios.post('/api/updateuserinfo2', {
        name,
        gender,
        phoneNumber,
        role,
        email,
        height,
        weight,
      });
      if (response.status === 200) {
        console.log('사용자 정보가 성공적으로 업데이트되었습니다.');
        alert('사용자 정보가 성공적으로 업데이트되었습니다.');
      }
    } catch (error) {
      console.error('사용자 정보 업데이트 실패:', error);
      alert('사용자 정보 업데이트 실패.');
    }
  };

  return (
    <div className='editprofile-container'>
      <div className='editprofile-title'>
        <strong>개인정보 수정</strong>
      </div>
      <div className='editprofile-context-container'>
        <div className='editprofile-row'>
          <strong className='Profile-strong'>이 름</strong>
          <input className='editprofile-input' type="text" value={name} readOnly />
        </div>
        <div className='editprofile-row'>
          <strong className='Profile-strong'>역 할</strong>
          <select value={role} className='Profile-type' disabled>
            <option value="환자">환자</option>
            <option value="보호자">보호자</option>
          </select>
        </div>
        <div className='editprofile-row'>
          <strong className='Profile-strong'>성 별</strong>
          <select value={gender} className='Profile-type' onChange={(e) => setGender(e.target.value)}>
            <option value="남성">남성</option>
            <option value="여성">여성</option>
          </select>
        </div>
        <div className='editprofile-row'>
          <strong className='Profile-strong'>번 호</strong>
          <input className='editprofile-input' type="text" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} />
        </div>
        <div className='editprofile-row'>
          <strong className='Profile-strong'>메 일</strong>
          <input className='editprofile-input' type="text" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>

        {/* 키와 몸무게 입력란: 환자일 때만 표시 */}
        {role === '환자' && (
          <>
            <div className='editprofile-row'>
              <strong className='Profile-strong'>키 (cm)</strong>
              <input
                className='editprofile-input'
                type="text"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
              />
            </div>
            <div className='editprofile-row'>
              <strong className='Profile-strong'>몸무게 (kg)</strong>
              <input
                className='editprofile-input'
                type="text"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
              />
            </div>
          </>
        )}

        <button className='ChangeBtt' onClick={handleSave}>수정하기</button>
      </div>
    </div>
  );
};

export default EditProfile;
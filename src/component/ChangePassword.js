// ChangePassword.js

import React, { useState } from 'react';
import axios from 'axios';
import '../css/ChangePassword.css';

function ChangePassword() {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');
    const [messageColor, setMessageColor] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === 'currentPassword') setCurrentPassword(value);
        else if (name === 'newPassword') setNewPassword(value);
        else if (name === 'confirmPassword') setConfirmPassword(value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (currentPassword === '' || newPassword === '' || confirmPassword === '') {
            setMessageColor('red');
            setMessage('모든 필드를 입력해주세요.');
        } else if (newPassword !== confirmPassword) {
            setMessageColor('red');
            setMessage('새 비밀번호가 일치하지 않습니다.');
        } else {
            try {
                const response = await axios.post('/api/changepassword', {
                    currentPassword,
                    newPassword
                });
                if (response.status === 200) {
                    setMessageColor('green');
                    setMessage('비밀번호가 변경되었습니다.');
                    setCurrentPassword('');
                    setNewPassword('');
                    setConfirmPassword('');
                }
            } catch (error) {
                console.error('Error changing password:', error);
                setMessageColor('red');
                setMessage('현재 비밀번호가 일치하지 않습니다.');
            }
        }
    };

    return (
        <div className="changepw-container">
            <div className='changepw-title'>
                <strong >비밀번호 변경</strong>
            </div>
            <div className='changepw-notification'>
                <p>
                    <div style={{ color: 'blue', fontSize: '25px', fontWeight:'bold'}}>안전한 비밀번호로 내정보를 보호하세요</div><br></br>
                    <span style={{ color: 'red' , fontSize: '18px'}}>다른 아이디/사이트에서 사용한 적 없는 비밀번호</span><br></br>
                    <span style={{ color: 'red', fontSize: '18px' }}> 이전에 사용한 적 없는 비밀번호가 안전합니다</span>
                </p>
            </div>
            <div className='changepw-context-container'>
                <form onSubmit={handleSubmit}>
                    <div>
                        <strong className='passwordChange1'>현재 비밀번호</strong>
                        <input type="password" id="currentPassword" placeholder='현재 비밀번호'  name="currentPassword" value={currentPassword} onChange={handleChange} required />
                    </div>
                    <div>
                        <strong className='passwordChange2'>새 비밀번호 </strong>
                        <input type="password" id="newPassword" name="newPassword" placeholder='새 비밀번호' value={newPassword} onChange={handleChange} required />
                    </div>
                    <div>
                        <strong className='passwordChange3'>비밀번호 확인</strong>
                        <input type="password" id="confirmPassword" name="confirmPassword" placeholder='새 비밀번호 확인' value={confirmPassword} onChange={handleChange} required />
                    </div>
                    <button type="submit" className='ChangeBtt'>변 경</button>
                </form>
                {message && <p className="message" style={{ color: messageColor }}>{message}</p>}
            </div>
        </div>
    );
}

export default ChangePassword;

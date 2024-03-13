import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../css/MyInfo.css';

function MyInfo() {
    const [user, setUser] = useState({
        username: '',
        email: '',
        phoneNumber: '',
        gender: '',
        name: '',
        role: ''
    });

    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                const response = await axios.get('/userinfo');
                if (response.status === 200) {
                    const userData = response.data;
                    setUser(userData); 
                } else {
                    console.error('Failed to fetch user info');
                }
            } catch (error) {
                console.error('Error fetching user info:', error);
            }
        };

        fetchUserInfo();
    }, []); 

    return (
        <div className='myinfo-container'>
            <div className='myinfo-title'>
                <strong>내 정보 페이지</strong>
            </div>
            <div className='myinfo-context-container'>
                <div>
                    <strong>아이디</strong>
                    <span>{user.username}</span>
                </div>
                <div>
                    <strong>이름</strong>
                    <span>{user.name}</span>
                </div>
                <div>
                    <strong>이메일</strong>
                    <span>{user.email}</span>
                </div>
                <div>
                    <strong>전화번호</strong>
                    <span>{user.phoneNumber}</span>
                </div>
                <div>
                    <strong>성별</strong>
                    <span>{user.gender}</span>
                </div>
                <div>
                    <strong>역할</strong>
                    <span>{user.role}</span>
                </div>
            </div>
        </div>
    );
}

export default MyInfo;

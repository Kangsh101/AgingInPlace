import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../css/MyPage.css';
import ChangePassword from './ChangePassword';
import MyInfo from './MyInfo';
import EditProfile from './EditProfile';
import Footer from './Footer';
function MyPage() {
    const [selectedSection, setSelectedSection] = useState('myinfo');
    const [userInfo, setUserInfo] = useState('');
    const [userId, setUserId] = useState(null);

    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                const response = await axios.get(`/api/customers`, { withCredentials: true });
                if (response.status === 200) {
                    const userData = response.data;
                   
                    setUserInfo(userData);
                    console.log('유저정보:', userData); 
                } else {
                    console.error('Failed to fetch user info');
                }
            } catch (error) {
                console.error('Error fetching user info:', error);
            }
        };
    
        fetchUserInfo();
    }, [userId]); 

    useEffect(() => {
        const storedUserId = localStorage.getItem('userId');
        if (storedUserId) {
            setUserId(storedUserId);
        }
    }, []);

    return (
        <div className="mypage">
            <div className="sidebar">
                <div className="logo-container">
                    <img src="/images/logo-small.png" alt="로고" />
                    <span>Aging In Place</span>
                </div>

                <div className='sidebar-title'>
                    <h2>마이페이지</h2>
                </div>
                <ul className='sidebar-menu'>
                    <li onClick={() => setSelectedSection('myinfo')}>
                        <span>내 정보</span>
                    </li>
                    <li onClick={() => setSelectedSection('changepassword')}>
                        <span>비밀번호 변경</span>
                    </li>
                    <li onClick={() => setSelectedSection('editprofile')}>
                        <span>개인정보 수정</span>
                    </li>
                </ul>
            </div>
            <div className="content">
                {selectedSection === 'myinfo' && <MyInfo userInfo={userInfo} />}
                {selectedSection === 'changepassword' && <ChangePassword />}
                {selectedSection === 'editprofile' && <EditProfile />}
            </div>
            
        </div>
    );
}

export default MyPage;

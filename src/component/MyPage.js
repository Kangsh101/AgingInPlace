import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../css/MyPage.css';
import ChangePassword from './ChangePassword';
import MyInfo from './MyInfo';
import EditProfile from './EditProfile';
import AddDiagnosis from './AddDiagnosis';
import DiagnosisList from './DiagnosisList';
import Footer from './Footer';

function MyPage() {
    const [selectedSection, setSelectedSection] = useState('myinfo');
    const [userInfo, setUserInfo] = useState('');
    const [userId, setUserId] = useState(null);

    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                const response = await axios.get(`/api/userinfo`, { withCredentials: true });
                if (response.status === 200) {
                    const userData = response.data;
                   
                    setUserInfo(userData);
                    console.log("Fetched user info:", userData);
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

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 100) {
                document.querySelector('.mypage').classList.add('sticky');
            } else {
                document.querySelector('.mypage').classList.remove('sticky');
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    const isGuardian = userInfo.role === "보호자";

    return (
        <article id='main'>
        <div className="mypage">
            <div className="sidebar">
                    <div className='sidebar-title'>
                       <h2 id='sidebar-h2'>마이페이지</h2>
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
                    <li onClick={() => setSelectedSection('diagnosislist')}>
                    <span>진단명 목록</span>
                    </li>
                </ul>
            </div>
            <div className="content">
                {selectedSection === 'myinfo' && <MyInfo userInfo={userInfo} />}
                {selectedSection === 'changepassword' && <ChangePassword />}
                {selectedSection === 'editprofile' && <EditProfile />}
                {selectedSection === 'diagnosislist' && (
                    <DiagnosisList 
                        isGuardian={isGuardian} 
                        onAddClick={() => setSelectedSection('adddiagnosis')} 
                    />
                )}
                {selectedSection === 'adddiagnosis' && (
                    <AddDiagnosis 
                        isGuardian={isGuardian} 
                        onCancel={() => setSelectedSection('diagnosislist')}
                    />
                )}
            </div>
        </div>
        </article>
    );
}

export default MyPage;

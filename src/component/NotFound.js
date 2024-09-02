import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/NotFound.css';

const NotFound = () => {
    const navigate = useNavigate();

    const handleGoBack = () => {
        navigate('/'); 
    };

    return (
        <div className="notfound-container">
            <h1 className="notfound-title">404</h1>
            <p className="notfound-message">죄송합니다, 요청하신 페이지를 찾을 수 없습니다.</p>
            <button className="notfound-button" onClick={handleGoBack}>
                메인 페이지로 돌아가기
            </button>
        </div>
    );
};

export default NotFound;

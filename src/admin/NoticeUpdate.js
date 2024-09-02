import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; 
import '../css/NoticeUp.css';
import CmsSidebar from './CmsSidebar';
import CmsNavipanel from './CmsNavipanel';
import NotFound from '../component/NotFound'; 

const NoticeUpdate = ({ userRole }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (userRole !== 'admin') {
      navigate('/notfound');
    }
  }, [userRole, navigate]);

  const handleBack = () =>{
    navigate('/cms');
  };

  return (
    <div className="NoticeUp-container">
      <CmsSidebar userRole={userRole} />
      <CmsNavipanel userRole={userRole} />
      <h2>공지사항 수정</h2>
      <div className="NoticeUp-label">
        <label>제목:</label>
        <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} />
      </div>
      <div className="NoticeUp-label1">
        <label>내용:</label>
        <textarea value={content} onChange={(e) => setContent(e.target.value)} />
      </div>
      <div className="button-group">
        <button className="cancel-button" onClick={handleBack}>취소</button>
        <button className="save-button">글 수정</button>
      </div>
    </div>
  );
};

export default NoticeUpdate;

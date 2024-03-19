import React, { useState, useEffect } from 'react';
import '../css/Page3.css'; 
import { Link, useNavigate } from 'react-router-dom';

const QnAUp = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [userId, setUserId] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const storedUserId = sessionStorage.getItem('userId');
    if (storedUserId) {
      setUserId(storedUserId);
    }
  }, []);

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
  };

  const handleContentChange = (e) => {
    setContent(e.target.value);
  };

  const handleSave = () => {
    if (!title.trim()) {
      alert('제목을 작성해주세요.');
      return;
    }

    if (!content.trim()) {
      alert('내용을 작성해주세요.');
      return;
    }

    fetch('/api/post', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ title, content, userId }),
    })
    .then(response => response.json())
    .then(data => {
      console.log('글이 성공적으로 저장되었습니다.');
      alert('글이 성공적으로 저장되었습니다.'); 
      navigate('/qnapage'); 
      window.location.reload(); 
    })
    .catch(error => {
      console.error('글 저장 중 오류 발생:', error);
    });
  };

  const handleCancel = () => {
    navigate(-1);
  };

  return (
    <div className="qna-page">
      <nav className="qna-navigation">
        <span className="qna-nav-ALL">전체</span>
        <Link to="/qnapage" className="qna-nav-item-Q">QnA게시판</Link>
        <Link to="/notice" className="qna-nav-item">공지사항</Link>
        <Link to="/faqpage" className="qna-nav-item">자주묻는질문</Link>
      </nav>
      <div className="qnaplus">
        <h2 className='aaaaaa'>QnA 게시글 작성</h2>
        <div className="form-group">
          <label>제목:</label>
          <input type="text" value={title} onChange={handleTitleChange} />
        </div>
        <div className="form-group1">
          <label>내용:</label>
          <textarea value={content} onChange={handleContentChange} />
        </div>
        <div className="button-group">
          <button className="cancel-button" onClick={handleCancel}>취소</button>
          <button className="save-button" onClick={handleSave}>글 작성</button>
        </div>
      </div>
    </div>
  );
};

export default QnAUp;

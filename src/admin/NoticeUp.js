import { useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import '../css/NoticeUp.css';

const NoticeUp = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const naviga = useNavigate();

  const handleSubmit = () => {
    fetch('/api/addNotice', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ title, content }),
    })
    .then(response => response.json())
    .then(data => {
      console.log(data);
      alert('게시글이 성공적으로 등록되었습니다.'); 
      naviga('/Cms'); 
    })
    .catch(error => {
      console.error('글 등록 중 오류 발생:', error);
    });
  };
  const handleBack = () =>{
    naviga('/cms')
  }
  return (
    <div className="NoticeUp-container">
      <h2>공지사항</h2>
      <div className="NoticeUp-label">
        <label>제목:</label>
        <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} />
      </div>
      <div className="NoticeUp-label1">
        <label>내용:</label>
        <textarea type="text" value={content} onChange={(e) => setContent(e.target.value)} />
      </div>
      <div className="button-group">
        <button className="cancel-button" onClick={handleBack} >취소</button>
        <button className="save-button" onClick={handleSubmit}>글 등록</button>
      </div>
    </div>
  );
};

export default NoticeUp;

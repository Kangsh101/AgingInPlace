import { useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import '../css/Page3.css';

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
      naviga('/Cmss'); 
    })
    .catch(error => {
      console.error('글 등록 중 오류 발생:', error);
    });
  };

  return (
    <div className="qnaplus">
      <h2 className='aaaaaa'>공지사항</h2>
      <div className="form-group">
        <label>제목:</label>
        <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} />
      </div>
      <div className="form-group">
        <label>내용:</label>
        <input type="text" value={content} onChange={(e) => setContent(e.target.value)} />
      </div>
      <div className="button-group">
        <button className="cancel-button">취소</button>
        <button className="save-button" onClick={handleSubmit}>글 등록</button>
      </div>
    </div>
  );
};

export default NoticeUp;

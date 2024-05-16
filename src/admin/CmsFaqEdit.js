import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import '../css/FaqUp.css';

const CmsFaqEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const quillRef = useRef(null);

  useEffect(() => {
    fetch(`/api/faq/${id}`)
      .then(response => response.json())
      .then(data => {
        setTitle(data.title);
        setContent(data.content);
      })
      .catch(error => console.error('데이터를 불러오는 중 에러 발생:', error));
  }, [id]);

  const handleTitleChange = (event) => {
    setTitle(event.target.value);
  };

  const handleContentChange = (content) => {
    setContent(content);
  };

  const handleSaveEdit = () => {
    fetch(`/api/faq/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ title, content }),
    })
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          alert('게시글이 성공적으로 수정되었습니다.');
          navigate('/cmsfaq');
        } else {
          alert('수정 중 오류 발생: ' + data.error);
        }
      })
      .catch(error => console.error('수정 중 오류 발생:', error));
  };

  return (
    <div className="FaqUp-container">
      <div id='Faq-Plus'>
        <h2>FAQ 수정</h2>
        <div className="form-group">
          <input
            type="text"
            value={title}
            onChange={handleTitleChange}
            placeholder="제목"
            className="title-input"
            id='Faq-titlecss'
          />
          <ReactQuill
            id='Faq-content'
            ref={quillRef}
            value={content}
            onChange={handleContentChange}
            placeholder="내용을 입력하세요."
          />
        </div>
        <div className="button-group">
          <button className="button" onClick={() => navigate('/cmsfaq')}>취소</button>
          <button className="button primary" onClick={handleSaveEdit}>저장</button>
        </div>
      </div>
    </div>
  );
};

export default CmsFaqEdit;

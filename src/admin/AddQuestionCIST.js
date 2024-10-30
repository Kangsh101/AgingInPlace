import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/Cms.css';
import CmsSidebar from './CmsSidebar';
import CmsNavipanel from './CmsNavipanel';
import '../admin_css/AddQuestionCIST.css';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const AddQuestionCIST = ({ userRole }) => {
  const [type, setType] = useState('');
  const [title, setTitle] = useState('');
  const [questionText, setQuestionText] = useState('');
  const [correctAnswer, setCorrectAnswer] = useState('');
  const [image, setImage] = useState(null);
  const [imageUrl, setImageUrl] = useState('');
  const navigate = useNavigate();
  const quillRef = useRef(null);

  useEffect(() => {
    if (userRole !== 'admin' && userRole !== 'doctor') { 
      navigate('/notfound');
    }
  }, [userRole, navigate]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      setImage(file);
    } else {
      alert('이미지 파일을 선택해 주세요.');
    }
  };

  const handleAddQuestion = () => {
    // 필드 유효성 검사
    if (!type || !title || !questionText || !correctAnswer) {
      alert('모든 필드를 채워주세요.');
      return;
    }
    const formData = new FormData();
    formData.append('type', type);
    formData.append('title', title);
    formData.append('question_text', questionText);
    formData.append('correct_answer', correctAnswer);
    if (image) {
      formData.append('image', image);
    }

    fetch('/api/cist_questions', {
      method: 'POST',
      body: formData,
    })
      .then((response) => {
        if (response.ok) {
          return response.json(); // JSON 응답을 반환
        } else {
          // 응답이 JSON인 경우만 처리
          const contentType = response.headers.get('content-type');
          if (contentType && contentType.includes('application/json')) {
            return response.json().then((data) => {
              throw new Error(data.message || '문제가 발생했습니다.');
            });
          } else {
            throw new Error('서버에서 응답을 받지 못했습니다. 다시 시도해 주세요.');
          }
        }
      })
      .then((data) => {
        setImageUrl(data.imageUrl); // 서버에서 반환된 이미지 URL을 상태로 저장
        console.log('이미지 URL:', data.imageUrl); // 저장된 이미지 URL 출력
        navigate('/cmscist');
      })
      .catch((error) => {
        console.error('Error adding question:', error);
        alert(error.message);
      });
  };

  return (
    <div className="cms-container">
      <CmsSidebar userRole={userRole} />
      <CmsNavipanel userRole={userRole} />
      <div className="cms-main-content">
        <header className="major" id="major-rest">
          <h2>문제 추가</h2>
        </header>
        <div className="Cms-form centered-form">
          <div className="Cms-form-group">
            <label>문제 유형:</label>
            <select value={type} onChange={(e) => setType(e.target.value)}>
              <option value="">유형 선택</option>
              <option value="지남력">지남력</option>
              <option value="기억력">기억력</option>
              <option value="주의력">주의력</option>
              <option value="시공간 기능">시공간 기능</option>
              <option value="집행 기능">집행 기능</option>
              <option value="언어 기능">언어 기능</option>
            </select>
          </div>

          <div className="Cms-form-group">
            <label>제목:</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="Cms-form-group">
            <label>문제 내용:</label>
            <textarea
              value={questionText}
              onChange={(e) => setQuestionText(e.target.value)}
            />
          </div>

          <div className="Cms-form-group">
            <label>이미지:</label>
            <input type="file" accept="image/*" onChange={handleImageChange} />
          </div>

          <div className="Cms-form-group">
            <label>정답:</label>
            <input
              type="text"
              value={correctAnswer}
              onChange={(e) => setCorrectAnswer(e.target.value)}
            />
          </div>

          <div className="Cms-form-buttons">
            <button className="button" onClick={() => navigate('/cmscist')}>
              취소
            </button>
            <button className="button primary" onClick={handleAddQuestion}>
              등록
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddQuestionCIST;
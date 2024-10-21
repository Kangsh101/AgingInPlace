import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/Cms.css';
import CmsSidebar from './CmsSidebar';
import CmsNavipanel from './CmsNavipanel';
import '../admin_css/AddQuestionCIST.css';

const AddQuestionCIST = ({ userRole }) => {
  const [type, setType] = useState('');
  const [title, setTitle] = useState('');
  const [questionText, setQuestionText] = useState('');
  const [correctAnswer, setCorrectAnswer] = useState('');
  const [image, setImage] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (userRole !== 'admin' && userRole !== 'doctor') {
      navigate('/notfound');
    }
  }, [userRole, navigate]);

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleAddQuestion = () => {
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
          navigate('/cmscist');
        }
      })
      .catch((error) => console.error('Error adding question:', error));
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
            <input type="file" onChange={handleImageChange} />
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

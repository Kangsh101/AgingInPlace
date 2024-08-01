import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/Cms.css';
import CmsSidebar from './CmsSidebar';
import CmsNavipanel from './CmsNavipanel';
import '../admin_css/AddQuestionCIST.css';

const AddQuestionCIST = () => {
  const [type, setType] = useState('');
  const [questionText, setQuestionText] = useState('');
  const [answerOptions, setAnswerOptions] = useState([]);
  const [correctAnswer, setCorrectAnswer] = useState('');
  const navigate = useNavigate();
  const [currentOption, setCurrentOption] = useState('');

  const handleAddOption = () => {
    if (currentOption.trim()) {
      setAnswerOptions([...answerOptions, currentOption]);
      setCurrentOption('');
    }
  };

  const handleDeleteOption = (index) => {
    const newOptions = answerOptions.filter((_, i) => i !== index);
    setAnswerOptions(newOptions);
  };

  const handleAddQuestion = () => {
    let question_text = questionText;
    let correct_answer = correctAnswer;

    if (type === '지남력') {
      question_text = '오늘 날짜를 말씀해주세요. 오늘은 몇 년도, 몇 월, 며칠, 무슨 요일인가요?';
      correct_answer = ''; 
    }

    const newQuestion = {
      type,
      question_text,
      answer_options: answerOptions,
      correct_answer
    };

    fetch('/api/cist_questions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(newQuestion)
    })
    .then(response => {
      if (response.ok) {
        navigate('/cmscist');
      }
    })
    .catch(error => console.error('Error adding question:', error));
  };

  return (
    <div className="cms-container">
      <CmsSidebar />
      <CmsNavipanel />
      <div className="cms-main-content">
        <header className='major' id='major-rest'>
          <h2>문제 추가</h2>
        </header>
        <div className="Cms-form centered-form">
          <div className="Cms-form-group">
            <label>문제 유형:</label>
            <select 
              value={type} 
              onChange={(e) => setType(e.target.value)} 
            >
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
            <label>문제 내용:</label>
            <textarea 
              value={questionText} 
              onChange={(e) => setQuestionText(e.target.value)} 
              disabled={type === '지남력'}
            />
          </div>
          <div className="Cms-form-group">
            <label>정답 선택지:</label>
            <div className="option-input">
              <input 
                type="text" 
                value={currentOption} 
                onChange={(e) => setCurrentOption(e.target.value)} 
                disabled={type === '지남력'}
              />
              <button onClick={handleAddOption} disabled={type === '지남력'}>추가</button>
            </div>
            <ul>
              {answerOptions.map((option, index) => (
                <li key={index}>
                  {index + 1}. {option}
                  <button 
                    className="delete-button" 
                    onClick={() => handleDeleteOption(index)}
                    disabled={type === '지남력'}
                  >
                    삭제
                  </button>
                </li>
              ))}
            </ul>
          </div>
          <div className="Cms-form-group">
            <label>정답:</label>
            <input 
              type="text" 
              value={correctAnswer} 
              onChange={(e) => setCorrectAnswer(e.target.value)} 
              disabled={type === '지남력'}
            />
          </div>
          <div className="Cms-form-buttons">
            <button className="button"  id='CIST-canclebtt' onClick={() => navigate('/cmscist')}>취소</button>
            <button className="button primary"  onClick={handleAddQuestion}>등록</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddQuestionCIST;

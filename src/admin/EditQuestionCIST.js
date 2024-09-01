import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../css/Cms.css';
import CmsSidebar from './CmsSidebar';
import CmsNavipanel from './CmsNavipanel';
// import '../admin_css/EditQuestionCIST.css';

const EditQuestionCIST = ({ userRole }) => {
  const { id } = useParams();
  const [type, setType] = useState('');
  const [questionText, setQuestionText] = useState('');
  const [answerOptions, setAnswerOptions] = useState([]);
  const [correctAnswer, setCorrectAnswer] = useState('');
  const [currentOption, setCurrentOption] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`/api/cist_questions/${id}`)
      .then(res => res.json())
      .then(data => {
        setType(data.type);
        setQuestionText(data.question_text);
        setAnswerOptions(JSON.parse(data.answer_options));
        setCorrectAnswer(data.correct_answer);
      })
      .catch(err => console.error('Failed to fetch question:', err));
  }, [id]);

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

  const handleUpdateQuestion = () => {
    const updatedQuestion = {
      type,
      question_text: questionText,
      answer_options: answerOptions,
      correct_answer: correctAnswer
    };

    fetch(`/api/cist_questions/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(updatedQuestion)
    })
    .then(response => {
      if (response.ok) {
        navigate('/cmscist');
      }
    })
    .catch(error => console.error('Error updating question:', error));
  };

  return (
    <div className="cms-container">
      <CmsSidebar userRole={userRole} />
      <CmsNavipanel userRole={userRole}  />
      <div className="cms-main-content">
        <header className='major' id='major-rest'>
          <h2>문제 수정</h2>
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
            />
          </div>
          <div className="Cms-form-group">
            <label>정답 선택지:</label>
            <div className="option-input">
              <input 
                type="text" 
                value={currentOption} 
                onChange={(e) => setCurrentOption(e.target.value)} 
              />
              <button onClick={handleAddOption}>추가</button>
            </div>
            <ul>
              {answerOptions.map((option, index) => (
                <li key={index}>
                  {index + 1}. {option}
                  <button 
                    className="delete-button" 
                    onClick={() => handleDeleteOption(index)}
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
            />
          </div>
          <div className="Cms-form-buttons">
            <button className="button" onClick={() => navigate('/cmscist')}>취소</button>
            <button className="button primary" onClick={handleUpdateQuestion}>저장</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditQuestionCIST;

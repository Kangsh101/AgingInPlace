import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import '../css/Cms.css';
import CmsSidebar from './CmsSidebar';
import CmsNavipanel from './CmsNavipanel';
import '../admin_css/CmsCIST.css';

const QuestionDetailCIST = () => {
  const { id } = useParams();
  const [question, setQuestion] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`/api/cist_questions/${id}`)
      .then(res => res.json())
      .then(data => {
        setQuestion(data);
      })
      .catch(err => console.error('Failed to fetch question:', err));
  }, [id]);

  const handleDelete = () => {
    fetch(`/api/cist_questions/${id}`, {
      method: 'DELETE'
    })
    .then(response => {
      if (response.ok) {
        navigate('/cmscist');
      }
    })
    .catch(error => console.error('Error deleting question:', error));
  };

  if (!question) {
    return <div>Loading...</div>;
  }

  return (
    <div className="cms-container">
      <CmsSidebar />
      <CmsNavipanel />
      <div className="cms-main-content">
        <header className='major' id='major-rest'>
          <h2>문제 상세</h2>
        </header>
        <div className="QuestionDetail-content">
          <h3>유형: {question.type}</h3>
          <p>문제: {question.question_text}</p>
          <p>정답 선택지: {JSON.parse(question.answer_options).join(', ')}</p>
          <p>정답: {question.correct_answer}</p>
          <div className="QuestionDetail-buttons">
            <Link to="/cmscist">
              <button className="button">목록</button>
            </Link>
            <button 
              className="button primary" 
              onClick={() => navigate(`/addquestioncist/${id}`)}
            >
              수정
            </button>
            <button 
              className="button" 
              onClick={handleDelete}
            >
              삭제
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuestionDetailCIST;

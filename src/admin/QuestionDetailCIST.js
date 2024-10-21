import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import '../css/Cms.css';
import CmsSidebar from './CmsSidebar';
import CmsNavipanel from './CmsNavipanel';
import '../admin_css/CmsCIST.css';

const QuestionDetailCIST = ({ userRole }) => {
  const { id } = useParams(); // URL 파라미터에서 id를 받아옴
  const [questions, setQuestions] = useState([]); // 여러 개의 문제를 저장
  const navigate = useNavigate();

  useEffect(() => {
    if (userRole !== 'admin' && userRole !== 'doctor') {
      navigate('/notfound');
    }
  }, [userRole, navigate]);

  useEffect(() => {
    fetch(`/api/cist_questions_by_title/${id}`) // title로 묶인 모든 문제를 가져옴
      .then((res) => res.json())
      .then((data) => setQuestions(data))
      .catch((err) => console.error('Failed to fetch questions:', err));
  }, [id]);

  const handleDelete = (questionId) => {
    fetch(`/api/cist_questions/${questionId}`, {
      method: 'DELETE',
    })
      .then((response) => {
        if (response.ok) {
          navigate('/cmscist');
        }
      })
      .catch((error) => console.error('Error deleting question:', error));
  };

  if (questions.length === 0) {
    return <div>Loading...</div>;
  }

  return (
    <div className="cms-container">
      <CmsSidebar userRole={userRole} />
      <CmsNavipanel userRole={userRole} />
      <div className="cms-main-content">
        <header className="major" id="major-rest">
          <h2>문제 상세</h2>
        </header>

        <div className="QuestionDetail-content">
          <h3>유형: {questions[0].type}</h3>
          <h4>문제: {questions[0].title}</h4>


          {/* 여러 문제를 반복하여 표시 */}
          {questions.map((question) => (
            <div key={question.id} className="question-item">
              <p className='questions-cistc'>{question.question_text}</p>
              {question.image_url && (
                <div className="question-image">
                  <img src={question.image_url} alt="문제 이미지" />
                </div>
              )}
              <p>정답: {question.correct_answer}</p>

              {/* 수정 및 삭제 버튼 유지 */}
              <div className="QuestionDetail-buttons">
                {/* <button
                  className="button primary"
                  onClick={() => navigate(`/addquestioncist/${question.id}`)}
                >
                  수정
                </button> */}
                <button
                  className="button"
                  onClick={() => handleDelete(question.id)}
                  id="cancle-btt"
                >
                  삭제
                </button>
              </div>
            </div>
          ))}

          <Link to="/cmscist">
            <button className="button">목록</button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default QuestionDetailCIST;

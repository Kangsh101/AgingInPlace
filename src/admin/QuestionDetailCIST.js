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

  // 권한 검사 후 잘못된 접근 시 리디렉션
  useEffect(() => {
    if (userRole !== 'admin' && userRole !== 'doctor') {
      navigate('/notfound');
    }
  }, [userRole, navigate]);

  // 문제 데이터를 API에서 가져오기
  useEffect(() => {
    fetch(`/api/cist_questions_by_title/${id}`)
      .then((res) => res.json())
      .then((data) => setQuestions(data))
      .catch((err) => console.error('Failed to fetch questions:', err));
  }, [id]);

  // 문제 삭제 처리
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

          {questions.map((question) => (
            <div key={question.id} className="question-item">
              <div
                className="questions-cistc"
                dangerouslySetInnerHTML={{ __html: question.question_text }}
              />

              <p>정답: {question.correct_answer}</p>

              <div className="QuestionDetail-buttons">
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

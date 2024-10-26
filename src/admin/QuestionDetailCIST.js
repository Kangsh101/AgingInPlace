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
  const [userRole2, setUserRole] = useState(null);
  const decodedId = decodeURIComponent(id);


  // 권한 검사 후 잘못된 접근 시 리디렉션
  useEffect(() => {
    fetch('/api/user/role', {
      method: 'GET',
      credentials: 'include' // 세션 정보 포함
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('권한이 없습니다.');
        }
        return response.json();
      })
      .then((data) => {
        if (data.role === 'admin' || data.role === 'doctor') {
          setUserRole(data.role); // 권한이 admin 또는 doctor일 경우
        } else {
          navigate('/notfound'); // 권한이 없을 경우 접근 제한
        }
      })
      .catch((error) => {
        console.error('API 호출 오류:', error);
        navigate('/notfound'); // 오류 시 접근 제한
      });
  }, [navigate]);

  useEffect(() => {
    fetch(`/api/cist_questions_by_title/${decodedId}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error('데이터를 불러오는 데 실패했습니다.');
        }
        return res.json();
      })
      .then((data) => setQuestions(data))
      .catch((err) => console.error('Failed to fetch questions:', err));
  }, [decodedId]);


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

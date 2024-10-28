import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import '../css/Cms.css';
import '../css/Cmsuser.css';
import '../css/AddPatientCriteria.css';
import CmsSidebar from './CmsSidebar';
import CmsNavipanel from './CmsNavipanel';
import NotFound from '../component/NotFound';

const CmsUserQuestions = ({ userRole }) => {
  const { userId } = useParams();
  const [questions, setQuestions] = useState([]);
  const [userName, setUserName] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const questionsPerPage = 7;
  const navigate = useNavigate();
  const [scores, setScores] = useState({});
  const [expandedQuestionId, setExpandedQuestionId] = useState(null);

  useEffect(() => {
    fetchUserQuestions();
    fetchUserName();
  }, []);

  const fetchUserQuestions = () => {
    fetch(`/api/user/${userId}/questions`)
      .then((response) => {
        if (!response.ok) {
          throw new Error('유저의 문제와 정답을 불러오는 중 오류');
        }
        return response.json();
      })
      .then((data) => setQuestions(data))
      .catch((error) => {
        console.error('유저의 문제와 정답을 불러오는 중 오류:', error);
        navigate('/notfound');
      });
  };

  const fetchUserName = () => {
    fetch(`/api/user/${userId}/name`)
      .then((response) => {
        if (!response.ok) {
          throw new Error('유저 이름을 불러오는 중 오류');
        }
        return response.json();
      })
      .then((data) => setUserName(data.name))
      .catch((error) => {
        console.error('유저 이름을 불러오는 중 오류:', error);
        navigate('/notfound');
      });
  };

  const handleDeleteAllQuestions = () => {
    if (window.confirm('정말 모든 질문을 삭제하시겠습니까?')) {
      fetch(`/api/user/${userId}/questions`, {
        method: 'DELETE',
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error('질문 삭제 중 오류 발생');
          }
          alert('모든 질문이 삭제되었습니다.');
          setQuestions([]);
        })
        .catch((error) => console.error('질문 삭제 중 오류:', error));
    }
  };

  const handleScoreSubmit = (questionId, score) => {
    setScores((prevScores) => ({
      ...prevScores,
      [questionId]: score,
    }));
  };

  const handleSaveScore = (questionId) => {
    const score = scores[questionId];
    if (score) {
      fetch('/api/cist_responses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: userId,
          questionId: questionId,
          score: score,
        }),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error('점수 저장 중 오류 발생');
          }
          return response.json();
        })
        .then((data) => {
          alert(data.message);
        })
        .catch((error) => {
          console.error('점수 저장 중 오류:', error);
        });
    } else {
      alert('점수를 선택해주세요.');
    }
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const toggleQuestionDetails = (questionId) => {
    setExpandedQuestionId((prevId) => (prevId === questionId ? null : questionId));
  };

  const indexOfLastQuestion = currentPage * questionsPerPage;
  const indexOfFirstQuestion = indexOfLastQuestion - questionsPerPage;
  const currentQuestions = questions.slice(indexOfFirstQuestion, indexOfLastQuestion);
  const totalPages = Math.ceil(questions.length / questionsPerPage);

  return (
    <div className='cms-container'>
      <CmsSidebar userRole={userRole} />
      <CmsNavipanel userRole={userRole} />
      <div className="cms-main-content">
        <div className="cms-questions-content">
          <div className="Cmss-header">
            <header className='major' id='major-rest'>
              <h2>{userName}님의 입력한 문제와 정답</h2>
            </header>
          </div>
          <div className="Cmss-content">
            {currentQuestions.length === 0 ? (
              <p>Loading...</p>
            ) : (
              <div className="questions-table-container">
                <table className="styled-table no-wrap">
                  <thead>
                    <tr>
                      <th id='nowrap'>문제 유형</th>
                      <th id='nowrap'>제목</th>          
                      <th id='nowrap'>문제 내용</th>
                      <th id='nowrap'>상세보기</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentQuestions.map((question) => (
                      <React.Fragment key={question.question_id}>
                        <tr>
                          <td>{question.type}</td>
                          <td>{question.title}</td>     
                          <td>{question.question_text}</td>
                          <td>
                            <button onClick={() => toggleQuestionDetails(question.question_id)}>
                              {expandedQuestionId === question.question_id ? '숨기기' : '상세보기'}
                            </button>
                          </td>
                        </tr>
                        {expandedQuestionId === question.question_id && (
                          <tr>
                            <td colSpan={3}>
                              <div>
                                <strong>유저의 답:</strong> {question.user_answer}<br />
                                <strong>정답:</strong> {question.correct_answer || '없음'}<br />
                                <strong>점수:</strong> {scores[question.question_id] || '미채점'}<br />
                                <strong>채점하기:</strong>
                                <select
                                  onChange={(e) => handleScoreSubmit(question.question_id, e.target.value)}
                                  defaultValue=""
                                >
                                  <option value="" disabled>점수 선택</option>
                                  {[0, 1, 2, 3, 4, 5].map(score => (
                                    <option key={score} value={score}>{score}</option>
                                  ))}
                                </select>
                                <button onClick={() => handleSaveScore(question.question_id)}>저장</button> {/* 저장 버튼 추가 */}
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            <div className="pagination-container">
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i + 1}
                  className={`page-button ${currentPage === i + 1 ? 'active' : ''}`}
                  onClick={() => handlePageChange(i + 1)}
                >
                  {i + 1}
                </button>
              ))}
            </div>
            <div className="button-container">
              <button className="button danger" onClick={handleDeleteAllQuestions}>
                모든 질문 삭제
              </button>
              <Link to="/CmsQuestionList">
                <button className="button primary">목록으로 돌아가기</button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CmsUserQuestions;

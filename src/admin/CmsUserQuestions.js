import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import '../css/Cms.css';
import '../css/Cmsuser.css';
import '../css/AddPatientCriteria.css'; // 동일한 CSS 사용
import CmsSidebar from './CmsSidebar';
import CmsNavipanel from './CmsNavipanel';
import NotFound from '../component/NotFound';

const CmsUserQuestions = ({ userRole }) => {
  const { userId } = useParams(); // URL에서 userId 가져오기
  const [questions, setQuestions] = useState([]);
  const [userName, setUserName] = useState(''); // 유저 이름 상태값 추가
  const [currentPage, setCurrentPage] = useState(1); // 현재 페이지 상태
  const questionsPerPage = 7; // 페이지 당 문제 수
  const navigate = useNavigate(); // 오류 시 사용될 네비게이트

  // 유저의 문제와 정답 및 이름 가져오기
  useEffect(() => {
    fetchUserQuestions();
    fetchUserName(); // 유저 이름 가져오기 호출
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
        navigate('/notfound'); // 오류 시 NotFound 페이지로 이동
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
      .then((data) => setUserName(data.name)) // 이름 설정
      .catch((error) => {
        console.error('유저 이름을 불러오는 중 오류:', error);
        navigate('/notfound'); // 오류 시 NotFound 페이지로 이동
      });
  };

  // 삭제 버튼 클릭 시 호출되는 함수
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
          setQuestions([]); // 목록 초기화
        })
        .catch((error) =>
          console.error('질문 삭제 중 오류:', error)
        );
    }
  };

  // 페이지 변경 함수
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // 현재 페이지의 문제 목록 계산
  const indexOfLastQuestion = currentPage * questionsPerPage;
  const indexOfFirstQuestion = indexOfLastQuestion - questionsPerPage;
  const currentQuestions = questions.slice(indexOfFirstQuestion, indexOfLastQuestion);

  // 총 페이지 수 계산
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
                      <th id='nowrap'>유저의 답</th>
                      <th id='nowrap'>정답</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentQuestions.map((question) => (
                      <tr key={question.question_id}>
                        <td>{question.type}</td>
                        <td>{question.title}</td>     
                        <td>{question.question_text}</td>
                        <td>{question.user_answer}</td>
                        <td>{question.correct_answer || '없음'}</td>
                      </tr>
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

import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../css/Cms.css';
import CmsSidebar from './CmsSidebar';
import CmsNavipanel from './CmsNavipanel';
import '../admin_css/CmsCIST.css';

const CmsCIST = ({ userRole }) => {
  const [questions, setQuestions] = useState([]);
  const [groupedQuestions, setGroupedQuestions] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [questionsPerPage] = useState(10);
  const navigate = useNavigate();
  const [userRole2, setUserRole] = useState(null);
  
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
    fetchQuestions();
  }, []);

  const fetchQuestions = () => {
    fetch('/api/cist_questions')
      .then((res) => res.json())
      .then((data) => groupQuestionsByTitle(data))
      .catch((err) => console.error('Failed to fetch questions:', err));
  };

  const groupQuestionsByTitle = (data) => {
    const grouped = data.reduce((acc, question) => {
      if (!acc[question.title]) {
        acc[question.title] = [];
      }
      acc[question.title].push(question);
      return acc;
    }, {});
    setGroupedQuestions(grouped);
  };

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const indexOfLastQuestion = currentPage * questionsPerPage;
  const indexOfFirstQuestion = indexOfLastQuestion - questionsPerPage;
  const currentTitles = Object.keys(groupedQuestions).slice(
    indexOfFirstQuestion,
    indexOfLastQuestion
  );

  return (
    <div className="cms-container">
      <CmsSidebar userRole={userRole} />
      <CmsNavipanel userRole={userRole} />
      <div className="cms-main-content">
        <header className="major" id="major-rest">
          <h2>인지선별검사 관리</h2>
        </header>

        <div className="CIST-content">
          <div className="Cms-header">
            <Link to="/addquestioncist">
              <button className="button primary CIST-AddBtt">문제 추가</button>
            </Link>
          </div>
          <table>
            <thead>
              <tr>
                <th>No</th>
                <th>유형</th>
                <th>문제</th>
              </tr>
            </thead>
            <tbody>
              {currentTitles.map((title, index) => {
                const questionGroup = groupedQuestions[title];
                return (
                  <tr
                    key={index}
                    onClick={() =>
                      navigate(`/question_detail/${encodeURIComponent(title)}`)
                    }
                  >
                    <td>{indexOfFirstQuestion + index + 1}</td>
                    <td>{questionGroup[0].type}</td>
                    <td>{title}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <Pagination
            postsPerPage={questionsPerPage}
            totalPosts={Object.keys(groupedQuestions).length}
            paginate={paginate}
            currentPage={currentPage}
          />
        </div>
      </div>
    </div>
  );
};

const Pagination = ({ postsPerPage, totalPosts, paginate, currentPage }) => {
  const pageNumbers = [];

  for (let i = 1; i <= Math.ceil(totalPosts / postsPerPage); i++) {
    pageNumbers.push(i);
  }

  return (
    <div className="pagination">
      {pageNumbers.map((number) => (
        <button
          key={number}
          onClick={() => paginate(number)}
          className={`page-button ${number === currentPage ? 'active' : ''}`}
        >
          {number}
        </button>
      ))}
    </div>
  );
};

export default CmsCIST;

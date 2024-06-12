import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../css/Cms.css';
import CmsSidebar from './CmsSidebar';
import CmsNavipanel from './CmsNavipanel';
import '../admin_css/CmsCIST.css';

const CmsCIST = () => {
  const [questions, setQuestions] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [questionsPerPage] = useState(10);
  const navigate = useNavigate();

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = () => {
    fetch('/api/cist_questions')
      .then(res => res.json())
      .then(data => {
        setQuestions(data);
      })
      .catch(err => console.error('Failed to fetch questions:', err));
  };

  const paginate = pageNumber => setCurrentPage(pageNumber);

  const indexOfLastQuestion = currentPage * questionsPerPage;
  const indexOfFirstQuestion = indexOfLastQuestion - questionsPerPage;
  const currentQuestions = questions.slice(indexOfFirstQuestion, indexOfLastQuestion);

  return (
    <div className="cms-container">
      <CmsSidebar />
      <CmsNavipanel />
      <div className="cms-main-content">
        <header className='major' id='major-rest'>
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
              {currentQuestions.map((question, index) => (
                <tr key={question.id} onClick={() => navigate(`/question_detail/${question.id}`)}>
                  <td>{index + 1}</td>
                  <td>{question.type}</td>
                  <td>{question.question_text}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <Pagination
            postsPerPage={questionsPerPage}
            totalPosts={questions.length}
            paginate={paginate}
          />
        </div>
      </div>
    </div>
  );
};

const Pagination = ({ postsPerPage, totalPosts, paginate }) => {
  const pageNumbers = [];

  for (let i = 1; i <= Math.ceil(totalPosts / postsPerPage); i++) {
    pageNumbers.push(i);
  }

  return (
    <div className="Cms-pagebtt">
      {pageNumbers.map(number => (
        <button key={number} onClick={() => paginate(number)}>
          {number}
        </button>
      ))}
    </div>
  );
};

export default CmsCIST;

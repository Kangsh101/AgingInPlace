import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../css/Cms.css'; 
import CmsSidebar from './CmsSidebar';
import CmsNavipanel from './CmsNavipanel';

const CmsQuestionList = ({ userRole }) => {
  const [users, setUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage] = useState(10); // 한 페이지당 유저 수
  const navigate = useNavigate();

  useEffect(() => {
    fetchUserRole();
    fetchUsers();
  }, []);

  // 권한 확인
  const fetchUserRole = () => {
    fetch('/api/user/role', { method: 'GET', credentials: 'include' })
      .then(response => {
        if (!response.ok) throw new Error('권한이 없습니다.');
        return response.json();
      })
      .then(data => {
        if (data.role !== 'admin' && data.role !== 'doctor') {
          navigate('/notfound');
        }
      })
      .catch(error => {
        console.error('API 호출 오류:', error);
        navigate('/notfound');
      });
  };

  // 유저 목록 가져오기 (CIST_Responses와 members 조인)
  const fetchUsers = () => {
    fetch('/api/cist_users')
      .then(response => response.json())
      .then(data => setUsers(data))
      .catch(error => console.error('유저 목록을 불러오는 중 오류:', error));
  };

  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentUsers = users.slice(indexOfFirstPost, indexOfLastPost);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="cms-container">
      <CmsSidebar userRole={userRole} />
      <CmsNavipanel userRole={userRole} />
      <div className="cms-main-content">
        <header className="major" id="major-rest">
          <h2>인지선별 검사 결과</h2>
        </header>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>No</th>
                <th>성함</th>
                <th>타입</th>
              </tr>
            </thead>
            <tbody>
              {currentUsers.map((user, index) => (
                <tr key={user.user_id}>
                  <td>{indexOfFirstPost + index + 1}</td>
                  <td>
                    <Link to={`/CmsUserQuestions/${user.user_id}`}>{user.user_name}</Link>
                </td>
                  <td>{user.role}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <Pagination
            postsPerPage={postsPerPage}
            totalPosts={users.length}
            paginate={paginate}
            currentPage={currentPage}
          />
        </div>
      </div>
    </div>
  );
};

// Pagination 컴포넌트
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

export default CmsQuestionList;

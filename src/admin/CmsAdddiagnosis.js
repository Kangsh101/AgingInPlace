import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../css/Cms.css';
import '../css/Cmsuser.css';
import CmsSidebar from './CmsSidebar';
import CmsNavipanel from './CmsNavipanel';
import NotFound from '../component/NotFound';

const CmsAdddiagnosis = ({ userRole }) => {
  const [users, setUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage] = useState(7);
  const navigate = useNavigate();

  useEffect(() => {
    if (userRole !== 'admin' && userRole !== 'doctor') {
      navigate('/notfound'); 
    }
  }, [userRole, navigate]);

  useEffect(() => {
    fetch('/api/cmsusersAdd')
      .then(response => response.json())
      .then(data => setUsers(data))
      .catch(error => console.error('Error fetching users:', error));
  }, []);

  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = users.slice(indexOfFirstPost, indexOfLastPost);

  const paginate = pageNumber => setCurrentPage(pageNumber);

  return (
    <div className="cms-container">
      <CmsSidebar userRole={userRole} />
      <CmsNavipanel userRole={userRole} />
      <div className="cms-main-content">
        <div className="Cmss-header">
          <header className='major' id='major-rest'>
            <h2 className='aaaaaa'>진단명 추가</h2>
          </header>
          <div className="Cmss-options">
            <select className="Cmss-select">
              <option value="환자">성함</option>
              <option value="보호자">타입</option>
            </select>
            <input type="text" placeholder="사용자 정보를 입력해주세요." className="Cmss-search" />
            <button className="button primary">검색</button>
          </div>
        </div>
        <div className="Cmss-content">
          <table>
            <thead>
              <tr>
                <th>No</th>
                <th>타입</th>
                <th>성함</th>
                <th>성별</th>
                <th>보호자 성함</th>
              </tr>
            </thead>
            <tbody>
              {currentPosts.map((user, index) => (
                <tr key={index}>
                  <td>{indexOfFirstPost + index + 1}</td>
                  <td>{user.role}</td>
                  <td>
                    <Link to={`/patient/${user.id}`}>{user.patientName}</Link>
                  </td>
                  <td>{user.gender}</td>
                  <td>{user.guardianName || 'N'}</td>
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

const Pagination = ({ postsPerPage, totalPosts, paginate, currentPage }) => {
  const pageNumbers = [];

  for (let i = 1; i <= Math.ceil(totalPosts / postsPerPage); i++) {
    pageNumbers.push(i);
  }

  return (
    <div className="pagination">
      {pageNumbers.map(number => (
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

export default CmsAdddiagnosis;

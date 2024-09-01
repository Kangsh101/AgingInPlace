import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../css/Cms.css';
import '../css/Cmsuser.css';
import CmsSidebar from './CmsSidebar';
import CmsNavipanel from './CmsNavipanel';

const PatientCriteria = ({ userRole }) => {
  const [users, setUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage] = useState(7);

  useEffect(() => {
    fetch('/api/PatientCriteriaAdd')
      .then(response => response.json())
      .then(data => setUsers(data.map(user => ({
        ...user,
        birthdate: formatDate(user.birthdate)
      }))))
      .catch(error => console.error('Error fetching users:', error));
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = users.slice(indexOfFirstPost, indexOfLastPost);

  const paginate = pageNumber => setCurrentPage(pageNumber);

  return (
    <div className="cms-container">
      <CmsSidebar userRole={userRole} />
      <CmsNavipanel userRole={userRole}  />
      <div className="cms-main-content">
        <div className="Cmss-header">
          <header className='major' id='major-rest'> 
            <h2 className='aaaaaa'>환자 목록</h2>
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
                <th>생년월일</th>
              </tr>
            </thead>
            <tbody>
              {currentPosts.map((user, index) => (
                <tr key={index}>
                  <td>{indexOfFirstPost + index + 1}</td>
                  <td>{user.role}</td>
                  <td>
                    <Link to={`/addpatientcriteria/${user.id}`}>{user.name}</Link>
                  </td>
                  <td>{user.gender}</td>
                  <td>{user.birthdate}</td>
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

export default PatientCriteria;

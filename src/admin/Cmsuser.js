import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import '../css/Cms.css';
import '../css/Cmsuser.css';
import CmsSidebar from './CmsSidebar';
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa'; 

const Cmsuser = () => {
  const [users, setUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage] = useState(7);
  const [selectedUserIndex, setSelectedUserIndex] = useState(null);

  useEffect(() => {
    fetch('/api/cmsusers')
      .then(response => response.json())
      .then(data => setUsers(data.map(user => ({ 
        ...user, 
        joinDate: user.joinDate.split('T')[0],
        birthdate: user.birthdate.split('T')[0]
      }))))
      .catch(error => console.error('Error fetching users:', error));
  }, []);

  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = users.slice(indexOfFirstPost, indexOfLastPost);

  const paginate = pageNumber => setCurrentPage(pageNumber);

  const handleUserClick = (index) => {
    setSelectedUserIndex(selectedUserIndex === index ? null : index);
  };

  const handleDeactivateUser = (userId) => {
    fetch(`/api/deactivateUser/${userId}`, {
      method: 'PUT',
      credentials: 'include',
    })
    .then(response => {
      if (response.ok) {
        alert('사용자가 비활성화되었습니다.');
      } else {
        console.log('비활성화 실패');
      }
    })
    .catch(error => console.error('사용자 비활성화 오류:', error));
  };

  const handleActivateUser = (userId) => {
    fetch(`/api/activateUser/${userId}`, {
      method: 'PUT',
      credentials: 'include',
    })
    .then(response => {
      if (response.ok) {
        alert('사용자가 활성화되었습니다.');
      } else {
        console.log('활성화 실패');
      }
    })
    .catch(error => console.error('사용자 활성화 오류:', error));
  };

  return (
    <div className="cms-container">
      <CmsSidebar/>
      <div className="cms-main-content">
        <div className="Cmss-header">
          <header className='major' id='major-rest'> 
            <h2 className='aaaaaa'>사용자 관리</h2>
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
                <th>아이디</th>
                <th>타입</th>
                <th>성함</th>
                <th>성별</th>
                <th>가입일</th>
              </tr>
            </thead>
            <tbody>
              {currentPosts.map((user, index) => (
                <React.Fragment key={index}>
                  <tr onClick={() => handleUserClick(index)}>
                    <td>{indexOfFirstPost + index + 1}</td>
                    <td>{user.username}</td>
                    <td>{user.role}</td>
                    <td>{user.name}</td>
                    <td>{user.gender}</td>
                    <td>{user.joinDate}</td>
                  </tr>
                  {selectedUserIndex === index && ( 
                    <tr>
                      <td colSpan="6">
                      <div className="user-details">
                        <table className="details-table">
                          <tbody>
                            <tr>
                              <td><strong>아이디</strong></td>
                              <td>{user.username}</td>
                            </tr>
                            <tr>
                              <td><strong>타입</strong></td>
                              <td>{user.role}</td>
                            </tr>
                            <tr>
                              <td><strong>이름</strong></td>
                              <td>{user.name}</td>
                            </tr>
                            <tr>
                              <td><strong>성별</strong></td>
                              <td>{user.gender}</td>
                            </tr>
                            <tr>
                              <td><strong>이메일</strong></td>
                              <td>{user.email}</td>
                            </tr>
                            <tr>
                              <td><strong>생년월일</strong></td>
                              <td>{user.birthdate}</td>
                            </tr>
                            <tr>
                              <td><strong>전화번호</strong></td>
                              <td>{user.phoneNumber}</td>
                            </tr>
                            <tr>
                              <td><strong>가입일</strong></td>
                              <td>{user.joinDate}</td>
                            </tr>
                          </tbody>
                        </table>
                        <button className='cmsuser-bttt' onClick={()=> handleActivateUser(user.id)}>
                          <FaCheckCircle /> 활성화
                        </button>
                        <button className='cmsuser-btt' onClick={() => handleDeactivateUser(user.id)}>
                          <FaTimesCircle /> 비활성화
                        </button>
                      </div>

                      </td>
                    </tr>
                  )}
                </React.Fragment>
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

export default Cmsuser;

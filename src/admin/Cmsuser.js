import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import '../css/Cms.css';
import '../css/Cmsuser.css';
import CmsSidebar from './CmsSidebar';
const Cmsuser = () => {
  const [users, setUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage] = useState(7);
  const [selectedUserIndex, setSelectedUserIndex] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false); 

  // useEffect(() => {
  //   fetch('/api/checkRole', {
  //     method: 'GET',
  //     credentials: 'include'
  //   })
  //   .then(response => response.json())
  //   .then(data => {
  //     if (data.role !== 'admin') {
  //       setIsAdmin(false);
  //     } else {
  //       setIsAdmin(true); 
  //     }
  //   })
  //   .catch(error => console.error('권한 확인 실패:', error));
  // }, []);

  useEffect(() => {
    fetch('/api/cmsusers')
      .then(response => response.json())
      .then(data => setUsers(data.map(user => ({ ...user, joinDate: user.joinDate.split('T')[0],
            birthdate: user.birthdate.split('T')[0] 
    }))))
      .catch(error => console.error('Error fetching users:', error));
  }, []);

  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = users.slice(indexOfFirstPost, indexOfLastPost);

  const paginate = pageNumber => setCurrentPage(pageNumber);

  const location = useLocation();
  const handleUserClick = (index) => {
    setSelectedUserIndex(selectedUserIndex === index ? null : index); 
  };

  // if (!isAdmin) {
  //   return (
  //     <div>
  //       <h1>권한이 없습니다.</h1>
  //     </div>
  //   );
  // }
  const handleDeactivateUser = (userId) => {
    fetch(`/api/deactivateUser/${userId}`, {
      method: 'PUT',
      credentials: 'include',
    })
    .then(response => {
      if (response.ok) {
        alert('비활성화 되었습니다.');
      } else {
        console.log('비활성화 실패 오류')
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
        alert('활성화 되었습니다.');
      } else {
        console.log('활성화 실패 오류');
      }
    })
    .catch(error => console.error('사용자 활성화 오류:', error));
  };
  return (
    <div className="cms-container">
      {/* <div className="cms-sidebar">
        <h2 className='Cms-Aginginplace'>Aging in Place</h2>
        <h2>관리자 </h2>
        <ul>
          <li className="cms-item"><Link to="/Cmscontents">프로그램 컨텐츠</Link></li>
          <li className="cms-item"><Link to="/Cms">게시판 관리</Link></li>
          <li className={`cms-item2 ${location.pathname === "/Cmsuser" ? "cms-active" : ""}`}><Link to="/Cmsuser">사용자 관리</Link></li>
        </ul>
      </div> */}
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
                      <td colSpan="5">
                        <div className="user-details">
                          <p>아이디 : {user.username} </p>
                          <p>타입 : {user.role}</p>
                          <p>이름 : {user.name}</p>
                          <p>성별 : {user.gender}</p>
                          <p>이메일 : {user.email}</p>
                          <p>생년월일 : {user.birthdate}</p>
                          <p>전화번호 : {user.phoneNumber}</p>
                          <p>가입일 : {user.joinDate}</p>
                          <button className='cmsuser-bttt' onClick={()=> handleActivateUser(user.id)}>활성화</button>
                          <button className='cmsuser-btt' onClick={() => handleDeactivateUser(user.id)}>비활성화</button>
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
    <div>
      <div className="Cmss-pagebtt">
        {pageNumbers.map(number => (
          <button  key={number} onClick={() => paginate(number)}>
            {number}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Cmsuser;

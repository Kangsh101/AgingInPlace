import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../css/Cms.css';
import '../css/Cmsuser.css';
import CmsSidebar from './CmsSidebar';
import CmsNavipanel from './CmsNavipanel';

function handleFormDownloadActivity(name) {
  const form = document.createElement('form');
  form.method = 'POST';
  form.action = 'http://3.39.236.95:8080/downloadCsv/activityUsername';

  const input = document.createElement('input');
  input.type = 'hidden';
  input.name = 'username';  
  input.value = name;       
  form.appendChild(input);

  document.body.appendChild(form);
  form.submit();
  document.body.removeChild(form);
}

function handleFormDownloadSleep(name) {
  const form = document.createElement('form');
  form.method = 'POST';
  form.action = 'http://3.39.236.95:8080/downloadCsv/sleepUsername';

  const input = document.createElement('input');
  input.type = 'hidden';
  input.name = 'username';  
  input.value = name;     
  form.appendChild(input);

  document.body.appendChild(form);
  form.submit();
  document.body.removeChild(form);
}

function handleFormDownloadActivityAll() {
  const form = document.createElement('form');
  form.method = 'POST';
  form.action = 'http://3.39.236.95:8080/downloadCsv/activityAll';

  const input = document.createElement('input');
  input.type = 'hidden';

  form.appendChild(input);

  document.body.appendChild(form);
  form.submit();
  document.body.removeChild(form);
}

function handleFormDownloadSleepAll() {
  const form = document.createElement('form');
  form.method = 'POST';
  form.action = 'http://3.39.236.95:8080/downloadCsv/sleepAll';

  const input = document.createElement('input');
  input.type = 'hidden';
  form.appendChild(input);

  document.body.appendChild(form);
  form.submit();
  document.body.removeChild(form);
}

const CmsPDFDown = ({ userRole }) => {
  const [users, setUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage] = useState(7);
  const [selectedUserIndex, setSelectedUserIndex] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetch('/api/user/role', {
      method: 'GET',
      credentials: 'include'
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('권한이 없습니다.');
        }
        return response.json();
      })
      .then((data) => {
        if (data.role !== 'admin') {
          navigate('/notfound');
        }
      })
      .catch((error) => {
        console.error('API 호출 오류:', error);
        navigate('/notfound');
      });
  }, [navigate]);

  useEffect(() => {
    fetch('/api/cmsusers/0315')
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

  return (
    <div className="cms-container">
      <CmsSidebar userRole={userRole} />
      <CmsNavipanel userRole={userRole} />
      <div className="cms-main-content">
        <div className="Cmss-header">
          <header className='major' id='major-rest'> 
            <h2 className='aaaaaa'>환자 정보 다운로드</h2>
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
        <button 
            onClick={(e) => {
                     e.stopPropagation(); 
                          handleFormDownloadActivityAll();
                        }}
                      >
                        전체 운동 데이터(Excel) 
                      </button>
                      
                      <button 
                        onClick={(e) => {
                          e.stopPropagation(); 
                          handleFormDownloadSleepAll();
                        }}
                      >
                        전체 수면 데이터(Excel) 
                      </button>
        <div className="Cmss-content">
          <table>
            <thead>
              <tr>
                <th>No</th>
                {/* <th>아이디</th> */}
                <th>타입</th>
                <th>성함</th>
                {/* <th>성별</th> */}
                {/* <th>가입일</th> */}
                <th>다운로드</th>
              </tr>
            </thead>
            <tbody>
              {currentPosts.map((user, index) => (
                <React.Fragment key={user.id}>
                  <tr onClick={() => handleUserClick(index)}>
                    <td>{indexOfFirstPost + index + 1}</td>
                    {/* <td>{user.username}</td> */}
                    <td>{user.role}</td>
                    <td>{user.name}</td>
                    {/* <td>{user.gender}</td> */}
                    {/* <td>{user.joinDate}</td> */}
                    <td>
                      <button 
                        onClick={() => window.location.href = `/api/download-pdf/${user.id}`}
                      >
                        환자 정보(PDF) 
                      </button>

                      <button 
                        onClick={(e) => {
                          e.stopPropagation(); 
                          handleFormDownloadActivity(user.name);
                        }}
                      >
                        운동 데이터(Excel) 
                      </button>

                      <button 
                        onClick={(e) => {
                          e.stopPropagation(); 
                          handleFormDownloadSleep(user.name);
                        }}
                      >
                        수면 데이터(Excel) 
                      </button>
                      

                    </td>
                  </tr>
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

export default CmsPDFDown;

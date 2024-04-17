import React, { useState } from 'react';
import { Link, Route, Routes, useLocation } from 'react-router-dom';
import '../css/Cms.css';
import '../css/Cmscontents.css';

const Cmscontents = () => {
  const [posts, setPosts] = useState([
    { id: 1, type: '콘텐츠',title: '우울', author: '관리자', date: '2024-01-01',description:'우울에대한 설명 콘텐츠 설명 우울에대한 설명 콘텐츠 설명 우울에대한 설명 콘텐츠 설명 우울에대한 설명 콘텐츠 설명 우울에대한 설명 콘텐츠 설명 우울에대한 설명 콘텐츠 설명 우울에대한 설명 콘텐츠 설명  ' },
    { id: 2, type: '콘텐츠2',title: '수면장애', author: '매니저', date: '2024-01-21' },
    { id: 3, type: '콘텐츠3',title: '심장질환', author: '관리자', date: '2024-01-11' },
  ]);
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage] = useState(3); 
  const [selectedPostIndex, setSelectedPostIndex] = useState(null);

  const paginate = pageNumber => setCurrentPage(pageNumber);

  const handleClick = (index) => {
    setSelectedPostIndex(index);
  };

  const location = useLocation(); 

  return (
    <div className="cms-container">
      <div className="cms-sidebar">
        {/* <img src="/images/logo192.png" alt="Your Logo" /> */}
        <h2 className='Cms-Aginginplace'>Aging in Place</h2>
        <h2>관리자 </h2>
        <ul>
          <li className={`cms-item2 ${location.pathname === "/Cmscontents" ? "cms-active" : ""}`}>
            <Link to="/Cmscontents">프로그램 컨텐츠</Link>
          </li>
          <li className={`cms-item ${location.pathname === "/Cms" ? "cms-active" : ""}`}>
            <Link to="/Cms">게시판 관리</Link>
          </li>
          <li className={`cms-item ${location.pathname === "/Cmsuser" ? "cms-active" : ""}`}>
            <Link to="/Cmsuser">사용자 관리</Link>
          </li>
        </ul>
      </div>
      <div className="cms-main-content">
        <div className="Cmss-header">
          <h2>프로그램 콘텐츠 관리</h2>
          <div className="Cmss-options">
            <select className="Cmss-select">
              <option value="title">제목</option>
              <option value="author">작성자</option>
            </select>
            <input type="text" placeholder="검색어를 입력하세요" className="Cmss-search" />
            <button className="button primary">검색</button>
          </div>
        </div>
        <div className="Cmss-content">
          <table>
            <thead>
              <tr>
                <th>No</th>
                <th>분류</th>
                <th>제목</th>
                <th>작성자</th>
                <th>등록일</th>
              </tr>
            </thead>
            <tbody >
              {posts.map((post, index) => (
                <React.Fragment key={post.id}>
                  <tr onClick={() => handleClick(index)}>
                    <td>{post.id}</td>
                    <td>{post.type}</td>
                    <td>{post.title}</td>
                    <td>{post.author}</td>
                    <td>{post.date}</td>
                  </tr>
                  {selectedPostIndex === index && (
                    <tr className='sang-trtag'>
                      <td colSpan="5">
                        <div className="selected-post">
                          <div className='cms-confile'>
                             <p className='sang-contents'>{post.title}</p>  
                             <p className='sang-contents1'>이미지</p>
                             <p className='sang-contents2'>첨부내용</p>
                             <button className='sang-contents3'>첨부파일</button>
                          </div>
                          <p className='sang-description'>{post.description}</p>
                          <div className='sang-bttcon'>
                            <button className='sang-btt'>게시글 수정</button>
                            <button className='sang-btt'>게시글 삭제</button>
                          </div>
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
            totalPosts={posts.length}
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
          <button key={number} onClick={() => paginate(number)}>
            {number}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Cmscontents;

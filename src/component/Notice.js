import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../css/Page2.css';
import '../css/Page4.css';

const Notice = () => {
  const [posts, setPosts] = useState([
    { id: 1, set:'공지사항', title: '오늘의 공지', author: '매니저', date: '2024-01-01', description: '공지사항 내용입니다.' },
    { id: 2, set:'공지사항', title: '내일의 공지', author: '관리자', date: '2024-01-02', description: '공지사항 내용입니다.' },
    { id: 3, set:'공지사항', title: '약 복 공지', author: '매니저', date: '2024-01-03', description: '공지사항 내용입니다.' },
    { id: 4, set:'공지사항', title: '알림', author: '관리자', date: '2024-01-04', description: '공지사항 내용입니다.' },
  ]);
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage] = useState(7);
  const [selectedPostIndex, setSelectedPostIndex] = useState(null);

  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;

  const paginate = pageNumber => setCurrentPage(pageNumber);

  const handleClick = (index) => {
    setSelectedPostIndex(index === selectedPostIndex ? null : index);
  };

  return (
    <div>
      <div className="qna-page">
        <nav className="qna-navigation">
          <sapn className="qna-nav-ALL">전체</sapn>
          <Link to="/qnapage" className="qna-nav-item">QnA게시판</Link>
          <Link to="/notice" className="qna-nav-item-Q">공지사항</Link>
          <Link to="/faqpage" className="qna-nav-item">자주묻는질문</Link>
        </nav>
      </div>

      <div className="qna-header">
        <div className="qna-options">
          <h2 className='aaaaaa'>공지사항</h2>
          <select className="qna-select">
            <option value="title">제목</option>
            <option value="author">작성자</option>
          </select>
          <input type="text" placeholder="검색어를 입력하세요" className="qna-search" />
          <button className="qna-button">검색</button>
        </div>
      </div>
      
      <div className="notice-table">
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
          <tbody>
            {posts.map((post, index) => (
              <React.Fragment key={post.id}>
                <tr onClick={() => handleClick(index)}>
                  <td>{post.id}</td>
                  <td>{post.set}</td>
                  <td>{post.title}</td>
                  <td>{post.author}</td>
                  <td>{post.date}</td>
                </tr>
                {selectedPostIndex === index && (
                  <tr>
                    <td colSpan="5">{post.description}</td>
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
  );
};

const Pagination = ({ postsPerPage, totalPosts, paginate }) => {
  const pageNumbers = [];

  for (let i = 1; i <= Math.ceil(totalPosts / postsPerPage); i++) {
    pageNumbers.push(i);
  }

  return (
    <div className="pagebtt">
      {pageNumbers.map(number => (
        <button key={number} onClick={() => paginate(number)}>
          {number}
        </button>
      ))}
    </div>
  );
};

export default Notice;

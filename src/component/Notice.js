import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../css/Page2.css';
import '../css/Page4.css';

const NoticePage = () => {
  const [posts, setPosts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage] = useState(7);

  useEffect(() => {
    fetch('/api/notices')
      .then(response => response.json())
      .then(data => {
        const postsWithNumbers = data.reverse().map((post, index) => ({
          ...post,
          number: index + 1,
          created_at: formatDate(post.created_at) 
        }));
        setPosts(postsWithNumbers);
      })
      .catch(error => console.error('데이터를 불러오는 중 에러 발생:', error));
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const formattedDate = date.toISOString().split('T')[0];
    return formattedDate;
  };

  const paginate = pageNumber => setCurrentPage(pageNumber);

  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost);

  return (
    <div className="row gtr-150">
      <div className="col-4 col-12-medium">
        <header className='major'>
          <h2 className='aaaaaa'>공지사항</h2>
        </header>
        <div className="qna-header">
          <div className="qna-options">
            <select className="qna-select" id='asdadad'>
              <option value="title">제목</option>
              <option value="author">작성자</option>
            </select>
            <input type="text" placeholder="검색어를 입력하세요" className="qna-search" />
            <button className="button primary" id='QnA-searchBtt'>검색</button>
            <div className="search-write-container"></div>
          </div>
        </div>
        <div className="notice-table">
          <table>
            <thead>
              <tr>
                <th>번호</th>

                <th>제목</th>
                <th>작성자</th>
                <th>등록일</th>
              </tr>
            </thead>
            <tbody>
              {currentPosts.map((post, index) => (
                <tr key={post.post_id}>
                  <td>{post.number}</td>

                  <td className='skskskssksk'><Link to={`/noticecontent/${post.post_id}`}>{post.title}</Link></td>
                  <td>{post.user_name}</td>
                  <td>{post.created_at}</td>
                </tr>
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
    <div className="pagebtt">
      {pageNumbers.map(number => (
        <button key={number} onClick={() => paginate(number)}>
          {number}
        </button>
      ))}
    </div>
  );
};

export default NoticePage;

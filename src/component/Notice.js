import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../css/Page2.css';
import '../css/Page4.css';

const Notice = () => {
  const [posts, setPosts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage] = useState(7);
  const [selectedPostIndex, setSelectedPostIndex] = useState(null);

  useEffect(() => {
    fetch('/api/notices')
      .then(response => response.json())
      .then(data => {
        const postsWithNumbers = data.reverse().map((post, index) => ({
          ...post,
          number: index + 1,
          create_at: formatDate(post.create_at) 
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

  const handleClick = (index) => {
    setSelectedPostIndex(index === selectedPostIndex ? null : index);
  };

  return (
    <div className="row gtr-150">
      {/* <div className="qna-page">
        <nav className="qna-navigation">
          <span className="qna-nav-ALL">전체</span>
          <Link to="/qnapage" className="qna-nav-item">QnA게시판</Link>
          <Link to="/notice" className="qna-nav-item-Q">공지사항</Link>
          <Link to="/faqpage" className="qna-nav-item">자주묻는질문</Link>
        </nav>
      </div> */}

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
              <button className="button primary" id='QnA-Upbtt'>
             
            </button>
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
                    <td>{post.number}</td>
                    <td>{post.board_type}</td>
                    <td>{post.title}</td>
                    <td>{post.name}</td>
                    <td>{post.create_at}</td>
                  </tr>
                  {selectedPostIndex === index && (
                    <tr className='sang-trtag'>
                      <td colSpan="5">
                        <div className="selected-post">
                          <p className='sang-title'>{post.title}</p>
                          <p className='sang-description'>{post.content}</p>
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

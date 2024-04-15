import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../css/Page2.css';

const QnAPage = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [posts, setPosts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage] = useState(3);
  const [searchType, setSearchType] = useState("title"); 
  const [searchKeyword, setSearchKeyword] = useState(""); 
  const [post, setPost] = useState(null); 

  useEffect(() => {
    fetch('/api/checklogin')
      .then(res => res.json())
      .then(data => {
        setIsLoggedIn(data.isLoggedIn);
      })
      .catch(err => console.error('로그인 상태 확인 실패:', err));

    fetchPosts();
  }, []);

  const fetchPosts = () => {
    fetch('/api/qnaposts')
      .then(res => res.json())
      .then(data => {
        setPosts(data.map(post => ({
          ...post,
          create_at: post.create_at.split('T')[0] 
        })));
      })
      .catch(err => console.error('QNA 게시글 불러오기 실패:', err));
  };

  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost);

  const handleLoginButtonClick = () => {
    if (!isLoggedIn) {
      alert('로그인을 해주세요.');
    } else {
      window.location.href = '/qnaup';
    }
  };

  const paginate = pageNumber => setCurrentPage(pageNumber);

  const handleSearchKeywordChange = (e) => {
    setSearchKeyword(e.target.value);
  };

  const handleSearchTypeChange = (e) => {
    setSearchType(e.target.value);
  };
  const handleSearch = () => {
    fetch(`/api/search-posts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ searchType, searchKeyword }),
    })
      .then(res => res.json())
      .then(data => {
        setPosts(data); 
      })
      .catch(err => console.error('검색 중 오류 발생:', err));
  };

  const handlePostClick = (postId) => {
    if (!postId) {
      console.error('게시글 ID가 유효하지 않습니다.');
      return;
    }
    fetch(`/api/qnaposts/${postId}`)
      .then(res => res.json())
      .then(data => {
        setPost(data); 
      })
      .catch(err => console.error('게시글 가져오기 실패:', err));
  };

  return (
    <div className="row gtr-150">
      <div className="col-4 col-12-medium">
      <header className='major'> 
          <h2 className='aaaaaa'>QnA</h2>
        </header>
        <div className="qna-header">
          <div className="qna-options">  
              <select className="qna-select"  id='asdadad' value={searchType} onChange={handleSearchTypeChange}>
                <option value="title">제목</option>
                <option value="author">작성자</option>
              </select>
              <input type="text" placeholder="검색어를 입력하세요" className="qna-search" value={searchKeyword} onChange={handleSearchKeywordChange} />
              <button className="button primary" id='QnA-searchBtt' onClick={handleSearch}>검색</button>
              <div className="search-write-container">
                  
                  <button className="button primary" id='QnA-Upbtt' onClick={handleLoginButtonClick}>
                  {isLoggedIn ? '글쓰기' : '글쓰기'}
                </button>
              </div>
            </div>
        </div>

        <div className="qna-content">
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
              <tr key={post.board_id} onClick={() => handlePostClick(post.board_id)}>
                <td>{index + 1 + (currentPage - 1) * postsPerPage}</td>
                <td className='skskskssksk'><Link to={`/qnacontent/${post.board_id}`}>{post.title}</Link></td>
                <td>{post.name}</td>
                <td>{post.create_at}</td>
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
    <div>
      <div className="pagebtt">
        {pageNumbers.map(number => (
          <button key={number} onClick={() => paginate(number)}>
            {number}
          </button>
        ))}
      </div>
    </div>
  );
};

export default QnAPage;

import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../css/Cms.css';
import CmsSidebar from './CmsSidebar';
import CmsNavipanel from './CmsNavipanel';

const Cms = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [posts, setPosts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage] = useState(5);
  const [selectedPostIndex, setSelectedPostIndex] = useState(null);
  const [searchType, setSearchType] = useState("title");
  const [searchKeyword, setSearchKeyword] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchNotices();
  }, []);

  const fetchNotices = () => {
    fetch('/api/notices')
      .then(res => res.json())
      .then(data => {
        const postsWithNumbers = data.reverse().map((post, index) => ({
          ...post,
          number: index + 1,
          created_at: formatDate(post.created_at)
        }));
        setPosts(postsWithNumbers);
      })
      .catch(err => console.error('Failed to fetch notices:', err));
  };

  const paginate = pageNumber => setCurrentPage(pageNumber);

  const handleDelete = (id, index) => {
    fetch(`/api/notices/${id}`, {
      method: 'DELETE'
    })
    .then(response => {
      if (response.ok) {
        const updatedPosts = [...posts];
        updatedPosts.splice(index, 1);
        setPosts(updatedPosts);
      }
    })
    .catch(error => console.error('Error deleting post:', error));
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  const handleSearchKeywordChange = (e) => {
    setSearchKeyword(e.target.value);
  };

  const handleSearchTypeChange = (e) => {
    setSearchType(e.target.value);
  };

  const handleSearch = () => {
    fetch(`/api/notice/search`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ searchType, searchKeyword }),
    })
      .then(res => res.json())
      .then(data => {
        const postsWithNumbers = data.reverse().map((post, index) => ({
          ...post,
          number: index + 1,
          created_at: formatDate(post.created_at)
        }));
        setPosts(postsWithNumbers);
      })
      .catch(err => console.error('Error during search:', err));
  };

  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost);

  return (
<div className="cms-container">
  <CmsSidebar />
  <CmsNavipanel />

  <div className="cms-main-content">
    <header className='major'>
      <h2>공지사항</h2>
    </header>
    <div className="Cmss-header">
      <div className='Cmss-chch'>
        <Link to="/Cms"><button className='button' id='cms-nodicego'>공지사항 게시판</button></Link>
        <Link to="/Cmsfaq"><button className='button' id='Notice-nofaq'>FAQ 게시판</button></Link>
      </div>
      <div className="Cmss-options">
        <select className="Cmss-select" onChange={handleSearchTypeChange}>
          <option value="title">제목</option>
          <option value="author">작성자</option>
          <option value="title_author">제목 + 작성자</option>
        </select>
        <input type="text" placeholder="검색어를 입력하세요" className="Cmss-search" onChange={handleSearchKeywordChange} />
        <button className="button primary" onClick={handleSearch}>검색</button>
      </div>
      <div className='Cms-noticefaqbtt'>
        <Link to="/noticeup">
          <button className="button1" id='saddasdasd'>공지사항 등록</button>
        </Link>
      </div>
    </div>
    <div className="Cmss-content">
      <table>
        <thead>
          <tr>
            <th>No</th>
            <th>제목</th>
            <th>작성자</th>
            <th>등록일</th>
          </tr>
        </thead>
        <tbody>
          {currentPosts.map((post, index) => (
            <React.Fragment key={post.post_id}>
              <tr className='skskskssksk' onClick={() => navigate(`/cmsnoticecontent/${post.post_id}`)}>
                <td>{post.number}</td>
                <td>{post.title}</td>
                <td>{post.user_name}</td>
                <td>{post.created_at}</td>
              </tr>
            </React.Fragment>
          ))}
        </tbody>
      </table>
      <Pagination
        postsPerPage={postsPerPage}
        totalPosts={posts.length}
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

export default Cms;

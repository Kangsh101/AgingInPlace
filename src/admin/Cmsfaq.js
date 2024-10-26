import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import '../css/Cms.css';
import CmsSidebar from './CmsSidebar';
import CmsNavipanel from './CmsNavipanel';
import NotFound from '../component/NotFound'; // NotFound 컴포넌트 경로는 필요에 따라 조정

const Cmsfaq = ({ userRole }) => {
  const [posts, setPosts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage] = useState(5);
  const [selectedPostIndex, setSelectedPostIndex] = useState(null);
  const navigate = useNavigate();

  const handleClick = (index) => {
    if (selectedPostIndex === index) {
      setSelectedPostIndex(null);
    } else {
      setSelectedPostIndex(index);
    }
  };

  // 권한 확인 로직 추가
  useEffect(() => {
    fetch('/api/user/role', {
      method: 'GET',
      credentials: 'include' // 쿠키 및 세션 정보 포함
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('권한이 없습니다.');
        }
        return response.json();
      })
      .then((data) => {
        if (data.role !== 'admin') {
          navigate('/notfound'); // 관리자만 접근 가능
        }
      })
      .catch((error) => {
        console.error('API 호출 오류:', error);
        navigate('/notfound');
      });
  }, [navigate]);


  useEffect(() => {
    fetch('/api/faq')
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

  const handleDelete = (id, index) => {
    fetch(`/api/faq/${id}`, {
      method: 'DELETE'
    })
    .then(response => {
      if (response.ok) {
        const updatedPosts = [...posts];
        updatedPosts.splice(index, 1);
        alert('게시글이 삭제되었습니다.');
        setPosts(updatedPosts);
      }
    })
    .catch(error => console.error('게시글을 삭제하는 중 에러 발생:', error));
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  const truncateText = (htmlString, maxLength) => {
    const tempElement = document.createElement("div");
    tempElement.innerHTML = htmlString;
    const textContent = tempElement.textContent || tempElement.innerText || "";
    return textContent.length > maxLength ? textContent.slice(0, maxLength) + "..." : textContent;
  };

  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost);

  const paginate = pageNumber => setCurrentPage(pageNumber);

  const location = useLocation();

  return (
    <div className="cms-container">
      <CmsSidebar userRole={userRole} />
      <CmsNavipanel userRole={userRole} />
      <div className="cms-main-content">
        <header className='major' id='major-rest'>
          <h2>FAQ</h2>
        </header>
        <div className="Cmss-header">
          <div className='Cmss-chch'>
            <Link to="/Cms"><button className='button' id='Notice-nofaq' >공지사항 게시판</button></Link>
            <Link to="/Cmsfaq"><button className='button' id='cms-nodicego'>FAQ 게시판</button></Link>
          </div>
          <div className="Cmss-options">
            <select className="Cmss-select">
              <option value="title">제목</option>
              <option value="author">작성자</option>
            </select>
            <input type="text" placeholder="검색어를 입력하세요" className="Cmss-search" />
            <button className="button primary">검색</button>
          </div>
          <div className='Cms-noticefaqbtt'>
            <Link to="/faqup">
              <button className="button1" id='saddasdasd'>FAQ 등록</button>
            </Link>
          </div>
        </div>
        <div className="Cmss-content">
          <table>
            <thead>
              <tr>
                <th>No</th>
                <th>Q</th>
                <th>A</th>
                <th>작성자</th>
              </tr>
            </thead>
            <tbody>
              {currentPosts.map((post, index) => (
                <React.Fragment key={post.post_id}>
                  <tr onClick={() => handleClick(indexOfFirstPost + index)}>
                    <td>{indexOfFirstPost + index + 1}</td>
                    <td className="ellipsis" dangerouslySetInnerHTML={{ __html: truncateText(post.title, 50) }}></td>
                    <td className="ellipsis" dangerouslySetInnerHTML={{ __html: truncateText(post.content, 50) }}></td>
                    <td>{post.user_name}</td>
                  </tr>
                  {selectedPostIndex === indexOfFirstPost + index && (
                    <tr className='sang-trtag'>
                      <td colSpan="4">
                        <div className="selected-post">
                          <p className='sang-title wrap-text'><span className='cms-QA'>Q. </span><span dangerouslySetInnerHTML={{ __html: post.title }}></span></p>
                          <p className='sang-description wrap-text'><span className='cms-QA'>A.</span><span dangerouslySetInnerHTML={{ __html: post.content }}></span></p>
                          <div className='sang-bttcon'>
                            <button className='button primary' id='cms-correction' onClick={() => navigate(`/faqedit/${post.post_id}`)}>게시글 수정</button>
                            <button className='button' onClick={() => handleDelete(post.post_id, indexOfFirstPost + index)}>게시글 삭제</button>
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

export default Cmsfaq;

import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import '../css/Cms.css';

const Cms = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [posts, setPosts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage] = useState(3);
  const [selectedPostIndex, setSelectedPostIndex] = useState(null);
  const Navigate = useNavigate();

  const paginate = pageNumber => setCurrentPage(pageNumber);

  const handleClick = (index) => {
    setSelectedPostIndex(index);
  };

 

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
    .catch(error => console.error('게시글을 삭제하는 중 에러 발생:', error));
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const formattedDate = date.toISOString().split('T')[0];
    return formattedDate;
  };

  const location = useLocation();



  useEffect(() => {
    fetch('/api/checkRole', {
      method: 'GET',
      credentials: 'include'
    })
    .then(response => response.json())
    .then(data => {
      if (data.role !== 'admin') {
        setIsAdmin(false);
        Navigate.push('/main'); 
      } else {
        setIsAdmin(true);
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
      }
    })
    .catch(error => console.error('권한 확인 실패:', error));
  }, [Navigate]);

  if (!isAdmin) {
    return (
      <div>
        <h1>권한이 없습니다.</h1>
      </div>
    );
  }

  return (
    <div className="cms-container">
      <div className="cms-sidebar">
        {/* <img src="/images/logo192.png" alt="Your Logo" /> */}
        <h2 className='Cms-Aginginplace'>Aging in Place</h2>
        <h2>관리자</h2>
        <ul>
          <li className="cms-item"><Link to="/Cmscontents">프로그램 컨텐츠</Link></li>
          <li className={`cms-item2 ${location.pathname === "/Cms" ? "cms-active" : ""}`}><Link to="/Cms">게시판 관리</Link></li>
          <li className="cms-item"><Link to="/Cmsuser">사용자 관리</Link></li>
        </ul>
      </div>
      <div className="cms-main-content">
      <header className='major' id='major-rest'> 
          <h2 className='aaaaaa'>공지사항</h2>
        </header>
        <div className="Cmss-header">
          <div className='Cmss-chch'>
            <Link to="/Cms"><button className='button' id='cms-nodicego'>공지사항 게시판</button></Link>
            <Link to="/Cmsfaq"><button className='button'>FAQ 게시판</button></Link>
          </div>

          <div className="Cmss-options">
            <select className="Cmss-select">
              <option value="title">제목</option>
              <option value="author">작성자</option>
            </select>
            <input type="text" placeholder="검색어를 입력하세요" className="Cmss-search" />
            <button className="button primary">검색</button>
          </div>
          <Link to="/noticeup">
            <button className="button1" id='saddasdasd'>공지사항 등록</button>
          </Link>
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
                          <p className='sang-title wrap-text'><span className='cms-QA'>제목 </span> : {post.title}</p>
                          <p className='sang-description wrap-text'><span className='cms-QA'>내용 </span> : {post.content}</p>
                          <div className='sang-bttcon'>
                            <button className='button primary' id='cms-correction'>게시글 수정</button>
                            <button className='button' onClick={() => handleDelete(post.board_id, index)}>게시글 삭제</button>
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

export default Cms;

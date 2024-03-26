import React, { useState ,useEffect} from 'react';
import { Link, Route, Routes ,useLocation} from 'react-router-dom';
import '../css/Cms.css';

const Cmsfaq = () => {
  const [posts, setPosts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage] = useState(5); 
  const [selectedPostIndex, setSelectedPostIndex] = useState(null);

  const handleClick = (index) => {
    setSelectedPostIndex(index);
  };
  useEffect(() => {
    fetch('/api/faq')
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

  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost);


  const paginate = pageNumber => setCurrentPage(pageNumber);


  const location = useLocation(); 
  return (
    <>
      <div className="sidebar">
        <img src="/images/logo192.png" alt="Your Logo" />
        <h2>관리자 페이지</h2>
        <ul>
          <li className="cms-item"><Link to="/Cmscontents">프로그램 컨텐츠</Link></li>
          <li className={`cms-item ${location.pathname === "/Cms" ? "cms-active" : ""}`}><Link to="/Cms">게시판 관리</Link></li>
          <li className="cms-item"><Link to="/Cmsuser">사용자 관리</Link></li>
        </ul>
      </div>
      <div className="cms-container">

      <div className="Cmss-header">
        <div className='Cmss-chch'>
          <Link to="/Cms"><button className='chchbtt'>공지사항 게시판</button></Link>
          <Link to="/Cmsfaq"><button className='chchbtt1'>FAQ 게시판</button></Link>
        </div>

        <div className="Cmss-options">
          
          <select className="Cmss-select">
            <option value="title">제목</option>
            <option value="author">작성자</option>
          </select>
          <input type="text" placeholder="검색어를 입력하세요" className="Cmss-search" />
          <button className="Cmss-button">검색</button>
        </div>
        <Link to="/faqup">
             <button className="cms-FAQ">FAQ 등록</button>
        </Link>


      </div>
      
      <div className="Cmss-content">
        <table>
          <thead>
            <tr>
              <th>No</th>
              <th>Q</th>
              <th>A</th>
            </tr>
          </thead>
          <tbody >
          {posts.map((post, index) => (
                <React.Fragment key={post.id}>
                  <tr onClick={() => handleClick(index)}>
                    <td>{post.number}</td>
                    <td>{post.title}</td>
                    <td>{post.content}</td>
                  </tr>
                  {selectedPostIndex === index && (
                    <tr className='sang-trtag'>
                      <td colSpan="5">
                        <div className="selected-post">
                          <p className='sang-title'>{post.title}</p>
                          <p className='sang-description'>{post.content}</p>
                          <div className='sang-bttcon'>
                            <button className='sang-btt'>게시글 수정</button>
                            <button className='sang-btt' onClick={() => handleDelete(post.board_id, index)}>게시글 삭제</button>
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
    </>
    
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

export default Cmsfaq;
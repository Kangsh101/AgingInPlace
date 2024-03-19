import React, { useState } from 'react';
import { Link, Route, Routes ,useLocation} from 'react-router-dom';
import '../css/Cms.css';
import Useradd from './Useradd';

const Cmss = () => {
  const [posts, setPosts] = useState([
    { id: 1, Q: '질문1',A: '답변1'},
    { id: 2, Q: '질문2',A: '답변2'},
    { id: 3, Q: '질문3',A: '답변3'},
    { id: 4, Q: '질문4',A: '답변4'},
    { id: 5, Q: '질문5',A: '답변5'},
    { id: 6, Q: '질문6',A: '답변6'},
    { id: 7, Q: '질문7',A: '답변7'},
    { id: 8, Q: '질문8',A: '답변8'},


  ]);
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage] = useState(5); 


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
          <li className={`cms-item ${location.pathname === "/Cmss" ? "cms-active" : ""}`}><Link to="/Cmss">게시판 관리</Link></li>
          <li className="cms-item"><Link to="/Cmsuser">사용자 관리</Link></li>
        </ul>
      </div>
      <div className="cms-container">

      <div className="Cmss-header">
        <div className='Cmss-chch'>
          <Link to="/Cmss"><button className='chchbtt'>공지사항 게시판</button></Link>
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
            {currentPosts.map(post => (
              <tr key={post.id}>
                <td>{post.id}</td>
                <td>{post.Q}</td>
                <td>{post.A}</td>

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

export default Cmss;
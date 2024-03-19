import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom'; 
import '../css/Page2.css';
import '../css/qnacontent.css';

const QnAContent = () => {
  const { id } = useParams(); 

  const [post, setPost] = useState(null);
  const [newComment, setNewComment] = useState({
    user_name: "", 
    content: "", 
    created_at: "" 
  });
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loggedInUserName, setLoggedInUserName] = useState(null); 

  const getUserName = () => {
    fetch(`/api/getUserName/${localStorage.getItem('userId')}`)
      .then(res => res.json())
      .then(data => {
        setNewComment(prevComment => ({
          ...prevComment,
          user_name: data.name
        }));
      })
      .catch(err => console.error('사용자 이름 가져오기 실패:', err));
  };

  useEffect(() => {
    fetch(`/api/qnaposts/${id}`)
      .then(res => res.json())
      .then(data => {
        setPost(data); 
      })
      .catch(err => console.error('게시글 가져오기 실패:', err));
    
    getUserName();
    fetch('/api/checklogin')
      .then(res => res.json())
      .then(data => {
        setIsLoggedIn(data.isLoggedIn);
        if (data.isLoggedIn) {
          fetch('/api/getUserName')
            .then(res => res.json())
            .then(userData => {
              setLoggedInUserName(userData.userName);
            })
            .catch(err => console.error('사용자 이름 가져오기 실패:', err));
        }
      })
      .catch(err => console.error('로그인 상태 확인 실패:', err));
  }, [id]); 

  const handleCommentSubmit = () => {
    if (!isLoggedIn) {
      alert('로그인이 필요합니다.'); 
      return;
    }

    const newCommentData = {
      user_name: newComment.user_name, 
      content: newComment.content, 
      created_at: new Date().toLocaleString() 
    };

    setPost(prevPost => ({
      ...prevPost,
      comments: [...(prevPost.comments || []), newCommentData],
    }));

    setNewComment({
      user_name: "",
      content: "",
      created_at: ""
    });
  };

  const handleGoBackToList = () => {
    window.location.href = '/qnapage';
  };

  const handleDeletePost = () => {
    fetch(`/api/qnaposts/${id}`, {
      method: 'DELETE',
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          alert('게시글이 삭제되었습니다.');
          window.location.href = '/qnapage';
        } else {
          alert('게시글 삭제에 실패했습니다.');
        }
      })
      .catch(err => console.error('게시글 삭제 실패:', err));
  };

  return (
    <div>
      <div className="qna-page">
        <nav className="qna-navigation">
          <span className="qna-nav-ALL">전체</span>
          <Link to="/qnapage" className="qna-nav-item-Q">QnA게시판</Link>
          <Link to="/notice" className="qna-nav-item">공지사항</Link>
          <Link to="/faqpage" className="qna-nav-item">자주묻는질문</Link>
        </nav>
      </div>

      <div className="qna-header">
        <div className="qna-options">
          <h2 className='QnA-main'>QnA 상세 내용</h2>

          <div className='qnacontent-container'>
            {post && ( 
              <>
                <div className='QnA-title'>
                  <p>제목: {post.title}</p>
                </div>
                <hr className="qna-title-line" />
                <div className='QnA-author'>
                  <span className='QnA-authortext'>작성자: {post.name}</span>
                </div>
                <div className='QnA-date'>
                  <p className='QnA-commentDate'>등록일: {post.create_at}</p>
                </div>
                <hr className="qna-title-line" />
                <div className='QnA-content'>
                  <p>내용: {post.content}</p>
                </div>
                <hr className="qna-title-line" />
                <div className='QnA-comments'>
                  <span>댓글</span>
                </div>
                <hr className="qna-title-line" />
                  <div className='QnA-comments2'>
                    <p>댓글 단 유저 </p>
                    <span>댓글 내용 </span>
                    <span>data</span>
                  </div>
                <hr className="qna-title-line" />
                <div className='QnA-commentInput'>
                  <input
                    className='QnA-Input'
                    type="text"
                    placeholder="댓글 입력"
                    value={newComment.content}
                    onChange={(e) =>
                      setNewComment({ ...newComment, content: e.target.value })
                    }
                  />
                  <button className='QnA-Btt3' onClick={handleCommentSubmit}>
                    댓글 등록
                  </button>
                </div>
              </>
            )}
          </div>
            <div className='QnA-contentBtt'>
                    {isLoggedIn && post && loggedInUserName === post.name && (
                    <>
                      <button className='QnA-Btt'>글 수정</button>
                      <button className='QnA-Btt' onClick={handleDeletePost}>글 삭제</button>
                    </>
                  )}            
              <button className='QnA-Btt1' onClick={handleGoBackToList}>목록</button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default QnAContent;

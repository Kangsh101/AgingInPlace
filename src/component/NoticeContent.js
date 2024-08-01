import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; 
import '../css/qnacontent.css';

const NoticeContent = () => {
  const { id } = useParams(); 
  const quillRef = useRef(null); 
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetch(`/api/notices/${id}`)
      .then(res => res.json())
      .then(data => {
        setPost(data); 
      })
      .catch(err => console.error('게시글 가져오기 실패:', err));
  }, [id]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const getTextFromHtml = (htmlString) => {
    const div = document.createElement("div");
    div.innerHTML = htmlString;
    return div.textContent || div.innerText || "";
  };

  const handleSaveEdit = () => {
    if (!post.title.trim()) {
      alert('제목을 입력해주세요.');
      return;
    }
    const plainContent = getTextFromHtml(post.content);
    if (!plainContent.trim()) {
      alert('내용을 입력해주세요.');
      return;
    }
    fetch(`/api/notices/${post.post_id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ title: post.title, content: post.content })
    })
    .then(response => {
      if (response.ok) {
        return response.text();
      } else {
        response.text().then(text => {
          console.error('게시글 업데이트 오류:', text);
        });
        throw new Error('Network response was not ok.');
      }
    })
    .then(data => {
      alert('수정이 완료되었습니다.');
      setIsEditing(false);
      window.location.reload();
    })
    .catch(error => {
      console.error('게시글 업데이트 오류:', error);
    });
  };

  const handleGoBackToList = () => {
    navigate('/notice');
  };

  const handleDeletePost = () => {
    fetch(`/api/notices/${id}`, {
      method: 'DELETE',
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          alert('게시글이 삭제되었습니다.');
          navigate('/notice');
        } else {
          alert('게시글 삭제에 실패했습니다.');
        }
      })
      .catch(err => console.error('게시글 삭제 실패:', err));
  };

  return (
    <div className="qnaup-page">
      <div className="qnaup-header">
        <div className='qnacontent-container'>
          {post && (
            <>
              <div className='QnAup-title'>
                {isEditing ? (
                  <div>
                    <span id='qnaupdate-title'> 제목 : </span>
                    <input type="text" value={post.title} onChange={e => setPost({...post, title: e.target.value})} id="edit-title-input" />
                  </div>
                ) : (
                  <div>
                    <span>제목 : </span>{post.title}
                  </div>
                )}
              </div>
              <div className='QnAup-author'>
                <span>작성자 : </span> {post.user_name}
                <span>등록일 : </span> {post.created_at}
              </div>
              <div className='QnAup-content'>
                {isEditing ? (
                  <ReactQuill
                    ref={quillRef}
                    theme="snow"
                    value={post.content}
                    onChange={content => setPost({...post, content})}
                  />
                ) : (
                  <div dangerouslySetInnerHTML={{ __html: post.content }} />
                )}
              </div>
              <div className='QnA-commentInput'>
                <button className='button primary' onClick={handleGoBackToList}>목록</button>

              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default NoticeContent;

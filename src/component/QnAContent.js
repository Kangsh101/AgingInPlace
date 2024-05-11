import React, { useState, useEffect ,useCallback,useRef} from 'react';
import { Link, useParams } from 'react-router-dom';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; 
import '../css/Page2.css';
import '../css/qnacontent.css';


const QnAContent = () => {
  const { id } = useParams(); 
  const quillRef = useRef(null); 
  const [post, setPost] = useState(null);
  const [newComment, setNewComment] = useState({
    user_name: "", 
    content: "", 
    created_at: "" 
  });
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loggedInUserName, setLoggedInUserName] = useState(null); 

  const [isEditing, setIsEditing] = useState(false);
  const handleEdit = () => {
    setIsEditing(true);
  };
  const createMarkup = (htmlContent) => {
    return { __html: htmlContent };
  };

  const imageHandler = useCallback(() => {
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('accept', 'image/*');
    input.click();
  
    input.onchange = async () => {
      const file = input.files[0];
      if (file) {
        const formData = new FormData();
        formData.append('image', file);
  
        try {
          const response = await fetch('/api/upload', {
            method: 'POST',
            body: formData,
          });
          const data = await response.json();
  
          if (response.ok) {
            const range = quillRef.current.getEditor().getSelection(true);
            quillRef.current.getEditor().insertEmbed(range.index, 'image', data.imageUrl);
          } else {
            throw new Error('서버에서 이미지를 처리할 수 없습니다.');
          }
        } catch (error) {
          console.error('이미지 업로드 중 오류 발생:', error);
        }
      }
    };
  }, []);
  

  const modules = React.useMemo(() => ({
    toolbar: {
      container: [
        [{ 'header': [1, 2, false] }],
        ['bold', 'italic', 'underline', 'strike', 'blockquote'],
        [{'list': 'ordered'}, {'list': 'bullet'}, {'indent': '-1'}, {'indent': '+1'}],
        ['link', 'image'],
        ['clean']
      ],
      handlers: {
        'image': imageHandler
      }
    },
  }), [imageHandler]);
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
    fetch(`/api/qnaposts/${post.board_id}`, {
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
      console.log(data); 
      alert('수정이 완료되었습니다.');
      setIsEditing(false);
      window.location.reload(); 
    })
    .catch(error => {
      console.error('게시글 업데이트 오류:', error);
    });
  }
  

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
    <div className="qnaup-page">
      <div className="qnaup-header">
          <div className='qnacontent-container'>
            {post && ( 
              <>
                <div className='QnAup-title'>  
                  {isEditing ? (
                    <div>
                      <span id='qnaupdate-title'> 제목 : </span>
                    <input type="text"  value={post.title} onChange={e => setPost({...post, title: e.target.value})} id="edit-title-input" />
                    </div>
                ) : (
                  <div>
                    <span>제목 : </span>{post.title}
                  </div>
                )}
                </div>
                <div className='QnAup-author'>
                  <span>작성자 : </span> {post.name}
                  <span>등록일 : </span> {post.create_at}
                </div>
                <div className='QnAup-content'>
                  {isEditing ? (
                  <ReactQuill
                    ref={quillRef}
                    modules={modules}
                    theme="snow"
                    value={post.content}
                    onChange={content => setPost({...post, content})}
                  />
                ) : (
                  <div  dangerouslySetInnerHTML={{ __html: post.content }} />
                )}
{/* id='QnAupone-content' */}
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
            <div className='QnAup-contentBtt'>
            <button className='button' onClick={handleGoBackToList}>목록</button>
                    {isLoggedIn && post && loggedInUserName === post.name && (
                    <>
                      {isEditing ? (
                        <button className='button primary' onClick={handleSaveEdit}>저장</button>
                      ) : (
                        <button className='button primary' onClick={handleEdit}>글 수정</button>
                      )}
                      <button className='button primary' onClick={handleDeletePost}>글 삭제</button>
                    </>
                  )}            

            </div>
        </div>
      </div>
  );
};

export default QnAContent;

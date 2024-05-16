import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useParams } from 'react-router-dom';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import '../css/Page2.css';
import '../css/qnacontent.css';

const QnAContent = () => {
  const { id } = useParams();
  const quillRef = useRef(null);
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loggedInUserName, setLoggedInUserName] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editingComment, setEditingComment] = useState(null);

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

  useEffect(() => {
    fetch(`/api/qnaposts/${id}`)
      .then(res => res.json())
      .then(data => {
        setPost(data);
      })
      .catch(err => console.error('게시글 가져오기 실패:', err));

    fetch(`/api/qna/comments/${id}`)
      .then(res => res.json())
      .then(data => {
        setComments(data);
      })
      .catch(err => console.error('댓글 가져오기 실패:', err));

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

  const formatDateTime = (dateTimeString) => {
    const options = {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    };
    return new Date(dateTimeString).toLocaleString('ko-KR', options).replace(/\. /g, '-').replace(/\./g, '');
  };

  const handleCommentSubmit = () => {
    if (!isLoggedIn) {
      alert('로그인이 필요합니다.');
      return;
    }

    const newCommentData = {
      postId: id,
      content: newComment,
    };

    fetch('/api/qna/comments', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newCommentData),
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setComments([...comments, { ...newCommentData, user_name: loggedInUserName, created_at: formatDateTime(new Date()), comment_id: data.commentId }]);
          setNewComment('');
        } else {
          alert('댓글 등록에 실패했습니다.');
        }
      })
      .catch(err => console.error('댓글 등록 실패:', err));
  };

  const handleEditComment = (index) => {
    setEditingComment(index);
  };

  const handleSaveCommentEdit = (index) => {
    const comment = comments[index];
    fetch(`/api/qna/comments/${comment.comment_id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ content: comment.content }),
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setEditingComment(null);
          setComments(comments.map((c, i) => i === index ? { ...c, content: comment.content } : c));
        } else {
          alert('댓글 수정에 실패했습니다.');
        }
      })
      .catch(err => console.error('댓글 수정 실패:', err));
  };

  const handleDeleteComment = (index) => {
    const comment = comments[index];
    fetch(`/api/qna/comments/${comment.comment_id}`, {
      method: 'DELETE',
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setComments(comments.filter((_, i) => i !== index));
        } else {
          alert('댓글 삭제에 실패했습니다.');
        }
      })
      .catch(err => console.error('댓글 삭제 실패:', err));
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
    fetch(`/api/qnaposts/${post.post_id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ title: post.title, content: post.content })
    })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        alert('수정이 완료되었습니다.');
        setPost({ ...post, title: post.title, content: post.content });
        setIsEditing(false);
      } else {
        console.error('게시글 업데이트 실패:', data);
      }
    })
    .catch(error => {
      console.error('게시글 업데이트 오류:', error);
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
                <span>등록일 : </span> {formatDateTime(post.created_at)}
              </div>
              <div id='qnacontent-content' className='QnAup-content'>
                {isEditing ? (
                  <ReactQuill
                    ref={quillRef}
                    modules={modules}
                    theme="snow"
                    value={post.content}
                    onChange={content => setPost({...post, content})}
                  />
                ) : (
                  <div dangerouslySetInnerHTML={{ __html: post.content }} />
                )}
              </div>
              <hr className="qna-title-line" />
              {!isEditing && (
                <div className="qna-comment-section">
                  {comments.map((comment, index) => (
                    <React.Fragment key={index}>
                      <div className="qna-comment">
                        {editingComment === index ? (
                          <div>
                            <input
                              type="text"
                              value={comment.content}
                              onChange={(e) => {
                                const newComments = [...comments];
                                newComments[index].content = e.target.value;
                                setComments(newComments);
                              }}
                            />
                            <div className="qna-comment-actions">
                              <button className='button primary' onClick={() => handleSaveCommentEdit(index)}>수정</button>
                              <button className='button' onClick={() => setEditingComment(null)}>취소</button>
                            </div>
                          </div>
                        ) : (
                          <>
                            <span className="qna-comment-user">{comment.user_name}</span>
                            <span className="qna-comment-content">{comment.content}</span>
                            <span className="qna-comment-date">{formatDateTime(comment.created_at)}</span>
                            {loggedInUserName === comment.user_name && (
                              <div className="qna-comment-actions">
                                <button className="button primary" onClick={() => handleEditComment(index)}>수정</button>
                                <button className="button" onClick={() => handleDeleteComment(index)}>삭제</button>
                              </div>
                            )}
                          </>
                        )}
                      </div>
                      <hr className="qna-comment-line" />
                    </React.Fragment>
                  ))}
                  <div id='QnA-CommentInputs' className='QnA-commentInput'>
                    <input
                      className='QnA-Input'
                      type="text"
                      placeholder="댓글을 입력하세요."
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                    />
                    <button id='QnA-CommentButton' className='button primary' onClick={handleCommentSubmit}>
                      댓글 등록
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
        <div className='QnAup-contentBtt'>
          <button className='button' onClick={handleGoBackToList}>목록</button>
          {isLoggedIn && post && loggedInUserName === post.user_name && (
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

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import '../css/qnacontent.css';

const AnswerDetail = () => {
  const { answerId } = useParams();
  const navigate = useNavigate();
  const quillRef = useRef(null);
  const [answer, setAnswer] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [loggedInUserName, setLoggedInUserName] = useState(null);

  useEffect(() => {
    fetch(`/api/qna/answers/${answerId}`)
      .then(res => res.json())
      .then(data => {
        setAnswer(data);
        setTitle(data.title);
        setContent(data.content);
      })
      .catch(err => console.error('답글 가져오기 실패:', err));

    fetch('/api/getUserName')
      .then(res => res.json())
      .then(userData => {
        setLoggedInUserName(userData.userName);
      })
      .catch(err => console.error('사용자 이름 가져오기 실패:', err));
  }, [answerId]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSaveEdit = () => {
    fetch(`/api/qna/answers/${answerId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ title, content }),
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          alert('답글 수정이 완료되었습니다.');
          setAnswer({ ...answer, title, content });
          setIsEditing(false);
        } else {
          alert('답글 수정에 실패했습니다.');
        }
      })
      .catch(err => console.error('답글 수정 실패:', err));
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setTitle(answer.title);
    setContent(answer.content);
  };

  const handleDelete = () => {
    fetch(`/api/qna/answers/${answerId}`, {
      method: 'DELETE',
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          alert('답글이 삭제되었습니다.');
          navigate(-1); 
        } else {
          alert('답글 삭제에 실패했습니다.');
        }
      })
      .catch(err => console.error('답글 삭제 실패:', err));
  };

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

  return (
    <div className="qnaup-page">
      <div className="qnaup-header">
        <div className='qnacontent-container'>
          {answer && (
            <>
              <div className='QnAup-title'>
                {isEditing ? (
                  <input
                    type="text"
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    placeholder="제목을 입력하세요"
                  />
                ) : (
                  <div>
                    <span>제목 : </span>{answer.title}
                  </div>
                )}
              </div>
              <div className='QnAup-author'>
                <span>작성자 : </span> {answer.user_name}
                <span>등록일 : </span> {formatDateTime(answer.created_at)}
              </div>
              <div id='qnacontent-content' className='QnAup-content'>
                {isEditing ? (
                  <ReactQuill
                    ref={quillRef}
                    value={content}
                    onChange={setContent}
                  />
                ) : (
                  <div dangerouslySetInnerHTML={{ __html: answer.content }} />
                )}
              </div>
              <hr className="qna-title-line" />
              <div className='QnAup-contentBtt'>
                <button className='button' onClick={() => navigate(-1)}>목록</button>
                {loggedInUserName === answer.user_name && (
                  <>
                    {isEditing ? (
                      <>
                        <button className='button primary' onClick={handleSaveEdit}>저장</button>
                        <button className='button' onClick={handleCancelEdit}>취소</button>
                      </>
                    ) : (
                      <>
                        <button className='button primary' onClick={handleEdit}>수정</button>
                        <button className='button primary' onClick={handleDelete}>삭제</button>
                      </>
                    )}
                  </>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AnswerDetail;
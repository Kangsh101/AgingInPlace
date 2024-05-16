import React, { useState, useEffect, useCallback, useRef } from 'react';
import '../css/Page3.css'; 
import '../css/Qnaup.css'; 
import { useParams,useNavigate } from 'react-router-dom';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const QnAanswersUp = () => {
  const { postId } = useParams();
  const navigate = useNavigate();
  const quillRef = useRef(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [userId, setUserId] = useState('');

  console.log("Debug: Posting answer for post ID:", postId);
  useEffect(() => {
    const storedUserId = sessionStorage.getItem('userId');
    if (storedUserId) {
      setUserId(storedUserId);
    }
  }, []);

  useEffect(() => {
    if (postId) {
      fetch(`/api/qnaposts/${postId}`)
        .then(res => res.json())
        .then(data => {
          setTitle(data.title); 
        })
        .catch(err => console.error('게시글 가져오기 실패:', err));
    }

    const storedUserId = sessionStorage.getItem('userId');
    if (storedUserId) {
      setUserId(storedUserId);
    }
  }, [postId]);

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
  
  
const handleAnswerSubmit = () => {
  if (!content.trim()) {
    alert('답글 내용을 입력해주세요.');
    return;
  }
  console.log("Submit: Posting answer for post ID:", postId);
  fetch('/api/qna/answers', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      title: title,
      postId: postId, 
      content: content
    })
  })
  .then(res => res.json())
  .then(data => {
    if (data.success) {
      alert('답글이 성공적으로 등록되었습니다.');
      navigate('/qnapage'); 
    } else {
      alert('답글 등록에 실패했습니다.');
    }
  })
  .catch(err => {
    console.error('답글 등록 중 서버 에러 발생:', err);
  });
};
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

  const handleTitleChange = (event) => {
    setTitle(event.target.value);
  };

  const handleContentChange = (content) => {
    setContent(content);
  };

  const handleCancel = () => {
    navigate(-1);
  };

  return (
    <div className="qna-page">
      <div id='QnA-Plus'className="qnaplus">
        <h2>QnA 게시글 작성</h2>
        <div className="form-group">
          <input
            type="text"
            value={title}
            onChange={handleTitleChange}
            placeholder="제목"
            className="title-input"
            id='QnA-titlecss'
          />
          <ReactQuill
           id='QnAup-content'
            ref={quillRef}
            value={content}
            onChange={handleContentChange}
            placeholder="내용을 입력하세요."
            modules={modules}
            
          />
        </div>
        <div className="button-group">
          <button id='QnAbtt' className='button' onClick={handleCancel}>취소</button>
          <button className='button primary' onClick={handleAnswerSubmit}>답글 등록</button>
        </div>
      </div>
    </div>
  );
};

export default QnAanswersUp;

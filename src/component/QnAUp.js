import React, { useState, useEffect, useCallback, useRef } from 'react';
import '../css/Qnaup.css'; 
import { useNavigate } from 'react-router-dom';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const QnAUp = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [userId, setUserId] = useState('');
  const navigate = useNavigate();
  const quillRef = useRef(null); 
  const [image, setImage] = useState(null);

  useEffect(() => {
    const storedUserId = sessionStorage.getItem('userId');
    if (storedUserId) {
      setUserId(storedUserId);
    }
  }, []);

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
          if (!response.ok) {
            throw new Error('서버에서 이미지를 처리할 수 없습니다.');
          }
  
          const data = await response.json();
          const range = quillRef.current.getEditor().getSelection(true);
          quillRef.current.getEditor().insertEmbed(range.index, 'image', data.imageUrl);
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

  const handleTitleChange = (event) => {
    setTitle(event.target.value);
  };

  const handleContentChange = (content) => {
    setContent(content);
  };

  const handleSave = async () => {
    if (!title.trim() || !content.trim()) {
      alert('제목과 내용을 모두 작성해주세요.');
      return;
    }
  
    const formData = new FormData();
    formData.append('title', title);
    formData.append('content', content);
    formData.append('userId', userId);
    if (image) {
      formData.append('image', image); 
    }
  
    try {
      const response = await fetch('/api/qna/posts', {
        method: 'POST',
        body: formData,
      });
  
      if (response.ok) {
        const data = await response.json();
        console.log('글이 성공적으로 저장되었습니다.');
        alert('글이 성공적으로 저장되었습니다.');
        navigate('/qnapage');
      } else {
        throw new Error('글을 저장하지 못했습니다.');
      }
    } catch (error) {
      console.error('글 저장 중 오류 발생:', error);
    }
  };
  
  const handleCancel = () => {
    navigate(-1);
  };

  return (
    <article id="main">
      <div className="qna-page">
        <div id='QnA-Plus' className="qnaplus">
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
            <button id='QnAbtt' className='button secondary' onClick={handleCancel}>취소</button>
            <button className='button primary' onClick={handleSave}>글 작성</button>
          </div>
        </div>
      </div>
   </article>
  );
};

export default QnAUp;

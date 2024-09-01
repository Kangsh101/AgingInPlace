import React, { useState, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import '../css/Qnaup.css'; 
import CmsNavipanel from './CmsNavipanel';

const FaqUp = ({userRole}) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const navigate = useNavigate();
  const quillRef = useRef(null);

  const handleTitleChange = (event) => {
    setTitle(event.target.value);
  };

  const handleContentChange = (content) => {
    setContent(content);
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
        [{ header: [1, 2, false] }],
        ['bold', 'italic', 'underline', 'strike', 'blockquote'],
        [{ list: 'ordered' }, { list: 'bullet' }, { indent: '-1' }, { indent: '+1' }],
        ['link', 'image'],
        ['clean']
      ],
      handlers: {
        image: imageHandler
      }
    },
  }), [imageHandler]);

  const handleSubmit = () => {
    fetch('/api/addFaq', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ title, content }),
    })
      .then(response => response.json())
      .then(data => {
        console.log(data);
        alert('게시글이 성공적으로 등록되었습니다.');
        navigate('/cmsfaq');
      })
      .catch(error => {
        console.error('글 등록 중 오류 발생:', error);
      });
  };

  const handleBack = () => {
    navigate('/cmsfaq');
  }

  return (
    <article id="main">
      <div className="qna-page">
      <CmsNavipanel userRole={userRole}  />
        <div id='QnA-Plus' className="qnaplus">
          <h2>FAQ 등록</h2>
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
            <button id='QnAbtt' className='button secondary' onClick={handleBack}>취소</button>
            <button className='button primary' onClick={handleSubmit}>글 등록</button>
          </div>
        </div>
      </div>
   </article>
  );
};

export default FaqUp;

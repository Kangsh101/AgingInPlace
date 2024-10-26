import React, { useState, useEffect, useCallback, useRef } from 'react';
import '../css/Qnaup.css';
import { useNavigate } from 'react-router-dom';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import Quill from 'quill';

const Size = Quill.import('attributors/style/size');
Size.whitelist = ['8px', '10px', '12px', '14px', '16px', '18px', '20px'];
Quill.register(Size, true);

const QnAUp = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const navigate = useNavigate();
  const quillRef = useRef(null); 

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
        [{ 'header': [1, 2, false] }],
        [{ 'font': [] }],
        [{ 'size': Size.whitelist }],
        ['bold', 'italic', 'underline', 'strike', 'blockquote'],
        [{'list': 'ordered'}, {'list': 'bullet'}, {'indent': '-1'}, {'indent': '+1'}],
        [{ 'align': [] }],
        ['link', 'image'],
        ['clean']
      ],
      handlers: {
        'image': imageHandler
      }
    },
  }), [imageHandler]);

  const formats = [
    'header', 'font', 'size', 'bold', 'italic', 'underline', 'strike', 'blockquote',
    'list', 'bullet', 'indent', 'align', 'link', 'image'
  ];

  const handleSave = async () => {
    if (!title.trim() || !content.trim()) {
      alert('제목과 내용을 모두 작성해주세요.');
      return;
    }

    try {
      const response = await fetch('/api/qna/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, content }),
      });

      if (response.ok) {
        alert('글이 성공적으로 저장되었습니다.');
        navigate('/qnapage');
      } else {
        throw new Error('글을 저장하지 못했습니다.');
      }
    } catch (error) {
      console.error('글 저장 중 오류 발생:', error);
    }
  };

  const handleCancel = () => navigate(-1);

  return (
    <article id="main">
      <div className="qna-page">
        <div id='QnA-Plus' className="qnaplus">
          <h2>QnA 게시글 작성</h2>
          <div className="form-group">
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
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
              formats={formats}
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

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/Cms.css';
import CmsSidebar from './CmsSidebar';
import CmsNavipanel from './CmsNavipanel';
import '../admin_css/AddQuestionCIST.css';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const AddQuestionCIST = ({ userRole }) => {
  const [type, setType] = useState('');
  const [title, setTitle] = useState('');
  const [questionText, setQuestionText] = useState('');
  const [correctAnswer, setCorrectAnswer] = useState('');
  const navigate = useNavigate();
  const quillRef = useRef(null);

  useEffect(() => {
    if (userRole !== 'admin' && userRole !== 'doctor') {
      navigate('/notfound');
    }
  }, [userRole, navigate]);

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
            throw new Error('이미지 업로드 실패');
          }

          const { imageUrl } = await response.json();
          console.log(imageUrl);
          const editor = quillRef.current.getEditor();
          const range = editor.getSelection(true);
          editor.insertEmbed(range.index, 'image', imageUrl);
          editor.setSelection(range.index + 1);
        } catch (error) {
          console.error('이미지 업로드 중 오류 발생:', error);
        }
      }
    };
  }, []);

  const modules = {
    toolbar: {
      container: [
        [{ 'header': [1, 2, false] }],
        ['bold', 'italic', 'underline', 'strike', 'blockquote'],
        [{ 'list': 'ordered' }, { 'list': 'bullet' }],
        ['link', 'image'],
        ['clean'],
      ],
      handlers: {
        image: imageHandler,
      },
    },
  };

  const formats = [
    'header', 'bold', 'italic', 'underline', 'strike', 'blockquote',
    'list', 'bullet', 'link', 'image',
  ];

  const handleAddQuestion = async () => {
    if (!type || !title || !questionText || !correctAnswer) {
      alert('모든 필드를 입력해주세요.');
      return;
    }

    try {
      const response = await fetch('/api/cist_questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type,
          title,
          question_text: questionText,
          correct_answer: correctAnswer,
        }),
      });

      if (response.ok) {
        navigate('/cmscist');
      } else {
        throw new Error('질문 저장 실패');
      }
    } catch (error) {
      console.error('질문 저장 중 오류 발생:', error);
    }
  };

  return (
    <div className="cms-container">
      <CmsSidebar userRole={userRole} />
      <CmsNavipanel userRole={userRole} />
      <div className="cms-main-content">
        <header className="major" id="major-rest">
          <h2>문제 추가</h2>
        </header>
        <div className="Cms-form centered-form">
          <div className="Cms-form-group">
            <label>문제 유형:</label>
            <select value={type} onChange={(e) => setType(e.target.value)}>
              <option value="">유형 선택</option>
              <option value="지남력">지남력</option>
              <option value="기억력">기억력</option>
              <option value="주의력">주의력</option>
              <option value="시공간 기능">시공간 기능</option>
              <option value="집행 기능">집행 기능</option>
              <option value="언어 기능">언어 기능</option>
            </select>
          </div>

          <div className="Cms-form-group">
            <label>제목:</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="Cms-form-group">
            <label>문제 내용:</label>
            <ReactQuill
              id='QnAup-content'
              ref={quillRef}
              value={questionText}
              onChange={setQuestionText}
              modules={modules}
              formats={formats}
              placeholder="내용을 입력하세요."
            />
          </div>

          <div className="Cms-form-group">
            <label>정답:</label>
            <input
              type="text"
              value={correctAnswer}
              onChange={(e) => setCorrectAnswer(e.target.value)}
            />
          </div>

          <div className="Cms-form-buttons">
            <button className="button" onClick={() => navigate('/cmscist')}>
              취소
            </button>
            <button className="button primary" onClick={handleAddQuestion}>
              등록
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddQuestionCIST;

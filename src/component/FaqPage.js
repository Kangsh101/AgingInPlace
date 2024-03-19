import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../css/Faq.css';
import '../css/Page5.css';

const FaqPage = () => {

  const [answersVisible, setAnswersVisible] = useState([]);

  const toggleAnswer = (index) => {
    const newAnswersVisible = [...answersVisible];
    newAnswersVisible[index] = !newAnswersVisible[index];
    setAnswersVisible(newAnswersVisible);
  };

  const faqItems = [
    { question: 'Q 질문 : 치매 예방 알림 확인은 어디서 할 수 있나요?', answer: 'A 답변 : 워치 앱을 켜서 확인하시면 됩니다. 워치 앱을 켜서 확인하시면 됩니다2.워치 앱을 켜서 확인하시면 됩니다3' },
    { question: 'Q 질문 : 치매 예방 알림 확인은 어디서 할 수 있나요?', answer: 'A 답변 : 워치 앱을 켜서 확인하시면 됩니다. 워치 앱을 켜서 확인하시면 됩니다2.워치 앱을 켜서 확인하시면 됩니다3' },
    { question: 'Q 질문 : 치매 예방 알림 확인은 어디서 할 수 있나요?', answer: 'A 답변 : 워치 앱을 켜서 확인하시면 됩니다. 워치 앱을 켜서 확인하시면 됩니다2.워치 앱을 켜서 확인하시면 됩니다3' },
    { question: 'Q 질문 : 치매 예방 알림 확인은 어디서 할 수 있나요?', answer: 'A 답변 : 워치 앱을 켜서 확인하시면 됩니다. 워치 앱을 켜서 확인하시면 됩니다2.워치 앱을 켜서 확인하시면 됩니다3' },
    { question: 'Q 질문 2', answer: "A 답변 2 답변 2 답변 2 답변 2 답변 2 답변 2 답변 2 답변 2 답변 2 답변 2답변 2답변 2답변 2답변 2답변 2답변 2답변 2답변 2답변 2답변 2답변 2답변 2답변 2답변 2답변 2답변 2답변 2답변 2답변 2답변 2답변 2답변 2답변 2답변 2답변 2답변 2답변 2답변 2답변 2답변 2답변 2답변 2답변 2답변 2답변 2" },
   
  ];

  return (
    <div>
      <div className="qna-page">
        <nav className="qna-navigation">
          <sapn className="qna-nav-ALL">전체</sapn>
          <Link to="/qnapage" className="qna-nav-item">QnA게시판</Link>
          <Link to="/notice" className="qna-nav-item">공지사항</Link>
          <Link to="/faqpage" className="qna-nav-item-Q">자주묻는질문</Link>
        </nav>
      </div>
      <div className='page5555'>
        <div className="qna-header">
          <div className="qna-options">
            <h2 className='aaaaaa'>FAQ</h2>
            <select className="qna-select">
              <option value="title">제목</option>
              <option value="author">작성자</option>
            </select>
            <input type="text" placeholder="검색어를 입력하세요" className="qna-search" />
            <button className="qna-button">검색</button>
          </div>
        </div>
      </div>

      <div className="faq-content">
        {faqItems.map((item, index) => (
          <div key={index} className="faq-item">
            <div className="faq-question" onClick={() => toggleAnswer(index)}>
              {item.question}
            </div>
            <div className="faq-answer" onClick={() => toggleAnswer(index)}>
              {answersVisible[index] ? item.answer : item.answer.substring(0, 40)}
            </div>
          </div>
        ))}
      </div>
      <div className='bottom'></div>
    </div>
  );
};

export default FaqPage;

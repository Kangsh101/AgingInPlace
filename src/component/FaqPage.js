import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../css/Faq.css';

const FaqPage = () => {
  const [faqItems, setFaqItems] = useState([]);

  useEffect(() => {
    fetch('/api/faq') 
      .then(response => response.json())
      .then(data => setFaqItems(data))
      .catch(error => console.error('FAQ 데이터 가져오는 중 오류 발생:', error));
  }, []);

  const [answersVisible, setAnswersVisible] = useState([]);

  const toggleAnswer = index => {
    const newAnswersVisible = [...answersVisible];
    newAnswersVisible[index] = !newAnswersVisible[index];
    setAnswersVisible(newAnswersVisible);
  };

  return (
    <article id="main">
       <div className="qna-container">
          <div className="row gtr-150">
            <div className="col-4 col-12-medium">
              <header className='major'> 
                <h2 className='aaaaaa'>FAQ</h2>
              </header>
            <div className="qna-header">
              </div>
            <div className="faq-content">
              {faqItems.map((item, index) => (
                <div key={index} className="faq-item">
                  <div className="faq-question" onClick={() => toggleAnswer(index)}>
                    Q : {item.title}
                  </div>
                  <div className={`faq-answer ${answersVisible[index] ? 'visible' : ''}`}>
                    A : {item.content}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </article>
  );
};

export default FaqPage;

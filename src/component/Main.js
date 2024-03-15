import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../css/Main.css';
import Footer from './Footer';

const Main = () => {
  const [selectedSection, setSelectedSection] = useState('whatIsDementia');

  const handleSectionClick = (section) => {
    setSelectedSection(section);
  };

  return (
    <div className='mainmain'>
      <img src="/images/asddddd.jpg" alt='img' style={{ width: '100%', height: '100%', marginTop:'3.8%'}}/>
      <div className="main-container">
        <h1 className='testsiz'>소개</h1>
        <div className='mainbtt'>
          <div className="main-bttcontainer">
            <button
              onClick={() => handleSectionClick('whatIsDementia')}
              className={selectedSection === 'whatIsDementia' ? 'active' : ''}
            >
              석현이란?
            </button>
            <button
              onClick={() => handleSectionClick('causes')}
              className={selectedSection === 'causes' ? 'active' : ''}
            >
              원인
            </button>
            <button
              onClick={() => handleSectionClick('treatments')}
              className={selectedSection === 'treatments' ? 'active' : ''}
            >
              치료방법
            </button>
            <button
              onClick={() => handleSectionClick('prevention')}
              className={selectedSection === 'prevention' ? 'active' : ''}
            >
              치매 예방법
            </button>
          </div>
        </div>

        {selectedSection && (
          <div className="section-description">
            {selectedSection === 'whatIsDementia' && (
              <div className='sul2'>
                
                <p className='sul1'>
                <h1 className='testsiz'>치매란?</h1>
                  <span className='sul11'>65세 이상 노인의 약 5~8%가 치매로 추정되고 있으며,</span> <span className='sul111'>연령이 증가할 수록 급격히 증가해
                  65세에서 74세는 3% 내외이나, 85세 이상은 45%가 치매로 추정됩니다. 알츠하이머병이 가
                  장 많아서 47~61%, 혈관성 치매가 13~31%, 그 외 루이체 치매가 세 번째로 많을 것으로 보
                  고되고 있습니다.65세에서 74세는 3% 내외이나, 85세 이상은 45%가 치매로 추정됩니다. 알츠하이머병이 가
                  장 많아서 47~61%, 혈관성 치매가 13~31%, 그 외 루이체 치매가 세 번째로 많을 것으로 보
                  고되고 있습니다.65세에서 74세는 3% 내외이나, 85세 이상은 45%가 치매로 추정됩니다. 알츠하이머병이 가
                  장 많아서 47~61%, 혈관성 치매가 13~31%, 그 외 루이체 치매가 세 번째로 많을 것으로 보</span>
                  <p className='sul11'>ㅇㅁㄴㅇㅇㅁㄴㅇ</p>
                  <span className='sul111'>
                  고되고 있습니다.65세에서 74세는 3% 내외이나, 85세 이상은 45%가 치매로 추정됩니다. 알츠하이머병이 가
                  장 많아서 47~61%, 혈관성 치매가 13~31%, 그 외 루이체 치매가 세 번째로 많을 것으로 보
                  고되고 있습니다.65세에서 74세는 3% 내외이나, 85세 이상은 45%가 치매로 추정됩니다. 알츠하이머병이 가
                  장 많아서 47~61%, 혈관성 치매가 13~31%, 그 외 루이체 치매가 세 번째로 많을 것으로 보
                  고되고 있습니다.65세에서 74세는 3% 내외이나, 85세 이상은 45%가 치매로 추정됩니다. 알츠하이머병이 가
                  장 많아서 47~61%, 혈관성 치매가 13~31%, 그 외 루이체 치매가 세 번째로 많을 것으로 보
                  고되고 있습니다.</span>
                </p>
              </div>
            )}
            {selectedSection === 'causes' && (
              <div className='sul2'>
                
                <p className='sul1'>
                <h1 className='testsiz'>치매의 원인</h1>
                  <span className='sul11'>65세 이상 노인의 약 5~8%가 치매로 추정되고 있으며,</span> 
                  <span className='sul111'>연령이 증가할 수록 급격히 증가해
                  65세에서 74세는 3% 내외이나, 85세 이상은 45%가 치매로 추정됩니다. 알츠하이머병이 가
                  장 많아서 47~61%, 혈관성 치매가 13~31%, 그 외 루이체 치매가 세 번째로 많을 것으로 보
                  고되고 있습니다.65세에서 74세는 3% 내외이나, 85세 이상은 45%가 치매로 추정됩니다. 알츠하이머병이 가
                  장 많아서 47~61%, 혈관성 치매가 13~31%, 그 외 루이체 치매가 세 번째로 많을 것으로 보
                  고되고 있습니다.65세에서 74세는 3% 내외이나, 85세 이상은 45%가 치매로 추정됩니다. 알츠하이머병이 가
                  장 많아서 47~61%, 혈관성 치매가 13~31%, 그 외 루이체 치매가 세 번째로 많을 것으로 보</span>
                  <p className='sul11'>ㅇㅁㄴㅇㅇㅁㄴㅇ</p>
                  <span className='sul111'>
                  고되고 있습니다.65세에서 74세는 3% 내외이나, 85세 이상은 45%가 치매로 추정됩니다. 알츠하이머병이 가
                  장 많아서 47~61%, 혈관성 치매가 13~31%, 그 외 루이체 치매가 세 번째로 많을 것으로 보
                  고되고 있습니다.65세에서 74세는 3% 내외이나, 85세 이상은 45%가 치매로 추정됩니다. 알츠하이머병이 가
                  장 많아서 47~61%, 혈관성 치매가 13~31%, 그 외 루이체 치매가 세 번째로 많을 것으로 보
                  고되고 있습니다.65세에서 74세는 3% 내외이나, 85세 이상은 45%가 치매로 추정됩니다. 알츠하이머병이 가
                  장 많아서 47~61%, 혈관성 치매가 13~31%, 그 외 루이체 치매가 세 번째로 많을 것으로 보
                  고되고 있습니다.</span>
                </p>
              </div>
            )}
            {selectedSection === 'treatments' && (
              <div className='sul2'>
                <p className='sul1'>
                <h1 className='testsiz'>치료방법</h1>
                  <span className='sul11'>65세 이상 노인의 약 5~8%가 치매로 추정되고 있으며,</span> 
                  <span className='sul111'>연령이 증가할 수록 급격히 증가해
                  65세에서 74세는 3% 내외이나, 85세 이상은 45%가 치매로 추정됩니다. 알츠하이머병이 가
                  장 많아서 47~61%, 혈관성 치매가 13~31%, 그 외 루이체 치매가 세 번째로 많을 것으로 보
                  고되고 있습니다.65세에서 74세는 3% 내외이나, 85세 이상은 45%가 치매로 추정됩니다. 알츠하이머병이 가
                  장 많아서 47~61%, 혈관성 치매가 13~31%, 그 외 루이체 치매가 세 번째로 많을 것으로 보
                  고되고 있습니다.65세에서 74세는 3% 내외이나, 85세 이상은 45%가 치매로 추정됩니다. 알츠하이머병이 가
                  장 많아서 47~61%, 혈관성 치매가 13~31%, 그 외 루이체 치매가 세 번째로 많을 것으로 보</span>
                  <p className='sul11'>ㅇㅁㄴㅇㅇㅁㄴㅇ</p>
                  <span className='sul111'>고되고 있습니다.65세에서 74세는 3% 내외이나, 85세 이상은 45%가 치매로 추정됩니다. 알츠하이머병이 가
                  장 많아서 47~61%, 혈관성 치매가 13~31%, 그 외 루이체 치매가 세 번째로 많을 것으로 보
                  고되고 있습니다.65세에서 74세는 3% 내외이나, 85세 이상은 45%가 치매로 추정됩니다. 알츠하이머병이 가
                  장 많아서 47~61%, 혈관성 치매가 13~31%, 그 외 루이체 치매가 세 번째로 많을 것으로 보
                  고되고 있습니다.65세에서 74세는 3% 내외이나, 85세 이상은 45%가 치매로 추정됩니다. 알츠하이머병이 가
                  장 많아서 47~61%, 혈관성 치매가 13~31%, 그 외 루이체 치매가 세 번째로 많을 것으로 보
                  고되고 있습니다.</span>
                </p>
              </div>
            )}
            {selectedSection === 'prevention' && (
              <div className='sul2'>
                <p className='sul1'>
                <h1 className='testsiz'>치매 예방법</h1>
                  <span className='sul11'>65세 이상 노인의 약 5~8%가 치매로 추정되고 있으며,</span> 
                  <span className='sul111'>연령이 증가할 수록 급격히 증가해
                  65세에서 74세는 3% 내외이나, 85세 이상은 45%가 치매로 추정됩니다. 알츠하이머병이 가
                  장 많아서 47~61%, 혈관성 치매가 13~31%, 그 외 루이체 치매가 세 번째로 많을 것으로 보
                  고되고 있습니다.65세에서 74세는 3% 내외이나, 85세 이상은 45%가 치매로 추정됩니다. 알츠하이머병이 가
                  장 많아서 47~61%, 혈관성 치매가 13~31%, 그 외 루이체 치매가 세 번째로 많을 것으로 보
                  고되고 있습니다.65세에서 74세는 3% 내외이나, 85세 이상은 45%가 치매로 추정됩니다. 알츠하이머병이 가
                  장 많아서 47~61%, 혈관성 치매가 13~31%, 그 외 루이체 치매가 세 번째로 많을 것으로 보</span>
                  <p className='sul11'>ㅇㅁㄴㅇㅇㅁㄴㅇ</p>
                  <span className='sul111'>고되고 있습니다.65세에서 74세는 3% 내외이나, 85세 이상은 45%가 치매로 추정됩니다. 알츠하이머병이 가
                  장 많아서 47~61%, 혈관성 치매가 13~31%, 그 외 루이체 치매가 세 번째로 많을 것으로 보
                  고되고 있습니다.65세에서 74세는 3% 내외이나, 85세 이상은 45%가 치매로 추정됩니다. 알츠하이머병이 가
                  장 많아서 47~61%, 혈관성 치매가 13~31%, 그 외 루이체 치매가 세 번째로 많을 것으로 보
                  고되고 있습니다.65세에서 74세는 3% 내외이나, 85세 이상은 45%가 치매로 추정됩니다. 알츠하이머병이 가
                  장 많아서 47~61%, 혈관성 치매가 13~31%, 그 외 루이체 치매가 세 번째로 많을 것으로 보
                  고되고 있습니다.</span>
                </p>
              </div>
            )}
             <img src="/images/ddddd.jpg" alt='img' style={{ width: '59%', height: '100%', marginBottom : '2%'}}/>
          </div>
        )}
       <Footer />
      </div>
    </div>

  );
};

export default Main;
import React, { useState, useEffect, useRef } from 'react';
import '../css/NewMain.css';
const Main = () => {
  const [selectedSection, setSelectedSection] = useState('whatIsDementia');

  const handleSectionClick = (section) => {
    setSelectedSection(section);
  };
  return (
    
    <div className="is-preload landing" id="page-wrapper">
      <section id="banner">
        <div className="content">
          <header>
            <h2> 치매 </h2>
            <p>안녕하세요<br />치매 페이지에 오신것을 환영합니다.</p>
            {/* <img src="/images/clclao.jpg" alt="Your Logo" className='hadervar-logo'/> */}
          </header>
          {/* <img src="/images/clclao.jpg" alt="Your Logo" className='hadervar-logo'/> */}
          {/* <span className="image"><img src={require('./images/pic01.jpg').default} alt="" /></span> */}
        </div>
        <a href="#one" className="goto-next scrolly">Next</a>
      </section>

      {/* One */}
      {/* <section id="one" className="spotlight style1 bottom">
        <img src="/images/pic02.jpg" alt="Your Logo" className='hadervar-logo'/>
        <span className="image fit main"><img src={require('/images/pic02.jpg').default} alt="" /></span>
        <div className="content">
          <div className="container">
            <div className="row">
              <div className="col-4 col-12-medium">
                <header>
                  <h2>Odio faucibus ipsum integer consequat</h2>
                  <p>Nascetur eu nibh vestibulum amet gravida nascetur praesent</p>
                </header>
              </div>
              <div className="col-4 col-12-medium">
                <p>Feugiat accumsan lorem eu ac lorem amet sed accumsan donec.
                  Blandit orci porttitor semper. Arcu phasellus tortor enim mi
                  nisi praesent dolor adipiscing. Integer mi sed nascetur cep aliquet
                  augue varius tempus lobortis porttitor accumsan consequat
                  adipiscing lorem dolor.</p>
              </div>
              <div className="col-4 col-12-medium">
                <p>Morbi enim nascetur et placerat lorem sed iaculis neque ante
                  adipiscing adipiscing metus massa. Blandit orci porttitor semper.
                  Arcu phasellus tortor enim mi mi nisi praesent adipiscing. Integer
                  mi sed nascetur cep aliquet augue varius tempus. Feugiat lorem
                  ipsum dolor nullam.</p>
              </div>
            </div>
          </div>
        </div>
        <a href="#two" className="goto-next scrolly">Next</a>
      </section> */}

      {/* Two */}
      {/* <section id="two" className="spotlight style2 right">
        <span className="image fit main"><img src={require('./images/pic03.jpg').default} alt="" /></span>
        <div className="content">
          <header>
            <h2>Interdum amet non magna accumsan</h2>
            <p>Nunc commodo accumsan eget id nisi eu col volutpat magna</p>
          </header>
          <p>Feugiat accumsan lorem eu ac lorem amet ac arcu phasellus tortor enim mi mi nisi praesent adipiscing. Integer mi sed nascetur cep aliquet augue varius tempus lobortis porttitor lorem et accumsan consequat adipiscing lorem.</p>
          <ul className="actions">
            <li><a href="#" className="button">Learn More</a></li>
          </ul>
        </div>
        <a href="#three" className="goto-next scrolly">Next</a>
      </section> */}

      {/* Three */}
      {/* <section id="three" className="spotlight style3 left">
        <span className="image fit main bottom"><img src={require('./images/pic04.jpg').default} alt="" /></span>
        <div className="content">
          <header>
            <h2>Interdum felis blandit praesent sed augue</h2>
            <p>Accumsan integer ultricies aliquam vel massa sapien phasellus</p>
          </header>
          <p>Feugiat accumsan lorem eu ac lorem amet ac arcu phasellus tortor enim mi mi nisi praesent adipiscing. Integer mi sed nascetur cep aliquet augue varius tempus lobortis porttitor lorem et accumsan consequat adipiscing lorem.</p>
          <ul className="actions">
            <li><a href="#" className="button">Learn More</a></li>
          </ul>
        </div>
        <a href="#four" className="goto-next scrolly">Next</a>
      </section> */}

      {/* Four */}
      <section id="four" className="wrapper style1 special fade-up">
        <div className="container">
          <header className="major">
            <h2>소개</h2>
            {/* <p>치매예방</p> */}
          </header>
          <div className="col-12">
            <div className="centered-button-container">
            <button onClick={() => handleSectionClick('whatIsDementia')} className={`button ${selectedSection === 'whatIsDementia' ? 'active' : ''}`}>
              치매란?
            </button>
            <button onClick={() => handleSectionClick('causes')} className={`button ${selectedSection === 'causes' ? 'active' : ''}`}>
              원인
            </button>
            <button onClick={() => handleSectionClick('treatments')} className={`button ${selectedSection === 'treatments' ? 'active' : ''}`}>
              치료방법
            </button>
            <button onClick={() => handleSectionClick('prevention')} className={`button ${selectedSection === 'prevention' ? 'active' : ''}`}>
              치매 예방법
            </button>

            <div className="section-description">
          {selectedSection === 'whatIsDementia' && (
            <div className='sul2'>
              <h1 className='testsiz'>치매란?</h1>
              <p className='sul1'>
                <span className='sul11'>65세 이상 노인의 약 5~8%가 치매로 추정되고 있으며,</span> 
                <span className='sul111'>연령이 증가할 수록 <br></br>급격히 증가해
                65세에서 74세는 <br></br>3% 내외이나, 85세 이상은 45%가 치<br></br>매로 추정됩니다. 알츠하이머병이 <br></br>가장 많아서 47~61%, 혈관성 치매가 13~31%, 그 외 루이체 <br></br>치매가 세 번째로 많을 것으로 보고되고 있습니다.</span>
              </p>
            </div>
          )}
          {selectedSection === 'causes' && (
            <div className='sul2'>
              <h1 className='testsiz'>치매의 원인</h1>
              <p className='sul1'>
                <span className='sul11'>65세 이상 노인의 약 5~8%가 치매로 추정되고 있으며,</span> 
                <span className='sul111'>연령이 증eqwwewqeqeqw가할 수록 <br></br>급격히 증가해
                65세에서 74세는 <br></br>3% 내외이나, 85세 이상은 45%가 치<br></br>매로 추정됩니다. 알츠하이머병이 <br></br>가장 많아서 47~61%, 혈관성 치매가 13~31%, 그 외 루이체 <br></br>치매가 세 번째로 많을 것으로 보고되고 있습니다.</span>
              </p>
            </div>
          )}
          {selectedSection === 'treatments' && (
            <div className='sul2'>
              <h1 className='testsiz'>치료방법</h1>
              <p className='sul1'>
                <span className='sul11'>65세 이상 노인의 약 5~8%가 치매로 추정되고 있으며,</span> 
                <span className='sul111'>연령이 증wqeqeqeeq가할 수록 <br></br>급격히 증가해
                65세에서 74세는 <br></br>3% 내외이나q, 85세 이상은 45%가 치<br></br>매로 추정됩니다. 알츠하이머병이 <br></br>가장 많아서 47~61%, 혈관성 치매가 13~31%, 그 외 루이체 <br></br>치매가 세 번째로 많을 것으로 보고되고 있습니다.</span>
              </p>
            </div>
          )}
          {selectedSection === 'prevention' && (
            <div className='sul2'>
              <h1 className='testsiz'>치매 예방법</h1>
              <p className='sul1'>
                <span className='sul11'>65세 이상 노인의 약 5~8%가 치매로 추정되고 있으며,</span> 
                <span className='sul111'>연령이 증가할 수록 <br></br>급격히 증가해
                65세에서 74세는 <br></br>3% 내외dasdasdsa이나, 85세 이상은 45%가 치<br></br>매로 추정됩니다. 알츠하이머병이 <br></br>가장 많아서 47~61%, 혈관성 치매가 13~31%, 그 외 루이체 <br></br>치매가 세 번째로 많을 것으로 보고되고 있습니다.</span>
              </p>
            </div>
          )}
          </div>
              {/* <section className="col-4 col-6-medium col-12-xsmall">
                <h3>치매란?</h3>
                <h4>65세 이상 노인의 약 5~8%가 치매로 추정되고 있으며</h4>
                <p> 65세에서 74세는 3% 내외이나, 85세 이상은 45%가 치매로 추정됩니다. 알츠하이머병이 가
                  장 많아서 47~61%, 혈관성 치매가 13~31%, 그 외 루이체 치매가 세 번째로 많을 것으로 보
                  고되고 있습니다.65세에서 74세는 3% 내외이나, 85세 이상은 45%가 치매로 추정됩니다. 알츠하이머병이 가
                  장 많아서 47~61%, 혈관성 치매가 13~31%, 그 외 루이체 치매가 세 번째로 많을 것으로 보
                  고되고 있습니다.65세에서 74세는 3% 내외이나, 85세 이상은 45%가 치매로 추정됩니다. 알츠하이머병이 가
                  장 많아서 47~61%, 혈관성 치매가 13~31%, 그 외 루이체 치매가 세 번째로 많을 것으로 보</p>
              </section>
              <section className="col-4 col-6-medium col-12-xsmall">
                <h3>치매 관리의 중요성</h3>
                <h4>65세 이상 노인의 약 5~8%가 치매로 추정되고 있으며</h4>
                <p> 65세에서 74세는 3% 내외이나, 85세 이상은 45%가 치매로 추정됩니다. 알츠하이머병이 가
                  장 많아서 47~61%, 혈관성 치매가 13~31%, 그 외 루이체 치매가 세 번째로 많을 것으로 보
                  고되고 있습니다.65세에서 74세는 3% 내외이나, 85세 이상은 45%가 치매로 추정됩니다. 알츠하이머병이 가
                  장 많아서 47~61%, 혈관성 치매가 13~31%, 그 외 루이체 치매가 세 번째로 많을 것으로 보
                  고되고 있습니다.65세에서 74세는 3% 내외이나, 85세 이상은 45%가 치매로 추정됩니다. 알츠하이머병이 가
                  장 많아서 47~61%, 혈관성 치매가 13~31%, 그 외 루이체 치매가 세 번째로 많을 것으로 보</p>
              </section>
              <section className="col-4 col-6-medium col-12-xsmall">
                <h3>치매의 원인</h3>
                <h4>65세 이상 노인의 약 5~8%가 치매로 추정되고 있으며</h4>
                <p> 65세에서 74세는 3% 내외이나, 85세 이상은 45%가 치매로 추정됩니다. 알츠하이머병이 가
                  장 많아서 47~61%, 혈관성 치매가 13~31%, 그 외 루이체 치매가 세 번째로 많을 것으로 보
                  고되고 있습니다.65세에서 74세는 3% 내외이나, 85세 이상은 45%가 치매로 추정됩니다. 알츠하이머병이 가
                  장 많아서 47~61%, 혈관성 치매가 13~31%, 그 외 루이체 치매가 세 번째로 많을 것으로 보
                  고되고 있습니다.65세에서 74세는 3% 내외이나, 85세 이상은 45%가 치매로 추정됩니다. 알츠하이머병이 가
                  장 많아서 47~61%, 혈관성 치매가 13~31%, 그 외 루이체 치매가 세 번째로 많을 것으로 보</p>
              </section>
              <section className="col-4 col-6-medium col-12-xsmall">
                <h3>치매란?</h3>
                <h4>65세 이상 노인의 약 5~8%가 치매로 추정되고 있으며</h4>
                <p> 65세에서 74세는 3% 내외이나, 85세 이상은 45%가 치매로 추정됩니다. 알츠하이머병이 가
                  장 많아서 47~61%, 혈관성 치매가 13~31%, 그 외 루이체 치매가 세 번째로 많을 것으로 보
                  고되고 있습니다.65세에서 74세는 3% 내외이나, 85세 이상은 45%가 치매로 추정됩니다. 알츠하이머병이 가
                  장 많아서 47~61%, 혈관성 치매가 13~31%, 그 외 루이체 치매가 세 번째로 많을 것으로 보
                  고되고 있습니다.65세에서 74세는 3% 내외이나, 85세 이상은 45%가 치매로 추정됩니다. 알츠하이머병이 가
                  장 많아서 47~61%, 혈관성 치매가 13~31%, 그 외 루이체 치매가 세 번째로 많을 것으로 보</p>
              </section>
              <section className="col-4 col-6-medium col-12-xsmall">
                <h3>치매란?</h3>
                <h4>65세 이상 노인의 약 5~8%가 치매로 추정되고 있으며</h4>
                <p> 65세에서 74세는 3% 내외이나, 85세 이상은 45%가 치매로 추정됩니다. 알츠하이머병이 가
                  장 많아서 47~61%, 혈관성 치매가 13~31%, 그 외 루이체 치매가 세 번째로 많을 것으로 보
                  고되고 있습니다.65세에서 74세는 3% 내외이나, 85세 이상은 45%가 치매로 추정됩니다. 알츠하이머병이 가
                  장 많아서 47~61%, 혈관성 치매가 13~31%, 그 외 루이체 치매가 세 번째로 많을 것으로 보
                  고되고 있습니다.65세에서 74세는 3% 내외이나, 85세 이상은 45%가 치매로 추정됩니다. 알츠하이머병이 가
                  장 많아서 47~61%, 혈관성 치매가 13~31%, 그 외 루이체 치매가 세 번째로 많을 것으로 보</p>
              </section>
              <section className="col-4 col-6-medium col-12-xsmall">
                <h3>치매란?</h3>
                <h4>65세 이상 노인의 약 5~8%가 치매로 추정되고 있으며</h4>
                <p> 65세에서 74세는 3% 내외이나, 85세 이상은 45%가 치매로 추정됩니다. 알츠하이머병이 가
                  장 많아서 47~61%, 혈관성 치매가 13~31%, 그 외 루이체 치매가 세 번째로 많을 것으로 보
                  고되고 있습니다.65세에서 74세는 3% 내외이나, 85세 이상은 45%가 치매로 추정됩니다. 알츠하이머병이 가
                  장 많아서 47~61%, 혈관성 치매가 13~31%, 그 외 루이체 치매가 세 번째로 많을 것으로 보
                  고되고 있습니다.65세에서 74세는 3% 내외이나, 85세 이상은 45%가 치매로 추정됩니다. 알츠하이머병이 가
                  장 많아서 47~61%, 혈관성 치매가 13~31%, 그 외 루이체 치매가 세 번째로 많을 것으로 보</p>
              </section>
 */}

            </div>
          </div>
          <footer className="major">
            <ul className="actions special">
              <li><a href="Contents" className="button">프로그램 콘텐츠</a></li>
            </ul>
          </footer>
        </div>
      </section>

      {/* Five */}
      {/* <section id="five" className="wrapper style2 special fade">
        <div className="container">
          <header>
            <h2>Magna faucibus lorem diam</h2>
            <p>Ante metus praesent faucibus ante integer id accumsan eleifend</p>
          </header>
          <form method="post" action="#" className="cta">
            <div className="row gtr-uniform gtr-50">
              <div className="col-8 col-12-xsmall"><input type="email" name="email" id="email" placeholder="Your Email Address" /></div>
              <div className="col-4 col-12-xsmall"><input type="submit" value="Get Started" className="fit primary" /></div>
            </div>
          </form>
        </div>
      </section> */}

      {/* Footer */}

    </div>
  );
};

export default Main;

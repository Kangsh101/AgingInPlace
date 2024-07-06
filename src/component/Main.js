import React, { useState, useEffect, useRef } from 'react';
import styled from '@emotion/styled';
import useIntersectionObserver from './useIntersectionObserver';
import '../css/NewMain.css';
import '../css/Main.css';


const AnimatedContent = styled.div`
  animation-name: opacity;
  animation-duration: 5000ms;

  &.animation {
    animation-name: slideIn;
    animation-duration: 1s;
  }

  @keyframes opacity {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  @keyframes slideIn {
    from {
      transform: translateX(0);
    }
    to {
      transform: translateX(0);
    }
  }
`;

const AnimatedContent2 = styled.div`
  &.animation {
    animation-name: slideInRight;
    animation-duration: 1s;
  }

  @keyframes slideInRight {
    from {
      transform: translateX(100%);
    }
    to {
      transform: translateX(0);
    }
  }
`;

const AnimatedContent3 = styled.div`
  &.animation {
    animation-name: slideInLeft;
    animation-duration: 1s;
  }

  @keyframes slideInLeft {
    from {
      transform: translateX(-100%);
    }
    to {
      transform: translateX(100);
    }
  }
`;

const Main = () => {
  const [selectedSection, setSelectedSection] = useState('whatIsDementia');
  const section1Ref = useRef(null);
  const section2Ref = useRef(null);
  const section3Ref = useRef(null);
  const content1Ref = useRef(null);
  const content2Ref = useRef(null);
  const content3Ref = useRef(null);
  const isInViewport1 = useIntersectionObserver(section1Ref);
  const isInViewport2 = useIntersectionObserver(section2Ref);
  const isInViewport3 = useIntersectionObserver(section3Ref);
  const [animationAdded1, setAnimationAdded1] = useState(false);
  const [animationAdded2, setAnimationAdded2] = useState(false);
  const [animationAdded3, setAnimationAdded3] = useState(false);

  useEffect(() => {
    if (isInViewport1 && !animationAdded1) {
      section1Ref.current.classList.add('animation');
      if (content1Ref.current) {
        content1Ref.current.style.display = 'block';
      }
      setAnimationAdded1(true);
    }
    if (isInViewport2 && !animationAdded2) {
      section2Ref.current.classList.add('animation');
      if (content2Ref.current) {
        content2Ref.current.style.display = 'block';
      }
      setAnimationAdded2(true);
    }
    if (isInViewport3 && !animationAdded3) {
      section3Ref.current.classList.add('animation');
      if (content3Ref.current) {
        content3Ref.current.style.display = 'block';
      }
      setAnimationAdded3(true);
    }
  }, [isInViewport1, isInViewport2, isInViewport3, animationAdded1, animationAdded2, animationAdded3]);

  const handleSectionClick = (section) => {
    setSelectedSection(section);
  };

  return (

    <div className="is-preload landing" id="page-wrapper">
      <AnimatedContent>
      <section id="banner" style={{ backgroundPosition: 'center -42.6px' }}>
      
        <div className="content">
          <header>
            <h2 id='main-h2'> Aging In Place </h2>
            <p id='main-p'>Dementia Prevention</p>
            <p> 치매 예방 페이지에 오신 것을 환영합니다.</p>
          </header>
          {/* <img src="/images/clclao.jpg" alt="Your Logo" className='hadervar-logo'/> */}
          {/* <span className="image"><img src={require('./images/pic01.jpg').default} alt="" /></span> */}
        </div>
     
        {/* <a href="#one" className="goto-next scrolly">Next</a> */}
      </section>
      </AnimatedContent>
      <article id='main'>
      <section id="four" className="wrapper style1 special fade-up">
      
        <div className="container">
          <header className="major">
            <h2>소개</h2>
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
              <h2 className='testsiz'>치매란?</h2>
              <p className='sul1'>
                <span className='sul11'>65세 이상 노인의 약 5~8%가 치매로 추정되고 있으며,</span> 
                <span className='sul111'>연령이 </span>
              </p>
            </div>
          )}
          {selectedSection === 'causes' && (
            <div className='sul2'>
              <h2 className='testsiz'>치매의 원인</h2>
              <p className='sul1'>
                <span className='sul11'>65세 이상</span> 
                <span className='sul111'>연령</span>
              </p>
            </div>
          )}
          {selectedSection === 'treatments' && (
            <div className='sul2'>
              <h2 className='testsiz'>치료방법</h2>
              <p className='sul1'>
                <span className='sul11'>65세 </span> 
                <span className='sul111'>연령</span>
              </p>
            </div>
          )}
          {selectedSection === 'prevention' && (
            <div className='sul2'>
              <h2 className='testsiz'>치매 예방법</h2>
              <p className='sul1'>
                <span className='sul11'>65세 </span> 
                <span className='sul111'>연령</span>
              </p>
            </div>
          )}
          </div>
            </div>
          </div>
          <footer className="major">
            <ul className="actions special">
              <li><a href="Contents" className="button">프로그램 콘텐츠</a></li>
            </ul>
          </footer>
        </div>
      </section>
      </article>
      {/* section1 */}
      <section id="one2" className="spotlight style1 bottom">
        <span className="image fit main"><img src="/public/images/cat03.jpg"></img></span>
        <AnimatedContent2 ref={section1Ref} className={animationAdded1 ? 'animation' : ''}>
          
        <div className="content" ref={content1Ref} style={{ display: 'none' }}>
          <div className="container">
            <div className="row">
              <div className="col-4 col-12-medium">
                <header>
                  <h2>치매 콘텐츠 1</h2>
                  <p>Nascetur eu nibh vestibulum amet gravida nascetur praesent</p>
                </header>
              </div>
              <div className="col-4 col-12-medium">
                <p>Feugiat accumsan lorem eu ac lorem amet sed accumsan donec.
                  Blandit orci porttitor semper. Arcu phasellus tortor enim mi</p>
              </div>
              <div className="col-4 col-12-medium">
                <p>Morbi enim nascetur et placerat lorem sed iaculis neque ante
                  adipiscing adipiscing metus massa. Blandit orci porttitor semper.</p>
              </div>
            </div>
          </div>
        </div>
        </AnimatedContent2>
        {/* <a href="#two" className="goto-next scrolly">Next</a> */}
      </section>
      
      {/* section2 */}
      <section id="one" className="spotlight2 style1 bottom">
        <span className="image fit main"><img src="/public/images/cat03.jpg"></img></span>
        <AnimatedContent3 ref={section2Ref} className={animationAdded2 ? 'animation' : ''}>
          
        <div className="content" ref={content2Ref} style={{ display: 'none' }}>
          <div className="container">
            <div className="row">
              <div className="col-4 col-12-medium">
                <header>
                  <h2>치매 콘텐츠 2</h2>
                  <p>Nascetur eu nibh vestibulum amet gravida nascetur praesent</p>
                </header>
              </div>
              <div className="col-4 col-12-medium">
                <p>Feugiat accumsan lorem eu ac lorem amet sed accumsan donec.
                  Blandit orci porttitor semper. Arcu phasellus tortor enim mi</p>
              </div>
              <div className="col-4 col-12-medium">
                <p>Morbi enim nascetur et placerat lorem sed iaculis neque ante
                  adipiscing adipiscing metus massa. Blandit orci porttitor semper.</p>
              </div>
            </div>
          </div>
        </div>
        </AnimatedContent3>
        {/* <a href="#two" className="goto-next scrolly">Next</a> */}
      </section>
      {/* section2 */}
       {/* <section id="two" className="spotlight style2 right">
        <span className="image fit main"><img src="/images/cat03.jpg"/></span>
        <AnimatedContent3 ref={section2Ref} className={animationAdded2 ? 'animation' : ''}>
        <div className="content" ref={content2Ref} style={{ display: 'none' }}>
          <header>
            <h2>Interdum </h2>
            <p>Nunc commodo</p>
          </header>
          <p>Feugiat</p>
          <ul className="actions">
            <li><a href="#" className="button">Learn More</a></li>
          </ul>
        </div>
        </AnimatedContent3>
        <a href="#three" className="goto-next scrolly">Next</a>
      </section> */}
 

      {/* section3 */}
      {/* <section id="three" className="spotlight style3 left">
        <span className="image fit main bottom"></span>
        <div className="content">
          <header>
            <h2>Interdum felis blandit praesent sed augue</h2>
            <p>Accumsan integer ultricies aliquam vel massa sapien phasellus</p>
          </header>
          <p>Feugep aliquet augue varius tempus lobortis porttitor lorem et accumsan consequat adipiscing lorem.</p>
          <ul className="actions">
            <li><a href="#" className="button">Learn More</a></li>
          </ul>
        </div>
        <a href="#four" className="goto-next scrolly">Next</a>
      </section> */}

      {/* section4 */}
      
     

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

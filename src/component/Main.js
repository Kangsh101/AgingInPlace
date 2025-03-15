import React, { useState, useEffect, useRef } from 'react';
import styled from '@emotion/styled';
import { Link as ScrollLink, animateScroll as scroll } from 'react-scroll';
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

const ScrollTopButton = styled.button`
  position: fixed;
  bottom: 30px;
  right: 30px;
  display: ${props => (props.visible ? 'block' : 'none')};
  background-color: #83D3C9;
  color: #fff;
  border: none;
  border-radius: 50%;
  padding: 20px;
  font-size: 20px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  cursor: pointer;
  z-index: 1000;
  transition: background-color 0.3s ease, box-shadow 0.3s ease;

  &:hover {
    background-color: #62b3aa;
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.3);
  }
`;

const Main = () => {
  const [selectedSection, setSelectedSection] = useState('whatIsDementia');
  const [showScrollTop, setShowScrollTop] = useState(false);
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

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.pageYOffset > 300);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSectionClick = (section) => {
    setSelectedSection(section);
  };

  const scrollToTop = () => {
    scroll.scrollToTop();
  };

  return (
    <div className="is-preload landing" id="page-wrapper">
      <AnimatedContent>
        <section id="banner2">
          <div className="inner">
          <header>
            <h2>Aging In Place</h2>
          </header>
          <p><strong className='Main-TextLo'>Aging In Place</strong> 에 오신 것을 환영합니다. <br></br><br></br>치매 예방과 관리를 위한 자원을 제공하는 WebSite 입니다.
            <br />
            정보를 얻고, 연결을 유지하며, 건강한 삶을 주도하세요.
            <br />
            가정에서 더 건강한 삶을 위한 도구, 팁, 지원을 탐색해보세요.</p>
            <p>자신감과 편안함을 가지고 독립적으로 생활할 수 있도록 도와드립니다.</p>

            <p>
              <a 
                href="/대상자 교육자료_0113,2025.pdf" 
                target="_blank" 
                rel="noopener noreferrer"
              >
                <h4 id="BaroGOGO">대상자 교육자료 바로가기 [Click]</h4>
              </a>
            </p>

            <footer>
              <ul className="buttons stacked">
                <li>
                  <ScrollLink 
                    to="main" 
                    className="button fit scrolly"
                    smooth={true}
                    duration={1000}
                  >
                    소개 ▼
                  </ScrollLink>
                </li>
              </ul>
            </footer>
          </div>
        </section>
      </AnimatedContent>
      <section id="four" className="wrapper style1 special fade-up">
        <article id='main'>
          <div className="container">
            <header class="special container">
              <header className="major">
                <h2>소개</h2>
              </header>
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
           
                <div className="dementia-info-container">
                  {selectedSection === 'whatIsDementia' && (
                  <section className="section">
                    {/* <img src="/images/cat1.jpg" alt="치매란?" className="centered-image" /> */}
                    <h2 className="section-title">치매란?</h2>
                      <p className="section-content">
                      <span className='Main-liFont'>치매(Dementia)</span>는 뇌 기능의 저하로 인해 기억력, 사고력, 언어 능력, 판단력 등의 인지 기능이 점진적으로 악화되는 질환입니다. <br></br>이는 단일 질환이 아니라 여러 가지 원인에 의해 발생하는 다양한 증상의 집합체를 의미합니다. <br></br>치매의 주요 원인으로는 알츠하이머병, 혈관성 치매, 루이소체 치매, 전두측두엽 치매 등이 있습니다.
                      </p>
                </section>
                  )}
                  {selectedSection === 'causes' && (
                    <section className="section">
                    <h2 className="section-title">치매의 원인</h2>
                      <ol className="section-content">
                        <li><span className='Main-liFont'>알츠하이머병</span> : 가장 흔한 치매의 원인으로, 뇌세포의 퇴행성 변화로 인해 발생합니다.</li>
                        <li><span className='Main-liFont'>혈관성 치매</span> : 뇌졸중이나 기타 혈관 질환으로 인해 뇌로 가는 혈류가 차단되어 발생합니다.</li>
                        <li><span className='Main-liFont'>루이소체 치매</span> : 루이소체라는 비정상적인 단백질이 뇌에 축적되어 발생합니다.</li>
                        <li><span className='Main-liFont'>전두측두엽 치매</span> : 전두엽과 측두엽의 뇌세포가 손상되어 발생합니다.</li>
                        <li><span className='Main-liFont'>기타</span> : 외상성 뇌손상, 중추신경계 감염, 영양 결핍 등도 치매를 유발할 수 있습니다.</li>
                      </ol>
                  </section>
                  )}
                  {selectedSection === 'treatments' && (
                  <section className="section">
                  <h2 className="section-title">치료방법</h2>
                  <div className="section-content">
                    <ol>
                      <li>
                        <span className='Main-liFont'>약물 치료</span>
                        <ul>
                          <li>콜린에스터라제 억제제: 기억력과 인지 기능을 향상시키기 위해 사용됩니다. 예: 도네페질, 리바스티그민, 갈란타민.</li>
                          <li>NMDA 수용체 길항제: 중등도에서 중증 알츠하이머병 환자에게 사용됩니다. 예: 메만틴.</li>
                        </ul>
                      </li>
                      <li >
                      <span className='Main-liFont'>비약물적 치료</span>
                        <ul>
                          <li>인지 재활: 기억력, 문제 해결 능력 등을 향상시키기 위한 훈련.</li>
                          <li>물리 치료: 신체 기능을 유지하고 개선하기 위한 운동.</li>
                          <li>심리 치료: 불안, 우울 등의 정서적 문제를 완화하기 위한 치료.</li>
                        </ul>
                      </li>
                      <li>
                      <span className='Main-liFont'>생활 습관 관리</span>
                      </li>
                        <ul>
                          <li>규칙적인 운동, 균형 잡힌 식사, 충분한 수면, 사회적 활동 참여 등이 중요합니다.</li>
                        </ul>
                    </ol>
                  </div>
                </section>
                  )}
                  {selectedSection === 'prevention' && (
                    <section className="section">
                    <h2 className="section-title">치매 예방법</h2>
                    <div className="section-content">
                      <ol>
                        <li>
                        <span className='Main-liFont'>건강한 생활 습관</span>
                          <ul>
                            <li>규칙적인 운동: 매일 30분 이상의 유산소 운동을 추천합니다.</li>
                            <li>균형 잡힌 식사: 지중해식 식단, 과일과 채소 섭취를 늘리고 포화 지방을 줄이는 식단이 좋습니다.</li>
                            <li>충분한 수면: 매일 7-8시간의 충분한 수면을 취합니다.</li>
                          </ul>
                        </li>
                        <li>
                        <span className='Main-liFont'> 정신적 활동</span>
                          <ul>
                            <li>독서와 학습: 새로운 것을 배우고 읽는 활동이 뇌를 자극합니다.</li>
                            <li>퍼즐과 게임: 퍼즐, 체스, 수학 문제 해결 등 뇌를 자극하는 활동을 권장합니다.</li>
                          </ul>
                        </li>
                        <li>
                          <span className='Main-liFont'>사회적 활동</span>
                        </li>
                        <ul>
                          <li>친구나 가족과의 정기적인 소통, 클럽이나 사회 활동에 참여합니다.</li>
                        </ul>
                        <li>
                        <span className='Main-liFont'>건강 관리</span>
                          <ul>
                            <li>혈압, 당뇨, 콜레스테롤 관리: 정기적인 건강 검진과 관리가 필요합니다.</li>
                            <li>금연: 흡연은 혈관 건강에 악영향을 미치므로 금연이 필요합니다.</li>
                            <li>적정 음주: 과도한 음주는 피하고, 적정량의 음주를 유지합니다.</li>
                          </ul>
                        </li>
                      </ol>
                    </div>
                  </section>
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
        </article>
      </section>
      
      <ScrollTopButton onClick={scrollToTop} visible={showScrollTop}>
        ↑
      </ScrollTopButton>
    </div>
  );
};

export default Main;

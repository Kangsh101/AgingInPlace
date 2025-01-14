import React, { useState } from 'react';
import '../css/Contents.css';
import '../css/pagination.css';

const ContentPage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState("전체"); // 카테고리 상태 추가
  const videosPerPage = 3;

  const categories = ["전체", ...new Set(videos.map(video => video.category))]; // 카테고리 목록 생성

  // 선택된 카테고리에 따라 동영상 필터링
  const filteredVideos = selectedCategory === "전체"
    ? videos
    : videos.filter(video => video.category === selectedCategory);

  const indexOfLastVideo = currentPage * videosPerPage;
  const indexOfFirstVideo = indexOfLastVideo - videosPerPage;
  const currentVideos = filteredVideos.slice(indexOfFirstVideo, indexOfLastVideo);

  const paginate = pageNumber => setCurrentPage(pageNumber);

  return (
    <article id='main'>
      <div className='content-main'>
        <div className='content-container'>
          <header className='major'>
            <h2 className='content-title'>프로그램 콘텐츠</h2>
          </header>

          <div className="category-filter">
            {categories.map((category, index) => (
              <button
                key={index}
                onClick={() => {
                  setSelectedCategory(category);
                  setCurrentPage(1); 
                }}
                className={`category-button ${category === selectedCategory ? 'active' : ''}`}
              >
                {category}
              </button>
            ))}
          </div>

          <div className="content-layout">
            {currentVideos.map((video, index) => (
              <div className="video-description-wrapper" key={index}>
                <div className="video-box">
                  <iframe 
                    src={video.src}
                    title={video.title}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                </div>
                <div className="description-box">
                  <a href={video.src} target="_blank" rel="noopener noreferrer">{video.title}</a>
                  <p className='description-css'>{video.description}</p>
                </div>
              </div>
            ))}
          </div>

          <Pagination
            videosPerPage={videosPerPage}
            totalVideos={filteredVideos.length}
            paginate={paginate}
            currentPage={currentPage}
          />
        </div>
      </div>
    </article>
  );
};

const Pagination = ({ videosPerPage, totalVideos, paginate, currentPage }) => {
  const pageNumbers = [];

  for (let i = 1; i <= Math.ceil(totalVideos / videosPerPage); i++) {
    pageNumbers.push(i);
  }

  return (
    <div className="pagination">
      {pageNumbers.map(number => (
        <button
          key={number}
          onClick={() => paginate(number)}
          className={`page-button ${number === currentPage ? 'active' : ''}`}
        >
          {number}
        </button>
      ))}
    </div>
  );
};

const videos = [
  //====================치매 예방 =====================
  {
    src: "https://www.youtube.com/embed/zcZfeP9v1jY",
    title: "치매 예방",
    description: "치매 얼씬도 못하는 예방법은?",
    category: "치매 예방"
  },
  {
    src: "https://www.youtube.com/embed/F4EDT24TsuI",
    title: "치매 예방",
    description: "치매관리 골든타임! 경도인지장애 단계부터 관리하세요. ",
    category: "치매 예방"
  },
  {
    src: "https://www.youtube.com/embed/x7dJaHn8xF0",
    title: "치매 예방",
    description: "치매를 예방하는 생활습관",
    category: "치매 예방"
  },
  {
    src: "https://www.youtube.com/embed/epz2Ouu59mI",
    title: "치매 예방",
    description: "치매예방법, 치매와 운동",
    category: "치매 예방"
  },
  // ====================수면 =======================
  {
    src: "https://www.youtube.com/embed/cuYuZeQvCzg",
    title: "수면",
    description: "잠을 잘 못 자면 치매에 걸릴 수 있나요?",
    category: "수면"
  },
  {
    src: "https://www.youtube.com/embed/roHY10SsN3k",
    title: "수면",
    description: "올바른 수면 방법",
    category: "수면"
  },
  {
    src: "https://www.youtube.com/embed/I7vOQxGSfNk",
    title: "수면",
    description: "치매를 부르는 수면 유형",
    category: "수면"
  },
  {
    src: "https://www.youtube.com/embed/kNtrrlK7Cng",
    title: "수면",
    description: "불면증 증상 완화에 도움을 주는 음식 세가지",
    category: "수면"
  },
  //=============치매 예방에 좋은 음식 ============
  {
    src: "https://www.youtube.com/embed/VMj0DzBbefU",
    title: "음식 best 4",
    description: "치매예방에 좋은 음식 best 4",
    category: "치매에 좋은 음식"
  },
  //==============운동 ===============
  {
    src: "https://www.youtube.com/embed/epz2Ouu59mI",
    title: "운동 ",
    description: "치매의 예방법, 치매와 운동",
    category: "운동"
  },
  {
    src: "https://www.youtube.com/embed/uk3oKzjhMT4",
    title: "운동",
    description: "의사가 알려주는 치매예방운동",
    category: "운동"
  },

];

export default ContentPage;
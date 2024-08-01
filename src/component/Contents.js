import React, { useState } from 'react';
import '../css/Contents.css';
import '../css/pagination.css';

const ContentPage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const videosPerPage = 3;

  const indexOfLastVideo = currentPage * videosPerPage;
  const indexOfFirstVideo = indexOfLastVideo - videosPerPage;
  const currentVideos = videos.slice(indexOfFirstVideo, indexOfLastVideo);

  const paginate = pageNumber => setCurrentPage(pageNumber);

  return (
    <article id='main'>
      <div className='content-main'>
        <div className='content-container'>
          <header className='major'>
            <h2 className='content-title'>프로그램 콘텐츠</h2>
          </header>
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
                  <p>{video.description}</p>
                </div>
              </div>
            ))}
          </div>
          <Pagination
            videosPerPage={videosPerPage}
            totalVideos={videos.length}
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
  {
    src: "https://www.youtube.com/embed/e_UYhqrL8ic",
    title: "치매",
    description: "치매 환자를 위한 영상. 우울하면."
  },
  {
    src: "https://www.youtube.com/embed/NjgBnx1jVIU",
    title: "치매 ",
    description: "치매 환자를 위한 영상. 우울하면."
  },
  {
    src: "https://www.youtube.com/embed/qqBUw9BR-Us",
    title: "치매",
    description: "치매 환자를 위한 영상. 우울하면 ."
  },
  {
    src: "https://www.youtube.com/embed/qivFeoW6oMQ",
    title: "치매",
    description: "치매 환자를 위한 영상. 우울하면 a"
  },
  {
    src: "https://www.youtube.com/embed/qivFeoW6oMQ",
    title: "치매 환자",
    description: "치매 환자를 위한 영상. 우울하면"
  },
];

export default ContentPage;

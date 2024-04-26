import React from 'react';
import '../css/Page2.css';
import '../css/qnacontent.css';
import '../css/rkdtjrgus12.css';


const QnAContent = () => {
  // 하드코딩된 데이터
  const post = {
    title: '하드코딩된 제목',
    name: '사용자 이름',
    create_at: '2024-04-26 12:00:00',
    content: `<p>이것은 하드코딩된 내용입니다. HTML 형식으로 마크업을 할 수 있습니다.</p><p>이곳에 추가 내용을 넣을 수도 있습니다.</p>`,
  };

  // HTML 문자열을 객체로 변환하는 함수
  const createMarkup = (htmlContent) => {
    return { __html: htmlContent };
  };

  return (
    <div className="qnaup-page">
      <div className="qnaup-header">
        {/* <header className='major'>
          <h2 className='QnA-main'>QnA</h2>
        </header> */}
        <div className='qnacontent-container'>
          <div className='QnAup-title'>
            <span>제목 : </span> {post.title}
          </div>
          <div className='QnAup-author'>
            <span>작성자 : </span> {post.name}
            <span>등록일 : </span> {post.create_at}
          </div>
          {/* <hr className="qna-title-line" /> */}
          <div className='QnAup-content'>
            {/* <span>내용</span> */}
            <div className='qnaup-maincon' dangerouslySetInnerHTML={createMarkup(post.content)} />
          </div>
          {/* <hr className="qna-title-line" /> */}
        </div>
        <div className='QnAup-contentBtt'>
          <button className='button'>목록으로 돌아가기</button>
        </div>
      </div>
    </div>
  );
};

export default QnAContent;

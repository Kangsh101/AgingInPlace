import axios from 'axios';
import '../css/EditProfile.css';

const Download = () => {
    // 파일 다운로드 함수
    const handleDownload = async () => {
        try {
          const response = await axios({
            url: '/downloadFile',
            method: 'POST',
            responseType: 'blob',  // 응답 데이터를 Blob 형태로 받음
          });

          // Blob 데이터를 이용해 클라이언트에서 파일 다운로드 수행
          const url = window.URL.createObjectURL(new Blob([response.data]));
          const link = document.createElement('a');
          link.href = url;
          link.setAttribute('download', 'download.csv');  // 다운로드 파일명 설정
          document.body.appendChild(link);
          link.click();
          link.parentNode.removeChild(link);
        } catch (error) {
          console.error('Failed to download file:', error);
        }
    };

    return (
        <div className='editprofile-container'>
            <button onClick={handleDownload}>Download File</button>
        </div>
    );
};

export default Download;

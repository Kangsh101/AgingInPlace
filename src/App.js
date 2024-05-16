import React, { useState,useEffect } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Header from './component/Header';
import Login from './component/Login';
import Signup from './component/Signup';
import Footer from './component/Footer';
import Main from './component/Main';
import Idppl from './component/Idppl';
import Passwordppl from './component/Passwordppl';
import QnAPage from './component/QnAPage';
import Notice from './component/Notice';
import FaqPage from './component/FaqPage';
import MyPage from './component/MyPage';
import Contents from './component/Contents';
import Cms from './admin/Cms';
import Cmscontents from './admin/Cmscontents';
import Cmsuser from './admin/Cmsuser';
import Cmsfaq from './admin/Cmsfaq'
import QnAUp from './component/QnAUp';
import QnAContent from './component/QnAContent';
import FaqUp from './admin/FaqUp';
import NoticeUp from './admin/NoticeUp';
import NoticeUpdate from './admin/NoticeUpdate';
import Navpanel from './component/Navpanel';
import useIntersectionObserver from './component/useIntersectionObserver';
import Rkdtjrgus12 from './component/rkdtjrgus12';
import AddDiagnosis from './component/AddDiagnosis';
import Download from './component/Download';
import NoticeContent from './component/NoticeContent';
import CmsNoticeContent from './admin/CmsNoticeContent';
import Chart from './component/Chart';
import CmsFaqEdit from './admin/CmsFaqEdit';
function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const storedIsLoggedIn = localStorage.getItem('isLoggedIn');
    if (storedIsLoggedIn) {
      setIsLoggedIn(JSON.parse(storedIsLoggedIn));
    }
  }, []);
  

  const handleLogin = (loginStatus) => {
    setIsLoggedIn(loginStatus);
    localStorage.setItem('isLoggedIn', JSON.stringify(loginStatus));
  };
  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem('isLoggedIn');
    window.location.href = '/main';
  };
  

  return (
    <BrowserRouter>
      <div className="App">
      
        <Routes>
        {/* {useIntersectionObserver() && <Navpanel isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />} */}

          <Route path="/" element={<><Navpanel isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} /><Header isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} /><Main /><Footer/></>} />
          <Route path="/main" element={<><Navpanel isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} /><Header isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} /><Main /><Footer/></>} />
          <Route path="/login" element={<><Navpanel isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} /><Header isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} /><Login onLogin={handleLogin}/><Footer /></>} />
          <Route path="/signup" element={<><Navpanel isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} /><Header isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} /><Signup /><Footer /></>} />
          <Route path="/Idppl" element={<><Navpanel isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} /><Header isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} /><Idppl /><Footer /></>} />
          <Route path="/Passwordppl" element={<><Navpanel isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} /><Header isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} /><Passwordppl /><Footer /></>} />
          <Route path="/qnapage" element={<><Navpanel isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} /><Header isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} /><QnAPage /><Footer /></>} />
          <Route path="/qnaup" element={<><Navpanel isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} /><Header isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} /><QnAUp /><Footer /></>} />
          <Route path="/notice" element={<><Navpanel isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} /><Header isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} /><Notice /><Footer /></>} />
          <Route path="/faqpage" element={<><Navpanel isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} /><Header isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} /><FaqPage /><Footer /></>} />
          <Route path="/noticecontent" element={<><Navpanel isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} /><Header isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} /><NoticeContent /><Footer /></>} />
          <Route path="/MyPage" element={<><Navpanel isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} /><Header isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} /><MyPage /><Footer /></>} />
          <Route path="/contents" element={<><Navpanel isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} /><Header isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} /><Contents /><Footer /></>} />
          <Route path="/qnacontent/:id" element={<><Navpanel isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} /><Header isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} /><QnAContent /><Footer /></>} />
          <Route path="/noticecontent/:id" element={<><Navpanel isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} /><Header isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} /><NoticeContent  /><Footer /></>} />
          
          <Route path="/cmsnoticecontent/:id" element={<><Navpanel isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} /><Header isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} /><CmsNoticeContent /><Footer /></>} />
          <Route path="/AddDiagnosis" element={<><Navpanel isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} /><Header isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} /><AddDiagnosis /><Footer /></>} />
          
          <Route path="/Download" element={<><Navpanel isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} /><Header isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} /><Download /><Footer /></>} />
          
          <Route path="/rkdtjrgus12" element={<><Navpanel isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} /><Header isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} /><Rkdtjrgus12/><Footer /></>} />
          <Route path="/chart" element={<><Navpanel isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} /><Header isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} /><Chart/><Footer /></>} />
          
         
           
          <Route path="/faqedit/:id" element={<CmsFaqEdit />} />
          <Route path="/faqup" element={<FaqUp />} />
          <Route path="/noticeup" element={<NoticeUp />} />
          <Route path="/cms" element={<Cms />} />
          <Route path="/cmsuser" element={<Cmsuser />} />
          <Route path="/cmsfaq" element={<Cmsfaq />} />
          <Route path="/noticeupdate" element={<NoticeUpdate />} />
          <Route path="/Cmscontents" element={<Cmscontents />} />

          <Route path="/cms/*" element={<CmsLayout />} />
        </Routes>
 
      </div>
    </BrowserRouter>
  );
}


const CmsLayout = () => {
  return (
    <Routes>
      <Route path="/cms" element={<Cms />} />
      <Route path="/cmsuser" element={<Cmsuser />} />
      <Route path="/cmsfaq" element={<Cmsfaq />} />
      <Route path="/Cmscontents" element={<Cmscontents />} />
    </Routes>
  );
};

export default App;

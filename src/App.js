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
          <Route path="/" element={<><Navpanel/><Header isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} /><Main /></>} />
          <Route path="/login" element={<><Navpanel/><Header isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} /><Login onLogin={handleLogin}/><Footer /></>} />
          <Route path="/signup" element={<><Navpanel/><Header isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} /><Signup /><Footer /></>} />
          <Route path="/Idppl" element={<><Navpanel/><Header isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} /><Idppl /><Footer /></>} />
          <Route path="/Passwordppl" element={<><Navpanel/><Header isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} /><Passwordppl /><Footer /></>} />
          <Route path="/qnapage" element={<><Navpanel/><Header isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} /><QnAPage /><Footer /></>} />
          <Route path="/qnaup" element={<><Navpanel/><Header isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} /><QnAUp /><Footer /></>} />
          <Route path="/notice" element={<><Navpanel/><Header isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} /><Notice /><Footer /></>} />
          <Route path="/faqpage" element={<><Navpanel/><Header isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} /><FaqPage /><Footer /></>} />
          <Route path="/main" element={<><Navpanel/><Header isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} /><Main /></>} />
          <Route path="/MyPage" element={<><Navpanel/><Header isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} /><MyPage /><Footer /></>} />
          <Route path="/contents" element={<><Navpanel/><Header isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} /><Contents /><Footer /></>} />
          <Route path="/qnacontent/:id" element={<><Navpanel/><Header isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} /><QnAContent /><Footer /></>} />


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

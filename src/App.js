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
import Cmss from './admin/Cmss';
import Cmscontents from './admin/Cmscontents';
import Cmsuser from './admin/Cmsuser';
import Cmsfaq from './admin/Cmsfaq'
import QnAUp from './component/QnAUp';
import QnAContent from './component/QnAContent';
import FaqUp from './admin/FaqUp';
import NoticeUp from './admin/NoticeUp';

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
      <Header isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
        <Routes>
          <Route path="/" element={<Main />} />
          <Route path="/login" element={<Login onLogin={handleLogin}  />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/Idppl" element={<Idppl />} />
          <Route path="/Passwordppl" element={<Passwordppl />} />
          <Route path="/qnapage" element={<QnAPage />} />
          <Route path="/qnaup" element={<QnAUp />} />
          <Route path="/notice" element={<Notice />} />
          <Route path="/faqpage" element={<FaqPage />} />
          <Route path="/main" element={<Main />} />
          <Route path="/MyPage" element={<MyPage />} />
          <Route path="/contents" element={<Contents />} />
          <Route path="/qnacontent/:id" element={<QnAContent />} />


          <Route path="/faqup" element={<FaqUp />} />
          <Route path="/noticeup" element={<NoticeUp />} />
          <Route path="/cms" element={<Cms />} />
          <Route path="/cmsuser" element={<Cmsuser />} />
          <Route path="/cmsfaq" element={<Cmsfaq />} />
          <Route path="/cmss" element={<Cmss />} />
          <Route path="/Cmscontents" element={<Cmscontents />} />

          <Route path="/cms/*" element={<CmsLayout />} />
        </Routes>
        <Footer />
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
      <Route path="/cmss" element={<Cmss />} />
      <Route path="/Cmscontents" element={<Cmscontents />} />
    </Routes>
  );
};

export default App;

import React, { useState, useEffect } from 'react';
import { BrowserRouter, Route, Routes,Navigate } from 'react-router-dom';
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
import Cmsfaq from './admin/Cmsfaq';
import QnAUp from './component/QnAUp';
import QnAContent from './component/QnAContent';
import FaqUp from './admin/FaqUp';
import NoticeUp from './admin/NoticeUp';
import NoticeUpdate from './admin/NoticeUpdate';
import Navpanel from './component/Navpanel';
import useIntersectionObserver from './component/useIntersectionObserver';
import AddDiagnosis from './component/AddDiagnosis';
import Download from './component/Download';
import NoticeContent from './component/NoticeContent';
import CmsNoticeContent from './admin/CmsNoticeContent';
import Chart from './component/Chart';
import CmsFaqEdit from './admin/CmsFaqEdit';
import QnAanswersUp from './component/QnAanswersUp';
import AnswerDetail from './component/AnswerDetail';
import CmsAdddiagnosis from './admin/CmsAdddiagnosis';
import PatientDetail from './admin/PatientDetail';
import AddPatientCriteria from'./admin/AddPatientCriteria';
import PatientCriteria from './admin/PatientCriteria';
import CmsSidebar from './admin/CmsSidebar';
import CmsNavipanel from './admin/CmsNavipanel';
import PatientData from './component/PatientData';
import PatientDiagnosisList from './admin/PatientDiagnosisList';
import PatientChart from './component/PatientChart';
import CmsCIST from './admin/CmsCIST';
import AddQuestionCIST from './admin/AddQuestionCIST';
import EditQuestionCIST from './admin/EditQuestionCIST';
import QuestionDetailCIST from './admin/QuestionDetailCIST';
import NotFound from './component/NotFound';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const storedIsLoggedIn = sessionStorage.getItem('isLoggedIn');
    const storedUserRole = sessionStorage.getItem('userRole');
    if (storedIsLoggedIn) {
      setIsLoggedIn(JSON.parse(storedIsLoggedIn));
      setUserRole(storedUserRole); 
    }
}, []);


const handleLogin = (loginStatus, role) => {
  setIsLoggedIn(loginStatus);
  setUserRole(role); 
  sessionStorage.setItem('isLoggedIn', JSON.stringify(loginStatus));
  sessionStorage.setItem('userRole', role); 
};


  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserRole(null); 
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userRole');
    window.location.href = '/main';
  };

  const ProtectedRoute = ({ element, role }) => {
    if (!isLoggedIn) {
      return <Navigate to="/login" />;
    }
    if (role && role !== userRole) {
      return <Navigate to="/unauthorized" />;
    }
    return element;
  };


  return (
    <BrowserRouter>
      <div className="App">
        <Routes>
          <Route path="/" element={<><Navpanel isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} /><Header isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} /><Main /><Footer /></>} />
          <Route path="/main" element={<><Navpanel isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} /><Header isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} /><Main /><Footer /></>} />
          <Route path="/login" element={<><Navpanel isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} /><Header isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} /><Login onLogin={handleLogin} /><Footer /></>} />
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
          <Route path="/qnaanswersup" element={<><Navpanel isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} /><Header isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} /><QnAanswersUp /><Footer /></>} />
          <Route path="/qnaanswersup/:postId" element={<><Navpanel isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} /><Header isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} /><QnAanswersUp /><Footer /></>} />
          <Route path="/qnaposts/:id" element={<><Navpanel isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} /><Header isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} /><QnAContent /><Footer /></>} />
          <Route path="/qnaanswers/:answerId" element={<><Navpanel isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} /><Header isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} /><AnswerDetail /><Footer /></>} />
          <Route path="/AddDiagnosis" element={<><Navpanel isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} /><Header isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} /><AddDiagnosis /><Footer /></>} />
          <Route path="/Download" element={<><Navpanel isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} /><Header isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} /><Download /><Footer /></>} />
          <Route path="/chart" element={<><Navpanel isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} /><Header isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} /><Chart/><Footer /></>} />
          <Route path="/patientdata" element={<><Navpanel isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} /><Header isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} /><PatientData/><Footer /></>} />
          <Route path="/cmsnoticecontent/:id" element={<><Navpanel isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} /><CmsNoticeContent/></>} />
          <Route path="/patientchart" element={<><Navpanel isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} /><Header isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} /><PatientChart/><Footer /></>} />
          <Route path="*" element={<><Navpanel isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} /><Header isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} /><NotFound/><Footer /></>} />

          {/* 관리자 (admin)*/}
          <Route path="/cms" element={<><CmsNavipanel/><Cms userRole={userRole} /></>} />

          <Route path="/cmsuser" element={<><CmsNavipanel/><Cmsuser userRole={userRole} /></>} />
          <Route path="/cms/*" element={<CmsLayout />} />
          <Route path="/faqup" element={<><CmsNavipanel/><FaqUp userRole={userRole}/></>} />
          <Route path="/noticeup" element={<><CmsNavipanel/><NoticeUp userRole={userRole}/></>} />
          <Route path="/faqedit/:id" element={<><CmsNavipanel/><CmsFaqEdit userRole={userRole}/></>} />
          <Route path="/Cmscontents" element={<><CmsNavipanel/><Cmscontents userRole={userRole}/></>} />
          <Route path="/cmsfaq" element={<><CmsNavipanel/><Cmsfaq userRole={userRole}/></>} />
          <Route path="/noticeupdate" element={<><CmsNavipanel/><NoticeUpdate userRole={userRole} /></>} />
         
          {/* 관리자 의사 (admin,doctor)*/}
          <Route path='/question_detail/:id' element={<><CmsNavipanel/><QuestionDetailCIST userRole={userRole}/></>}/>
          <Route path='/addquestioncist/:id' element={<><CmsNavipanel/><EditQuestionCIST userRole={userRole}/></>}/>
          <Route path='/addquestioncist' element={<><CmsNavipanel/><AddQuestionCIST userRole={userRole}/></>}/>
          <Route path='/cmscist' element={<><CmsNavipanel/><CmsCIST userRole={userRole}/></>}/>
          <Route path="/cmsadddiagnosis" element={<><CmsNavipanel/><CmsAdddiagnosis userRole={userRole}/></>} />
          <Route path="/patientcriteria" element={<><CmsNavipanel/><PatientCriteria userRole={userRole}/></>} />
          <Route path="/addpatientcriteria/:id" element={<><CmsNavipanel/><AddPatientCriteria userRole={userRole} /></>} />
          <Route path="/patient/:id" element={<><CmsNavipanel/><PatientDiagnosisList userRole={userRole} /></>} />
          <Route path="/patient/:id/add-diagnosis" element={<><CmsNavipanel/><PatientDetail userRole={userRole}/></>} />
          
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

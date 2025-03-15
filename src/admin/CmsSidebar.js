import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import '../css/CmsSidebar.css';

const CmsSidebar = ({ userRole }) => {
  const location = useLocation();

  const allLinks = [
    { path: "/Cms", label: "게시판 관리", basePaths: ["/Cms", "/Cmsfaq"], role: ["admin"] },
    { path: "/Cmsuser", label: "사용자 관리", basePaths: ["/Cmsuser"], role: ["admin"] },
    { path: "/CmsPDFDown", label: "환자 정보 다운로드", basePaths: ["/CmsPDFDown"], role: ["admin", "doctor"] },
    { path: "/CmsAdddiagnosis", label: "진단명 추가", basePaths: ["/CmsAdddiagnosis", "/PatientDetail", "/patient"], role: ["admin", "doctor"] },
    { path: "/PatientCriteria", label: "환자 수면 / 운동량 추가", basePaths: ["/PatientCriteria","/addpatientcriteria"], role: ["admin", "doctor"] },
    { path: "/CmsCIST", label: "인지선별검사 추가", basePaths: ["/CmsCIST","/addquestioncist","/QuestionDetailCIST","/question_detail"], role: ["admin", "doctor"] },
    { path: "/CmsQuestionList", label: "인지선별검사 정답", basePaths: ["/CmsQuestionList","/CmsUserQuestions"], role: ["admin", "doctor"] },
  ];

  const visibleLinks = allLinks.filter(link => link.role.includes(userRole));

  const isActive = (basePaths) => {
    return basePaths.some(basePath => {
      return location.pathname === basePath || location.pathname.startsWith(basePath + '/');
    });
  };

  return (
    <div className="cms-sidebar">
      <h2 className='Cms-Aginginplace'>Aging in Place</h2>
      <h2 className='CmsSidebar-h2'>관리자</h2>
      <ul>
        {visibleLinks.map((link, index) => (
          <li key={index} className={`cms-item ${isActive(link.basePaths) ? "cms-active" : ""}`}>
            <Link to={link.path}>{link.label}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CmsSidebar;

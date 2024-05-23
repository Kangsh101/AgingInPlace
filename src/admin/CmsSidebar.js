import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import '../css/CmsSidebar.css';

const CmsSidebar = () => {
    const location = useLocation();
    const links = [
      { path: "/Cms", label: "게시판 관리", basePaths: ["/Cms", "/Cmsfaq"] },
      { path: "/Cmscontents", label: "프로그램 컨텐츠", basePaths: ["/Cmscontents"] },
      { path: "/Cmsuser", label: "사용자 관리", basePaths: ["/Cmsuser"] },
      { path: "/CmsAdddiagnosis", label: "진단명 추가", basePaths: ["/CmsAdddiagnosis"] },
      { path: "/Cmsuser", label: "환자 수면 / 운동량 추가", basePaths: ["/Cmsuser"] }
    ];
  
    const isActive = (basePaths) => {
        return basePaths.includes(location.pathname);
    };
    

    return (
      <div className="cms-sidebar">
        <h2 className='Cms-Aginginplace'>Aging in Place</h2>
        <h2>관리자</h2>
        <ul>
          {links.map((link, index) => (
            <li key={index} className={`cms-item ${isActive(link.basePaths) ? "cms-active" : ""}`}>
              <Link to={link.path}>{link.label}</Link>
            </li>
          ))}
        </ul>
      </div>
    );
};

export default CmsSidebar;

import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import '../css/CmsSidebar.css';

const CmsNavipanel = ({ isLoggedIn, setIsLoggedIn, userRole }) => {
    const [isLoaded, setIsLoaded] = useState(false);
    const [isNavOpen, setIsNavOpen] = useState(false); 
    const navPanelRef = useRef(null);
    const location = useLocation();

    const allLinks = [
        { path: "/Cms", label: "게시판 관리", basePaths: ["/Cms", "/Cmsfaq"], role: ["admin"] },
        { path: "/Cmsuser", label: "사용자 관리", basePaths: ["/Cmsuser"], role: ["admin"] },
        { path: "/CmsAdddiagnosis", label: "진단명 추가", basePaths: ["/CmsAdddiagnosis", "/PatientDetail"], role: ["admin", "doctor"] },
        { path: "/PatientCriteria", label: "환자 수면 / 운동량 추가", basePaths: ["/PatientCriteria"], role: ["admin", "doctor"] },
        { path: "/CmsCIST", label: "인지선별검사 추가", basePaths: ["/CmsCIST"], role: ["admin", "doctor"] },
        { path: "/CmsQuestionList", label: "인지선별검사 정답", basePaths: ["/CmsQuestionList"], role: ["admin", "doctor"] }
    ];

    const visibleLinks = allLinks.filter(link => link.role.includes(userRole));

    const isActive = (basePaths) => {
        return basePaths.some(basePath => 
            location.pathname === basePath || 
            location.pathname.startsWith(basePath + '/')
        );
    };
    
    

    useEffect(() => {
        const handleScroll = () => {
            // 필요한 경우 스크롤 관련 작업 추가
        };

        window.addEventListener('scroll', handleScroll);

        // 로드 애니메이션 트리거
        const timeout = setTimeout(() => {
            setIsLoaded(true);
        }, 100);

        return () => {
            clearTimeout(timeout);
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    const toggleNav = () => {
        setIsNavOpen(!isNavOpen);
        if (!isNavOpen) {
            document.body.classList.add('navPanel-visible');
        } else {
            document.body.classList.remove('navPanel-visible');
        }
    };

    return (
        <div className={`wrapper ${isLoaded ? 'is-preload' : ''}`}>
            <div id="titleBar">
                <a href="#navPanel" className={`toggle ${isNavOpen ? 'active' : ''}`} onClick={toggleNav}></a>
                <span className="title">관리자</span>
            </div>
            <div id="navPanel" ref={navPanelRef} className={isNavOpen ? 'visible' : ''}>
                <nav>
                    <h2 className='Cms-Aginginplace'>Aging in Place</h2>
                    <h2 className='Navipanel-h2'>관리자</h2>
                    <ul>
                        {visibleLinks.map((link, index) => (
                            <li key={index} className={`cms-item ${isActive(link.basePaths) ? "cms-active" : ""}`}>
                                <Link to={link.path}>{link.label}</Link>
                            </li>
                        ))}
                    </ul>
                </nav>
            </div>
            <div className="content">
                {/* 여기에 콘텐츠 추가 */}
            </div>
        </div>
    );
};

export default CmsNavipanel;

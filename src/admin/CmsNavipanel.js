import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import '../css/CmsSidebar.css';

const CmsNavipanel = ({ isLoggedIn, setIsLoggedIn }) => {
    const [isLoaded, setIsLoaded] = useState(false);
    const [isNavOpen, setIsNavOpen] = useState(false); 
    const navPanelRef = useRef(null);
    const location = useLocation();

    const links = [
        { path: "/Cms", label: "게시판 관리", basePaths: ["/Cms", "/Cmsfaq"] },
        { path: "/Cmscontents", label: "프로그램 컨텐츠", basePaths: ["/Cmscontents"] },
        { path: "/Cmsuser", label: "사용자 관리", basePaths: ["/Cmsuser"] },
        { path: "/CmsAdddiagnosis", label: "진단명 추가", basePaths: ["/CmsAdddiagnosis","/PatientDetail"] },
        { path: "/PatientCriteria", label: "환자 수면 / 운동량 추가", basePaths: ["/PatientCriteria"] }
    ];

    const isActive = (basePaths) => {
        return basePaths.includes(location.pathname);
    };

    useEffect(() => {
        const handleScroll = () => {
            // Add any scroll-related actions here if needed
        };

        window.addEventListener('scroll', handleScroll);

        // Trigger the load animation
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
                    <h2>관리자</h2>
                    <ul>
                        {links.map((link, index) => (
                            <li key={index} className={`cms-item ${isActive(link.basePaths) ? "cms-active" : ""}`}>
                                <Link to={link.path}>{link.label}</Link>
                            </li>
                        ))}
                    </ul>
                </nav>
            </div>
            <div className="content">
                {/* Add your content here */}
            </div>
        </div>
    );
};

export default CmsNavipanel;

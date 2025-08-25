import React from "react";
import { Link } from "gatsby";

import "./Header.scss";

const Header = ({ siteTitle, siteDescription, type }) => {
    const isMain = type === "main";
    console.log(type);
    
    // 현재 경로에서 언어 감지
    const getCurrentLanguage = () => {
        if (typeof window !== "undefined") {
            const path = window.location.pathname;
            if (path.startsWith("/eng")) return "eng";
            return "kor"; // 기본값은 한국어
        }
        return "kor";
    };

    const currentLang = getCurrentLanguage();
    const langPrefix = currentLang === "kor" ? "" : "/eng"; // 한국어는 루트, 영어는 /eng

    const handleDashboardClick = () => {
        alert("해당 기능은 현재 개발중입니다");
    };
    
    return (
        <header className={!isMain ? "simple" : null}>
            <div className="header-inner">
                <h1>
                    <Link to="/">{siteTitle}</Link>
                </h1>
                <ul>
                    <li>
                        <a href={currentLang === "kor" ? "/kor" : "/eng"}>Home</a>
                    </li>
                    <li>
                        <a href={currentLang === "kor" ? "/kor/category" : "/eng/category"}>Category</a>
                    </li>
                    <li>
                        <button
                            onClick={handleDashboardClick}
                            style={{
                                background: 'none',
                                border: 'none',
                                color: 'inherit',
                                fontSize: '14px',
                                fontWeight: 'bold',
                                cursor: 'pointer',
                                textDecoration: 'none',
                                padding: '0',
                                whiteSpace: 'nowrap'
                            }}
                        >
                            Dashboard
                        </button>
                    </li>
                    <li>
                        <a href={currentLang === "kor" ? "/kor/about" : "/eng/about"}>About</a>
                    </li>
                    <li style={{ marginLeft: '20px' }}>
                        <a 
                            href={currentLang === "kor" ? "/eng" : "/"}
                            style={{
                                display: 'inline-block',
                                padding: '1px 8px',
                                fontSize: '11px',
                                fontWeight: '600',
                                color: 'rgba(255, 255, 255, 0.9)',
                                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                                textDecoration: 'none',
                                borderRadius: '12px',
                                letterSpacing: '0.5px',
                                border: '1px solid rgba(255, 255, 255, 0.15)'
                            }}
                        >
                            {currentLang === "kor" ? "ENG" : "KOR"}
                        </a>
                    </li>
                </ul>
            </div>
        </header>
    );
};

export default Header;

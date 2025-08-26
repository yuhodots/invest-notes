import React, { useState } from "react";
import { Link } from "gatsby";

import "./Header.scss";

const Header = ({ siteTitle, siteDescription, type }) => {
    const isMain = type === "main";
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    console.log(type);
    
    // 현재 경로에서 언어 감지
    const getCurrentLanguage = () => {
        if (typeof window !== "undefined") {
            const path = window.location.pathname;
            // pathPrefix를 고려한 언어 감지
            if (path.includes("/eng")) return "eng";
            return "kor"; // 기본값은 한국어
        }
        return "kor";
    };

    const currentLang = getCurrentLanguage();
    const langPrefix = currentLang === "kor" ? "" : "/eng"; // 한국어는 루트, 영어는 /eng

    const handleDashboardClick = () => {
        alert("해당 기능은 현재 개발중입니다");
    };

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };
    
    return (
        <header className={!isMain ? "simple" : null}>
            <div className="header-inner">
                <h1>
                    <Link to="/">{siteTitle}</Link>
                </h1>
                
                {/* 데스크톱 메뉴 */}
                <ul className="desktop-menu">
                    <li>
                        <Link to={currentLang === "kor" ? "/kor" : "/eng"}>Home</Link>
                    </li>
                    <li>
                        <Link to={currentLang === "kor" ? "/kor/category" : "/eng/category"}>Category</Link>
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
                        <Link to={currentLang === "kor" ? "/kor/about" : "/eng/about"}>About</Link>
                    </li>
                    <li style={{ marginLeft: '20px' }}>
                        <Link 
                            to={currentLang === "kor" ? "/eng" : "/"}
                            className="lang-switch"
                        >
                            <span className={`lang-text ${currentLang === "kor" ? "active" : ""}`}>KOR</span>
                            <span className="lang-divider">/</span>
                            <span className={`lang-text ${currentLang === "eng" ? "active" : ""}`}>ENG</span>
                        </Link>
                    </li>
                </ul>

                {/* 모바일 햄버거 버튼 */}
                <button className="mobile-menu-btn" onClick={toggleMenu}>
                    <span></span>
                    <span></span>
                    <span></span>
                </button>

                {/* 모바일 메뉴 */}
                <div className={`mobile-menu ${isMenuOpen ? 'open' : ''}`}>
                    <ul>
                        <li>
                            <Link to={currentLang === "kor" ? "/kor" : "/eng"} onClick={() => setIsMenuOpen(false)}>Home</Link>
                        </li>
                        <li>
                            <Link to={currentLang === "kor" ? "/kor/category" : "/eng/category"} onClick={() => setIsMenuOpen(false)}>Category</Link>
                        </li>
                        <li>
                            <button
                                onClick={() => {
                                    handleDashboardClick();
                                    setIsMenuOpen(false);
                                }}
                                className="mobile-dashboard-btn"
                            >
                                Dashboard
                            </button>
                        </li>
                        <li>
                            <Link to={currentLang === "kor" ? "/kor/about" : "/eng/about"} onClick={() => setIsMenuOpen(false)}>About</Link>
                        </li>
                        <li>
                            <Link 
                                to={currentLang === "kor" ? "/eng" : "/"}
                                onClick={() => setIsMenuOpen(false)}
                                className="mobile-lang-switch"
                            >
                                <span className={`lang-text ${currentLang === "kor" ? "active" : ""}`}>KOR</span>
                                <span className="lang-divider">/</span>
                                <span className={`lang-text ${currentLang === "eng" ? "active" : ""}`}>ENG</span>
                            </Link>
                        </li>
                    </ul>
                </div>

                {/* 모바일 메뉴 오버레이 */}
                {isMenuOpen && <div className="mobile-menu-overlay" onClick={() => setIsMenuOpen(false)}></div>}
            </div>
        </header>
    );
};

export default Header;

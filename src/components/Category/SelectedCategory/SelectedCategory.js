import React from "react";
import { Link } from "gatsby";

import PostInfo from "../../Post/PostInfo";

import "./SelectedCategory.css";

const SelectedCategory = ({ selectedCategory, posts, language = "kor" }) => {
    if (!selectedCategory) {
        return null;
    }

    // 언어별 prefix 자동 추가
    const getLocalizedPath = (originalPath, lang) => {
        if (originalPath.startsWith('/kor') || originalPath.startsWith('/eng')) {
            return originalPath;
        }
        return lang === "eng" ? `/eng${originalPath}` : `/kor${originalPath}`;
    };

    return (
        <div className="category-post-list">
            {posts
                .filter(post => post.category === selectedCategory)
                .map((post, index) => {
                    const localizedPath = getLocalizedPath(post.path, language);
                    return (
                        <div key={`category-post-${index}`}>
                            <PostInfo {...post} />
                            <p className="category-post-name">
                                <Link to={localizedPath}>{post.title}</Link>
                            </p>
                            <p className="category-post-description">
                                {post.description}
                            </p>
                        </div>
                    );
                })}
        </div>
    );
};

export default SelectedCategory;

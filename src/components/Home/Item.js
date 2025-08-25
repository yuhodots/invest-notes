import React from "react";
import { Link } from "gatsby";

import PostInfo from "../Post/PostInfo";

import "./Item.scss";
import images from "../../../images";

function importAll(r) {
    return r.keys().map(r);
}

const Item = ({ item, language = "kor" }) => {
    const { title, description, path, date, category, thumbnail } = item;
    const thumbnail_path = images[thumbnail];
    
    // 언어별 prefix 자동 추가
    const getLocalizedPath = (originalPath, lang) => {
        if (originalPath.startsWith('/kor') || originalPath.startsWith('/eng')) {
            return originalPath;
        }
        return lang === "eng" ? `/eng${originalPath}` : `/kor${originalPath}`;
    };
    
    const localizedPath = getLocalizedPath(path, language);
    console.log(images)
    return (
        <li className="post-item">
            <Link to={localizedPath}>
                <div>
                    <PostInfo category={category} date={date} />
                    <h2>{title}</h2>
                    <div className="description">{description}</div>
                </div>
                {thumbnail_path && <img src={thumbnail_path} alt={category} />}
            </Link>
        </li>
    );
};

export default Item;

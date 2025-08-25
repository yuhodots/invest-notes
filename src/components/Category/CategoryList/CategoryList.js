import React from "react";

import "./CategoryList.css";

const CategoryList = ({
    categories,
    selectedCategory,
    setSelectedCategory,
    upperCategory
}) => {
    return (
        <div className="category-list">
            <div className="category-title"></div>
            {upperCategory['Strategy'].map(category => (
                <span
                    className={ `category-item ${category === selectedCategory && "selected"}` }
                    key={ `category_${category}` }
                    onClick={() => setSelectedCategory(category)}
                >
                    <span className="category-post-count" style={{background:'#e8f4fd'}}>
                        {categories[category]}
                    </span>
                    <span> {category} </span>
                </span>
            ))}
            {upperCategory['Economy'].map(category => (
                <span
                    className={ `category-item ${category === selectedCategory && "selected"}` }
                    key={ `category_${category}` }
                    onClick={() => setSelectedCategory(category)}
                >
                    <span className="category-post-count" style={{background:'#fff2e8'}}>
                        {categories[category]}
                    </span>
                    <span> {category} </span>
                </span>
            ))}
            {upperCategory['News'].map(category => (
                <span
                    className={ `category-item ${category === selectedCategory && "selected"}` }
                    key={ `category_${category}` }
                    onClick={() => setSelectedCategory(category)}
                >
                    <span className="category-post-count" style={{background:'#f0f8e8'}}>
                        {categories[category]}
                    </span>
                    <span> {category} </span>
                </span>
            ))}
        </div>
    );
};

export default CategoryList;

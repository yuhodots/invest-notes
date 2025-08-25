import React, { useState } from "react";

import CategoryList from "./CategoryList";
import SelectedCategory from "./SelectedCategory";

const Category = ({ categories, posts, language = "kor" }) => {
    const sortedCategories = Object.keys(categories).sort();
    const [selectedCategory, setSelectedCategory] = useState(
        sortedCategories[0]
    );

    const upperCategory = language === "eng" ? {
        'Strategy': ['Indicators', 'Strategy', 'Chart'],
        'Economy': ['Economics', 'Stock Analysis'],
        'News': ['Daily News'],
    } : {
        'Strategy': ['투자지표', '매매전략', '차트분석'],
        'Economy': ['경제지식', '종목분석'],
        'News': ['데일리뉴스'],
    }
    return (
        <div className="category">
            <CategoryList
                categories={categories}
                selectedCategory={selectedCategory}
                setSelectedCategory={setSelectedCategory}
                upperCategory={upperCategory}
            />
            <SelectedCategory
                posts={posts}
                selectedCategory={selectedCategory}
                language={language}
            />
        </div>
    );
};

export default Category;

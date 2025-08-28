import React, { useState } from "react";

import CategoryList from "./CategoryList";
import SelectedCategory from "./SelectedCategory";

const Category = ({ categories, posts, language = "kor" }) => {
    const sortedCategories = Object.keys(categories).sort();
    const [selectedCategory, setSelectedCategory] = useState(
        sortedCategories[0]
    );

    const upperCategory = {
        'Strategy': ['Indicators', 'Strategy', 'Chart'],
        'Economy': ['Economics', 'Stock Analysis'],
        'News': ['Daily News'],
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

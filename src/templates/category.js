import React from "react";
import { graphql, useStaticQuery } from "gatsby";

import Layout from "../components/layout";
import Category from "../components/Category";

const CategoryTemplate = ({ pageContext }) => {
  const { language = "kor" } = pageContext;
  const pathRegex = language === "eng" ? "/contents/eng/" : "/contents/kor/";
  
  const { koreanPosts, englishPosts } = useStaticQuery(graphql`
    query CategoryListQuery {
      koreanPosts: allMarkdownRemark(
        filter: { 
          frontmatter: { draft: { ne: true }, template: { eq: "post" } },
          fileAbsolutePath: { regex: "/contents/kor/" }
        }
        sort: { order: DESC, fields: [frontmatter___date] }
      ) {
        edges {
          node {
            frontmatter {
              category
              title
              date
              description
              path
            }
          }
        }
      }
      englishPosts: allMarkdownRemark(
        filter: { 
          frontmatter: { draft: { ne: true }, template: { eq: "post" } },
          fileAbsolutePath: { regex: "/contents/eng/" }
        }
        sort: { order: DESC, fields: [frontmatter___date] }
      ) {
        edges {
          node {
            frontmatter {
              category
              title
              date
              description
              path
            }
          }
        }
      }
    }
  `);
  
  // 언어별로 적절한 데이터 선택
  const selectedData = language === "eng" ? englishPosts.edges : koreanPosts.edges;

  const categories = selectedData
    .map(item => item.node.frontmatter.category)
    .reduce((acc, category) => {
      if (acc[category]) {
        acc[category] += 1;
      } else {
        acc[category] = 1;
      }
      return acc;
    }, {});

  return (
    <Layout type="category">
      <Category categories={categories} posts={selectedData.map(item => item.node.frontmatter)} language={language} />
    </Layout>
  )
};

export default CategoryTemplate;
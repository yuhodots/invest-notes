/**
 * Implement Gatsby's Node APIs in this file.
 *
 * See: https://www.gatsbyjs.com/docs/node-apis/
 */

// You can delete this file if you're not using it
const path = require("path");
const { createFilePath } = require('gatsby-source-filesystem');

exports.createPages = ({ actions, graphql }) => {
    const { createPage } = actions;
    const IndexTemplate = path.resolve("src/templates/index.js");
    const IndexEngTemplate = path.resolve("src/templates/index-eng.js");
    const PostTemplate = path.resolve("src/templates/post.js");
    const CategoryTemplate = path.resolve("src/templates/category.js");
    const AboutTemplate = path.resolve("src/templates/about.js");
    

    // Default root redirects to Korean
    createPage({
        path: "/",
        component: IndexTemplate,
        context: { language: "kor" }
    });
    
    // Korean pages
    createPage({
        path: "/kor",
        component: IndexTemplate,
        context: { language: "kor" }
    });
    
    createPage({
        path: "/kor/category",
        component: CategoryTemplate,
        context: { language: "kor" }
    });

    createPage({
        path: "/kor/about",
        component: AboutTemplate,
        context: { language: "kor" }
    });
    
    // English pages
    createPage({
        path: "/eng",
        component: IndexEngTemplate,
        context: { language: "eng" }
    });
    
    createPage({
        path: "/eng/category",
        component: CategoryTemplate,
        context: { language: "eng" }
    });

    createPage({
        path: "/eng/about",
        component: AboutTemplate,
        context: { language: "eng" }
    });

    return graphql(`
        {
            koreanPosts: allMarkdownRemark(
                filter: {
                    frontmatter: {
                        draft: { ne: true }
                        template: { eq: "post" }
                    }
                    fileAbsolutePath: { regex: "/contents/kor/" }
                }
                sort: { order: DESC, fields: [frontmatter___date] }
                limit: 1000
            ) {
                edges {
                    node {
                        frontmatter {
                            path
                        }
                        fileAbsolutePath
                    }
                }
            }
            englishPosts: allMarkdownRemark(
                filter: {
                    frontmatter: {
                        draft: { ne: true }
                        template: { eq: "post" }
                    }
                    fileAbsolutePath: { regex: "/contents/eng/" }
                }
                sort: { order: DESC, fields: [frontmatter___date] }
                limit: 1000
            ) {
                edges {
                    node {
                        frontmatter {
                            path
                        }
                        fileAbsolutePath
                    }
                }
            }
        }
    `).then(result => {
        if (result.errors) {
            return Promise.reject(result.errors);
        }
        
        // 한국어 게시글 생성 (prefix: /kor)
        result.data.koreanPosts.edges.forEach(({ node }) => {
            const originalPath = node.frontmatter.path;
            const koreanPath = originalPath.startsWith('/kor') ? originalPath : `/kor${originalPath}`;
            
            createPage({
                path: koreanPath,
                component: PostTemplate,
                context: { 
                    language: "kor",
                    postPath: originalPath
                }
            });
        });
        
        // 영어 게시글 생성 (prefix: /eng)
        result.data.englishPosts.edges.forEach(({ node }) => {
            const originalPath = node.frontmatter.path;
            const englishPath = originalPath.startsWith('/eng') ? originalPath : `/eng${originalPath}`;
            
            createPage({
                path: englishPath,
                component: PostTemplate,
                context: { 
                    language: "eng",
                    postPath: originalPath
                }
            });
        });
    });
};

exports.onCreateNode = ({ node, actions, getNode }) => {
    const { createNodeField } = actions;
  
    if (node.internal.type === `MarkdownRemark`) {
      const value = createFilePath({ node, getNode });
      createNodeField({
        name: `slug`,
        node,
        value,
      });
    }
  };
import React from "react";
import { graphql } from "gatsby";
import '../../node_modules/katex/dist/katex.min.css';

import Layout from "components/layout";
import Post from "components/Post";
import SEO from "components/seo";

const PostTemplate = ({ data, pageContext }) => {
    const { allMarkdownRemark } = data;
    const language = pageContext?.language || 'kor';
    
    // 언어에 맞는 파일 선택
    const markdownRemark = allMarkdownRemark.edges.find(edge => 
        edge.node.fileAbsolutePath.includes(`/contents/${language}/`)
    )?.node || allMarkdownRemark.edges[0]?.node;
    
    const frontmatter = markdownRemark?.frontmatter;
    const html = markdownRemark?.html;
    const tocItems = markdownRemark?.tableOfContents;
    return (
        <Layout type="post">
            <SEO title={frontmatter.title} />
            <Post {...frontmatter} html={html} tocItems={tocItems}/>
        </Layout>
    );
};

export default PostTemplate;

export const pageQuery = graphql`
    query($postPath: String!) {
        allMarkdownRemark(
            filter: {
                frontmatter: { path: { eq: $postPath } }
            }
        ) {
            edges {
                node {
                    html
                    tableOfContents
                    fileAbsolutePath
                    frontmatter {
                        path
                        title
                        category
                        date(formatString: "YYYY-MM-DD")
                    }
                }
            }
        }
    }
`;
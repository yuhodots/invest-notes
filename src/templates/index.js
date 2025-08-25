import React from "react";
import { graphql, useStaticQuery } from "gatsby";

import Layout from "components/layout";
import SEO from "components/seo";
import Home from "components/Home";

const IndexTemplate = () => {
    const {
      allMarkdownRemark: { edges: data }
    } = useStaticQuery(graphql`
        query PostListKorQuery {
            allMarkdownRemark(
                filter: {
                    frontmatter: {
                        draft: { ne: true }
                        template: { eq: "post" }
                    }
                    fileAbsolutePath: { regex: "/contents/kor/" }
                }
                sort: { order: DESC, fields: [frontmatter___date] }
            ) {
                edges {
                    node {
                        frontmatter {
                            description
                            title
                            path
                            date
                            category
                        }
                    }
                }
            }
        }
    `);

    return (
        <Layout type="main">
            <SEO title="Home" />
            <Home posts={data} language="kor" />
        </Layout>
    );
};

export default IndexTemplate;

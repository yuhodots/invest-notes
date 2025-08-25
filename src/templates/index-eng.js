import React from "react";
import { graphql, useStaticQuery } from "gatsby";

import Layout from "components/layout";
import SEO from "components/seo";
import Home from "components/Home";

const IndexEngTemplate = () => {
    const {
      allMarkdownRemark: { edges: data }
    } = useStaticQuery(graphql`
        query PostListEngQuery {
            allMarkdownRemark(
                filter: {
                    frontmatter: {
                        draft: { ne: true }
                        template: { eq: "post" }
                    }
                    fileAbsolutePath: { regex: "/contents/eng/" }
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
            <SEO title="Home - English" />
            <Home posts={data} language="eng" />
        </Layout>
    );
};

export default IndexEngTemplate;
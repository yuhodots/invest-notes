import React from "react";
import { graphql, useStaticQuery } from "gatsby";

import Layout from "components/layout";
import About from "../components/About"

const AboutTemplate = ({ pageContext }) => {
    const { allMarkdownRemark: { edges: data } }= useStaticQuery(graphql`
      {
        allMarkdownRemark(
          filter: {
            frontmatter: {
              title: { eq:"about" }
            }
          }
        ) {
          edges {
            node {
              html
              fileAbsolutePath
            }
          }
        }
      }
    `);
    
    const languageFolder = pageContext.language || 'kor';
    const aboutData = data.find(edge => 
        edge.node.fileAbsolutePath.includes(`/contents/${languageFolder}/`)
    ) || data[0];
    return (
        <Layout type="about">
            <About html={aboutData.node.html}/>
        </Layout>
    );
};

export default AboutTemplate;

import React from "react";
import PropTypes from "prop-types";
import { graphql } from "gatsby";
import Layout from "../components/Layout";
import Content, { HTMLContent } from "../components/Content";
import CircleLayout from "../components/CircleLayout";
import { Fade } from "../animations";
import PageLayout from "../components/PageLayout";
import { LogoSmall } from "../components/logo";
import PreviewCompatibleImage from "../components/PreviewCompatibleImage";
import "../styles/marmalade.scss";

export const MarmaladePageTemplate = ({
  title,
  content,
  image,
  contentComponent
}) => {
  const PageContent = contentComponent || Content;

  return (
    <Fade>
      {style => (
        <div style={style}>
          <LogoSmall className="pos-abs logo-small--top-right" />
          <div className="flex-container flex-center container-full background-blue">
            <div className="marmalade-background" />
            <PreviewCompatibleImage
              className="marmalade-cover"
              imageInfo={image}
            />
          </div>
        </div>
      )}
    </Fade>
  );
};

MarmaladePageTemplate.propTypes = {
  title: PropTypes.string.isRequired,
  content: PropTypes.string,

  contentComponent: PropTypes.func
};

const MarmaladePage = ({ data }) => {
  const { markdownRemark: post } = data;

  return (
    <MarmaladePageTemplate
      contentComponent={HTMLContent}
      title={post.frontmatter.title}
      content={post.html}
      image={post.frontmatter.image}
    />
  );
};

MarmaladePage.propTypes = {
  data: PropTypes.object.isRequired
};

export default MarmaladePage;

export const marmaladePageQuery = graphql`
  query MarmaladePage($id: String!) {
    markdownRemark(id: { eq: $id }) {
      html
      frontmatter {
        path
        title
        image {
          childImageSharp {
            fluid(maxWidth: 1000, quality: 80) {
              ...GatsbyImageSharpFluid
            }
          }
        }
      }
    }
  }
`;

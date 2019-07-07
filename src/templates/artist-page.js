import React from "react";
import PropTypes from "prop-types";
import { kebabCase } from "lodash";
import Helmet from "react-helmet";
import { graphql, Link } from "gatsby";
import Content, { HTMLContent, MarkdownContent } from "../components/Content";
import SocialLink from "../components/SocialLink";
import PageLayout from "../components/PageLayout";
import PreviewCompatibleImage from "../components/PreviewCompatibleImage";
import WatchConnection from "../components/WatchConnection";
import OfflineError from "../components/OfflineError";
import ToggleClass from "../components/ToggleClass";

export const ArtistPageTemplate = ({
  contentComponent,
  content,
  name,
  about,
  links,
  helmet,
  profileImage
}) => {
  const PostContent = contentComponent || Content;
  console.log(about);

  return (
    <PageLayout
      header={
        <div className="page-header page-header__page flex-container">
          <div className="flex-container flex-container__column flex-1 flex-1 justify-end">
            <h2>{name}</h2>
            <div className="social-links__page">
              {links &&
                links.map((link, i) => (
                  <SocialLink
                    title={link.label}
                    url={link.url}
                    icon={link.icon}
                  />
                ))}
            </div>
          </div>
          <div className="flex-1 page-cover__container">
            <PreviewCompatibleImage imageInfo={profileImage} />
          </div>
        </div>
      }
      backgroundColor="pearl"
    >
      {helmet || ""}
      <section className="flex-container__column">
        <div className="single-page">
          <PostContent content={about} />
          {content && (
            <div>
              <h2 className="heading heading-dark">About</h2>
            </div>
          )}
        </div>
      </section>
    </PageLayout>
  );
};

ArtistPageTemplate.propTypes = {
  content: PropTypes.node.isRequired,
  contentComponent: PropTypes.func,
  title: PropTypes.string,
  links: PropTypes.array,
  name: PropTypes.string,
  helmet: PropTypes.object
};

const ArtistPage = ({ data }) => {
  const { markdownRemark: post } = data;

  return (
    <ArtistPageTemplate
      contentComponent={MarkdownContent}
      name={post.frontmatter.name}
      content={post.html}
      profileImage={post.frontmatter.profileImage}
      links={post.frontmatter.links}
      about={post.frontmatter.about}
    />
  );
};

ArtistPage.propTypes = {
  data: PropTypes.shape({
    markdownRemark: PropTypes.object
  })
};

export default ArtistPage;

export const pageQuery = graphql`
  query ArtistPageByID($id: String!) {
    markdownRemark(id: { eq: $id }) {
      id
      html
      frontmatter {
        name
        links {
          label
          url
          icon
        }
        about
        profileImage {
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

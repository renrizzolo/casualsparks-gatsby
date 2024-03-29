import React from "react";
import PropTypes from "prop-types";
import { graphql } from "gatsby";
import PageLayout from "../../components/PageLayout";
import ReleaseItem from "../../components/ReleaseItem";

const ReleasePageTemplate = ({ title, sections, children }) => {
  return (
    <PageLayout title={"Latest Releases"} backgroundColor="pearl">
      <div className="item-grid">{children}</div>
    </PageLayout>
  );
};
export default class IndexPage extends React.Component {
  render() {
    const { data } = this.props;
    const { edges: posts } = data.allMarkdownRemark;

    return (
      <ReleasePageTemplate backgroundColor="pearl">
        {posts.map(({ node: post }) => (
          <ReleaseItem
            key={post.id}
            slug={post.fields.slug}
            data={post.frontmatter}
          />
        ))}
      </ReleasePageTemplate>
    );
  }
}

IndexPage.propTypes = {
  data: PropTypes.shape({
    allMarkdownRemark: PropTypes.shape({
      edges: PropTypes.array,
    }),
  }),
};

export const releaseFrontmatterFragment = graphql`
  fragment ReleaseFrontmatter on MarkdownRemark {
    frontmatter {
      title
      templateKey
      date(formatString: "MMM DD, YYYY")
      datenum: date
      artist
      trackList
      soundcloudUrl
      links {
        label
        url
        icon
      }
      previewHTML
      releaseType
      image {
        childImageSharp {
          gatsbyImageData(width: 600, quality: 75)
        }
      }
    }
  }
`;

export const pageQuery = graphql`
  query IndexQuery {
    allMarkdownRemark(
      sort: { order: DESC, fields: [frontmatter___date] }
      filter: { frontmatter: { templateKey: { eq: "release-post" } } }
    ) {
      edges {
        node {
          id
          excerpt(pruneLength: 400)
          fields {
            slug
          }
          ...ReleaseFrontmatter
        }
      }
    }
  }
`;

import React from 'react'
import PropTypes from 'prop-types'
import { Link, graphql } from 'gatsby'
import PageLayout from '../../components/PageLayout';

const ReleasePageTemplate = ({ title, sections, children }) => {
  return (
    <PageLayout title={'Latest Releases'} backgroundColor="pearl">
      {children}
    </PageLayout>
  );
}
export default class IndexPage extends React.Component {
  render() {
    const { data } = this.props
    const { edges: posts } = data.allMarkdownRemark

    return (
      <ReleasePageTemplate backgroundColor="pearl">
        {posts
          .map(({ node: post }) => (
            <div
              className="post-item"
              key={post.id}
            >
              <p>
                <Link to={post.fields.slug}>
                  {post.frontmatter.title}
                </Link>
                <span> &bull; </span>
                <small>{post.frontmatter.date}</small>
              </p>
              <p>
                {post.excerpt}
              </p>
                <Link className="button" to={post.fields.slug}>
                  View →
                </Link>
            </div>
        ))}
      </ReleasePageTemplate>
    )
  }
}

IndexPage.propTypes = {
  data: PropTypes.shape({
    allMarkdownRemark: PropTypes.shape({
      edges: PropTypes.array,
    }),
  }),
}

export const pageQuery = graphql`
  query IndexQuery {
    allMarkdownRemark(
      sort: { order: DESC, fields: [frontmatter___date] },
      filter: { frontmatter: { templateKey: { eq: "release-post" } }}
    ) {
      edges {
        node {
          id
          excerpt(pruneLength: 400)
          fields {
            slug
          }
          frontmatter {
            title
            templateKey
            date(formatString: "MMMM DD, YYYY")
            artist
            releaseType
            image {
              childImageSharp {
                fluid(maxWidth: 2048, quality: 100) {
                  ...GatsbyImageSharpFluid
                }
              }
            }
          }
        }
      }
    }
  }`

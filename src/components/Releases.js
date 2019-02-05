import React from 'react'
import PropTypes from 'prop-types'
import { StaticQuery, graphql } from 'gatsby'
import ReleaseItem from './ReleaseItem'
import { Trail, config } from 'react-spring'

const Releases = ({ section }) => {
  console.log(section)

  return (
    <StaticQuery
      query={graphql`
        query ReleasesQuery {
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
      `}
    >
      {data =>
        data && data.allMarkdownRemark && data.allMarkdownRemark.edges ? (
          <Trail
          native
            items={data.allMarkdownRemark.edges.filter(
              ({ node: post }) => post.frontmatter.releaseType === section.type
            )}
            keys={({ node: post }) => post.id}
            from={{ opacity: 0 }}
            to={{ opacity: 1 }}
            config={config.gentle}
          >
            {({ node: post }) => props => (
              <ReleaseItem
                style={props}
                slug={post.fields.slug}
                data={post.frontmatter}
              />
            )}
          </Trail>
        ) : (
          <p>Hmmm. there's nothing here yet.</p>
        )
      }
    </StaticQuery>
  )
}

Releases.propTypes = {}

export default Releases

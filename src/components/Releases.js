import React from 'react'
import PropTypes from 'prop-types'
import { StaticQuery, graphql } from 'gatsby'
import ReleaseItem from './ReleaseItem'

const Releases = ({section}) => {
  console.log(section);
  
  return (
    <StaticQuery
      query={graphql`
							query ReleasesQuery {
									allMarkdownRemark (
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
												...ReleaseFrontmatter 
											}
										}
									}
								}
							`}
    >
      {data => data && data.allMarkdownRemark &&  data.allMarkdownRemark.edges ? data.allMarkdownRemark.edges
        .filter(({ node: post }) => post.frontmatter.releaseType === section.type)
        .map(({node: post}) => {
          console.log(post);
          return (
            <ReleaseItem
              key={post.id}
              slug={post.fields.slug}
              data={post.frontmatter}
            />
          )
        }
        )
        :
        <p>Hmmm. there's nothing here yet.</p>
      }
    </StaticQuery>
  )
}

Releases.propTypes = {

}

export default Releases

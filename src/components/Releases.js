import React from 'react'
import PropTypes from 'prop-types'
import { StaticQuery, graphql } from 'gatsby'
import ReleaseItem from './ReleaseItem'
import { Trail } from 'react-spring'

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
      {data => data && data.allMarkdownRemark &&  data.allMarkdownRemark.edges ?           
        <Trail
          items={data.allMarkdownRemark.edges.filter(({ node: post }) => post.frontmatter.releaseType === section.type)}
          keys={item => item.key}
          from={{ transform: 'translate3d(0,-40px,0)' }}
          to={{ transform: 'translate3d(0,0px,0)' }}>
          {({ node: post }) => props =>
              <ReleaseItem
                style={props}
                key={post.id}
                slug={post.fields.slug}
                data={post.frontmatter}
              />
          }
        </Trail>
        
        :
        <p>Hmmm. there's nothing here yet.</p>
      }
    </StaticQuery>
  )
}

Releases.propTypes = {

}

export default Releases

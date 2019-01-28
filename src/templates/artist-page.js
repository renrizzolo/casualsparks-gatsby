import React from 'react'
import PropTypes from 'prop-types'
import { kebabCase } from 'lodash'
import Helmet from 'react-helmet'
import { graphql, Link } from 'gatsby'
import Content, { HTMLContent } from '../components/Content'
import PageLayout from '../components/PageLayout'
import PreviewCompatibleImage from '../components/PreviewCompatibleImage'
import WatchConnection from '../components/WatchConnection'
import OfflineError from '../components/OfflineError'
import ToggleClass from '../components/ToggleClass'

export const ArtistPageTemplate = ({
  contentComponent,
  content,
  name,
  links,
  helmet,
  profileImage,
}) => {
  const PostContent = contentComponent || Content

  return (
    <PageLayout
      header={
        <div className="page-header flex-container">
          <div className="flex-1">
            <h2>{name}</h2>
          </div>
          <div className="flex-1 release-cover__container">
            <PreviewCompatibleImage imageInfo={profileImage} />
          </div>
        </div>
      }
      backgroundColor="pearl"
    >
      {helmet || ''}
      <section className="flex-container__column">
      {
        links && links.map((link, i) => (
          <a className="button item-link" href={link.url}>{link.label}</a>
        ))
      }
        <div className="single-artist">
          {content && (
            <div>
              <h2 className="heading heading-dark">About</h2>
              <PostContent content={content} />
            </div>
          )}
        </div>
      </section>
    </PageLayout>
  )
}

ArtistPageTemplate.propTypes = {
  content: PropTypes.node.isRequired,
  contentComponent: PropTypes.func,
  title: PropTypes.string,
  links: PropTypes.array,
  name: PropTypes.string,
  helmet: PropTypes.object,
}

const ArtistPage = ({ data }) => {
  const { markdownRemark: post } = data

  return (
    <ArtistPageTemplate
      contentComponent={HTMLContent}
      name={post.frontmatter.name}
      content={post.html}
      profileImage={post.frontmatter.profileImage}
      links={post.frontmatter.links}
    />
  )
}

ArtistPage.propTypes = {
  data: PropTypes.shape({
    markdownRemark: PropTypes.object,
  }),
}

export default ArtistPage

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
`

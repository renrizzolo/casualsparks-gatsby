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

export const ReleasePostTemplate = ({
  contentComponent,
  content,
  title,
  artist,
  image,
  links,
  trackList,
  previewHTML,
  releaseType,
  helmet,
}) => {

  return (
    <PageLayout 
      header={
        <div className="page-header flex-container">
          <div className="flex-1">
            <h2>{artist}</h2>
            <h1>{title}</h1>
          </div>
          <div className="flex-1 release-cover__container">
            <PreviewCompatibleImage imageInfo={image} />
          </div>
        </div>
      } 
      backgroundColor="pearl"
    >
      {helmet || ''}
        <section className="flex-container__column">
          <div className="single-release">
            <ReleaseItem
              contentComponent={contentComponent}
              content={content}
              links={links}
              trackList={trackList}
              previewHTML={previewHTML}
            />
          </div>
        </section> 
    </PageLayout>
  )
}

const ReleaseItem = ({ content, contentComponent, links, trackList, previewHTML}) => {
  const PostContent = contentComponent || Content

  return (
    <div className="item">
      <header>
        <div className="item-info">
          <div className="link-container">
            {links && links.map((link) => (
              <a 
                key={link.label} 
                target="_blank" 
                rel="noopener" 
                className="button light-blue shop-link" 
                href={link.url}
              >
                {link.label}
              </a>
            ))
            }
          </div>
        </div>
      </header>
      {content &&
        <div>
          <h2 className="heading heading-dark">Info</h2>
          <PostContent content={content} />
        </div>
      }
      {trackList &&
        <aside>
          <ToggleClass className="track-list" toggleClass="expanded">
            {toggle =>
              <div>
                <h2 onMouseUp={toggle}>Track list <span></span></h2>
                <ol>
                  {trackList.map((track, i) => (
                    <li key={i}>{track}</li>
                  ))
                  }
                </ol>
              </div>
            }
          </ToggleClass>
        </aside>
      }
      {previewHTML &&
        <div>
          <h2 className="heading heading-dark">Preview</h2>
          <WatchConnection render={online => (
            online ?
              <div dangerouslySetInnerHTML={{ __html: previewHTML }} />
              :
              <OfflineError />
          )} />
        </div>
      }
    </div>
  )
}

ReleasePostTemplate.propTypes = {
  content: PropTypes.node.isRequired,
  contentComponent: PropTypes.func,
  description: PropTypes.string,
  title: PropTypes.string,
  helmet: PropTypes.object,
}

const ReleasePost = ({ data }) => {
  const { markdownRemark: post } = data
  console.log(post);
  
  return (
      <ReleasePostTemplate
        contentComponent={HTMLContent}
        content={post.html}
        description={post.frontmatter.description}
        helmet={
          <Helmet
            titleTemplate="%s | Release"
          >
            <title>{`${post.frontmatter.title}`}</title>
            <meta name="description" content={`${post.frontmatter.artist} - ${post.frontmatter.title}`} />
          </Helmet>
        }
        title={post.frontmatter.title}
        artist={post.frontmatter.artist}
        image={post.frontmatter.image}
        links={post.frontmatter.links}
        trackList={post.frontmatter.trackList}
        previewHTML={post.frontmatter.previewHTML}
      />
  )
}

ReleasePost.propTypes = {
  data: PropTypes.shape({
    markdownRemark: PropTypes.object,
  }),
}

export default ReleasePost

export const pageQuery = graphql`
  query ReleasePostByID($id: String!) {
    markdownRemark(id: { eq: $id }) {
      id
      html
      ...ReleaseFrontmatter
    }
  }
`
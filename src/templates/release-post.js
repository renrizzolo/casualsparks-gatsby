import React from 'react'
import PropTypes from 'prop-types'
import { kebabCase } from 'lodash'
import Helmet from 'react-helmet'
import { graphql, Link } from 'gatsby'
import Content, { HTMLContent } from '../components/Content'
import {Icon} from '../img/icons'
import PageLayout from '../components/PageLayout'
import PreviewCompatibleImage from '../components/PreviewCompatibleImage'
import WatchConnection from '../components/WatchConnection'
import OfflineError from '../components/OfflineError'
import ToggleClass from '../components/ToggleClass'
import PlayButton from '../components/PlayButton'
import ItemButton from "../components/ItemButton";

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
  soundcloudUrl,
  helmet,
}) => {
  return (
    <PageLayout
      header={
        <div className="page-header page-header__page flex-container">
          <div className="flex-1 flex-container__column justify-end align-start">
            <PlayButton soundcloudUrl={soundcloudUrl} />
            <h2>{artist}</h2>
            <h1>{title}</h1>
          </div>
          <div className="flex-1 page-cover__container">
            {image && <PreviewCompatibleImage imageInfo={image} />}
          </div>
        </div>
      }
      backgroundColor="pearl"
    >
      {helmet || ''}
      <section className="flex-container__column">
        <div className="single-page">
          <ReleaseItem
            contentComponent={contentComponent}
            content={content}
            links={links}
            trackList={trackList}
            previewHTML={previewHTML}
            soundcloudUrl={soundcloudUrl}
          />
        </div>
      </section>
    </PageLayout>
  )
}

const ReleaseItem = ({
  content,
  contentComponent,
  links,
  trackList,
  previewHTML,
  soundcloudUrl,
}) => {
  const PostContent = contentComponent || Content

  return (
    <div className="item">
      <header>
        <div className="item-info">
          <div className="link-container">
            {links &&
              links.map(link => (
                <ItemButton
                  small
                  key={link.label}
                  label={link.label}
                  href={link.url}
                  iconName={link.label.toLowerCase()}
                />

              ))}
            {soundcloudUrl && (
              <ItemButton
                small
                label="SoundCloud"
                href={soundcloudUrl}
                iconName="soundcloud"
                iconStyle={{ fill: "#f50", marginRight: 6 }}
              />
            )}
          </div>
        </div>
      </header>
      {content && (
        <div>
          <h2 className="heading heading-dark">Info</h2>
          <PostContent content={content} />
        </div>
      )}
      {/* trackList && (
        <aside>
          <ToggleClass className="track-list" toggleClass="expanded">
            {toggle => (
              <div>
                <h2 onMouseUp={toggle}>
                  Track list <span />
                </h2>
                <ol>
                  {trackList.map((track, i) => (
                    <li key={i}>{track}</li>
                  ))}
                </ol>
              </div>
            )}
          </ToggleClass>
        </aside>
      ) */}
    </div>
  )
}

ReleasePostTemplate.propTypes = {
  content: PropTypes.node.isRequired,
  contentComponent: PropTypes.func,
  helmet: PropTypes.object,
  title: PropTypes.string,
  artist: PropTypes.string,
  soundcloudUrl: PropTypes.string,
  image: PropTypes.object,
  links: PropTypes.array,
  trackList: PropTypes.array,
  previewHTM: PropTypes.string,
  soundcloudUrl: PropTypes.string,
}

const ReleasePost = ({ data }) => {
  const { markdownRemark: post } = data
  console.log(post)

  return (
    <ReleasePostTemplate
      contentComponent={HTMLContent}
      content={post.html}
      helmet={
        <Helmet titleTemplate="%s | Release">
          <title>{`${post.frontmatter.title}`}</title>
          <meta
            name="description"
            content={`${post.frontmatter.artist} - ${post.frontmatter.title}`}
          />
        </Helmet>
      }
      title={post.frontmatter.title}
      artist={post.frontmatter.artist}
      soundcloudUrl={post.frontmatter.soundcloudUrl}
      image={post.frontmatter.image}
      links={post.frontmatter.links}
      trackList={post.frontmatter.trackList}
      previewHTML={post.frontmatter.previewHTML}
      soundcloudUrl={post.frontmatter.soundcloudUrl}
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

import React from 'react'
import PropTypes from 'prop-types'
import showdown from 'showdown'

const converter = new showdown.Converter()

export const MarkdownContent = ({ content, className }) => (
  <div
    className={className}
    dangerouslySetInnerHTML={{ __html: converter.makeHtml(content) }}
  />
)

MarkdownContent.propTypes = {
  content: PropTypes.string,
  className: PropTypes.string,
}

export const HTMLContent = ({ content, className }) => (
  <div className={className} dangerouslySetInnerHTML={{ __html: content }} />
)

const Content = ({ content, className }) => (
  <div className={className}>{content}</div>
)

Content.propTypes = {
  content: PropTypes.node,
  className: PropTypes.string,
}

HTMLContent.propTypes = Content.propTypes

export default Content

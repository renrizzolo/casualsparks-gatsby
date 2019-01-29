import React from 'react'
import PropTypes from 'prop-types'
import { Icon } from '../../img/icons'

const SocialLink = ({ url, title, icon }) => {
  return url ? (
    <a className="social-link" href={url} title={title}>
      {icon && <Icon name={icon} />}
      {title}
    </a>
  ) : (
    <p>{title}</p>
  )
}

SocialLink.propTypes = {
  url: PropTypes.string,
  title: PropTypes.string.isRequired,
  icon: PropTypes.string,
}

export default SocialLink

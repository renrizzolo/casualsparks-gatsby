import React from 'react'
import { Icon } from '../../../img/icons'

const ControlButton = ({ className, fn, icon, size }) => (
  <a onClick={fn} className={`sc-player__button ${className}`}>
    <Icon name={icon} size={size} className={`sc-player__icon ${className}`} />
  </a>
)

export default ControlButton

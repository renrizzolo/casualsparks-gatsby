import React from 'react';
import { Icon } from '../../../img/icons';

const ControlButton = ({ disabled, className, fn, icon, size }) => (
  <button
    onClick={!disabled ? fn : undefined}
    className={`sc-player__button ${className}`}
  >
    <Icon name={icon} size={size} className={`sc-player__icon ${className}`} />
  </button>
);

export default ControlButton;

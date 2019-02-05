import React from "react";
import { Icon } from '../../img/icons'

const ItemButton = ({
  small,
  className,
  label,
  href,
  iconStyle,
  iconName,
  iconSize
}) => {
  return (
    <a
      target="_blank"
      rel="noopener"
      className={`item-button ${small ? "item-button__small" : ''} ${
        className ? className : ''
      }`}
      href={href}
    >
      <Icon style={iconStyle} size={iconSize} name={iconName} />
      {label}
    </a>
  );
};

ItemButton.defaultProps = {
  iconSize: 16,
  iconStyle: { marginRight: 6 },
  small: false
};
export default ItemButton;

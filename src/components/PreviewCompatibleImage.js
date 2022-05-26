import React from "react";
import PropTypes from "prop-types";
import { GatsbyImage, getImage } from "gatsby-plugin-image";

const PreviewCompatibleImage = ({ imageInfo, className }) => {
  const imageStyle = {
    width: "100%",
    height: "auto",
    // maxWidth: 500,
  };

  const img = getImage(imageInfo.childImageSharp);

  const { alt = "", childImageSharp, image } = imageInfo;

  if (!!image && !!image.childImageSharp) {
    return (
      <GatsbyImage
        className={className}
        style={imageStyle}
        // fluid={image.childImageSharp.fluid}
        image={img}
        alt={alt}
      />
    );
  }

  if (!!childImageSharp) {
    return (
      <GatsbyImage
        className={className}
        style={imageStyle}
        image={img}
        // fluid={childImageSharp.fluid}
        alt={alt}
      />
    );
  }

  if (!!image && typeof image === "string")
    return (
      <img className={className} style={imageStyle} src={image} alt={alt} />
    );

  return null;
};

PreviewCompatibleImage.propTypes = {
  imageInfo: PropTypes.shape({
    alt: PropTypes.string,
    childImageSharp: PropTypes.object,
    // image: PropTypes.oneOfType([PropTypes.object, PropTypes.string]).isRequired,
    style: PropTypes.object,
  }).isRequired,
};

export default PreviewCompatibleImage;

import React from 'react';
import PropTypes from 'prop-types';
import { ReleasePostTemplate } from '../../templates/release-post';

const ReleasePostPreview = ({ entry, getAsset }) => {
  const entryLinks = entry.getIn(['data', 'Links']);
  const links = entryLinks ? entryLinks.toJS() : [];

  return (
    <ReleasePostTemplate
      content={entry.getIn(['data', 'html'])}
      artist={entry.getIn(['data', 'artist'])}
      image={entry.getIn(['data', 'image'])}
      links={links}
      trackList={entry.getIn(['data', 'trackList'])}
      previewHTML={entry.getIn(['data', 'previewHTML'])}
      title={entry.getIn(['data', 'title'])}
    />
  );
};

ReleasePostPreview.propTypes = {
  entry: PropTypes.shape({
    getIn: PropTypes.func,
  }),
  getAsset: PropTypes.func,
};

export default ReleasePostPreview;

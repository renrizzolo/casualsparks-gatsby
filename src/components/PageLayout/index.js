import React from 'react';
import PropTypes from 'prop-types';

const PageLayout = ({title, backgroundColor, children}) => {
	return (
    <div className={`background-cover background-${backgroundColor}`}>
      {title &&
        <div className="page-header">
          <h1 className="jumbo-heading">{title}</h1>
        </div>
      }
      <main className="full-page-container flex-container__column">
        {children}
      </main>
		</div>
	);
}

PageLayout.propTypes = {
  title: PropTypes.string.isRequired,
  backgroundColor: PropTypes.string,
}
PageLayout.defaultProps = {
  backgroundColor: 'blue'
}
export default PageLayout;
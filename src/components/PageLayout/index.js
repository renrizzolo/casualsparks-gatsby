import React from 'react'
import PropTypes from 'prop-types'

const PageLayout = ({ title, header, backgroundColor, children }) => {
  return (
    <header className={`background-cover background-${backgroundColor}`}>
      {title && (
        <div className="page-header">
          <h1 className="jumbo-heading">{title}</h1>
        </div>
      )}
      {header && header}
      <main className="full-page-container flex-container__column">
        {children}
      </main>
    </header>
  )
}

PageLayout.propTypes = {
  title: PropTypes.string,
  header: PropTypes.object,
  backgroundColor: PropTypes.string,
}
PageLayout.defaultProps = {
  backgroundColor: 'blue',
}
export default PageLayout

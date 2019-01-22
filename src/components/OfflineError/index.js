import React from 'react';

const OfflineError = (props) => (
	<div className="error notice">
		<h2 className="sans">{props.heading}</h2>
		<small>{props.text}</small>
	</div>
)

OfflineError.defaultProps = {
	heading: 'Can\'t load stream :(',
	text: 'Your connection has been lost. Please try again when you find it.'
}
export default OfflineError;
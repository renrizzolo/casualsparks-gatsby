import React from 'react';

class WatchConnection extends React.Component {
	state = {
	online: true
	}

	componentWillMount() {
		this.setState({online: window.navigator.onLine});
		window.addEventListener('online', this.watchConnection);
		window.addEventListener('offline', this.watchConnection);

	}
	componentWillUnmount() {
		window.removeEventListener('online', this.watchConnection);
		window.removeEventListener('offline', this.watchConnection);
	}
	watchConnection = (e) => {
		console.log(e);
		this.setState({online: e.type === 'online'});
	}

	render() {
		return(
		<div>
			{this.props.render(this.state.online)}
		</div>
		)
	}
}
export default WatchConnection;
import React from 'react';

class ToggleClass extends React.Component {
	state = {
	toggled: false
	}

	toggle = () => {
		this.setState(state => ({
				toggled: !state.toggled
			})
		);
	}

	render() {
		const { className, toggleClass } = this.props;

		const { toggled } = this.state;
		return(
			<div className={toggled ? `${className} ${toggleClass}` : className}>
				{this.props.children(this.toggle)}
			</div>
		)
	}
}
export default ToggleClass;
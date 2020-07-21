import React, { PureComponent } from "react";

class Waveform extends PureComponent {
  state = {
    prospectiveSeek: 0,
  };

  waveFormHover = (e, duration) => {
    const percent = e.nativeEvent.offsetX / e.target.offsetWidth;
    this.setState({
      prospectiveSeek: percent * duration,
    });
    console.log(percent, duration, this.state.prospectiveSeek);
  };
  resetProspectiveSeek = () => {
    this.setState({
      prospectiveSeek: 0,
    });
  };

  render() {
    const { seek, currentTrack, currentTime } = this.props;
    const { prospectiveSeek } = this.state;
    const duration = currentTrack.duration / 1000;
    return (
      <div
        className="sc-player__waveform"
        onClick={seek}
        onMouseOut={this.resetProspectiveSeek}
        onMouseMove={(e) => this.waveFormHover(e, duration)}
      >
        <span
          className="sc-player__seek sc-player__prospective-seek"
          style={{
            width: `${
              prospectiveSeek > 0
                ? (prospectiveSeek / duration) * 100
                : (currentTime / duration) * 100
            }%`,
          }}
        />

        <span
          className="sc-player__seek"
          style={{
            width: `${(currentTime / duration) * 100}%`,
          }}
        />
        <img src={currentTrack.waveform_url} alt="" />
      </div>
    );
  }
}

export default Waveform;

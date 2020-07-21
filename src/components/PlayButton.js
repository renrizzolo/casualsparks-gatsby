import React from "react";
import { SC } from "./SoundcloudPlayer";
import { Icon } from "../img/icons";
import "../styles/common/play-button.scss";
const PlayButton = ({ soundcloudUrl, full }) => {
  return soundcloudUrl ? (
    <SC.Consumer>
      {({
        updateTrack,
        currentTrack,
        currentPlaylistUrl,
        playing,
        controls: { stop },
      }) => {
        const isPlaying =
          (soundcloudUrl === currentTrack.permalink_url && playing) ||
          (currentPlaylistUrl &&
            currentPlaylistUrl.split("://")[1] ===
              soundcloudUrl.split("://")[1] &&
            playing);
        return (
          <button
            className={`sc-player__button flex-container flex-center play-button ${
              full ? " full" : ""
            }`}
            onClick={() => (isPlaying ? stop() : updateTrack(soundcloudUrl))}
          >
            <Icon size={32} name={isPlaying ? "stop" : "play_arrow"} />
          </button>
        );
      }}
    </SC.Consumer>
  ) : null;
};

export default PlayButton;

import React from "react";
import { ControlButton } from "./";
import { Icon } from "../../../img/icons";

const formatTime = (seconds) => {
  if (!seconds || isNaN(seconds)) return "0:00";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, "0")}`;
};

const Controls = ({
  showPlay,
  update,
  updateTrack,
  isPlaylist,
  playing,
  currentTime,
  duration,
  controls: { previous, next, stop, play },
}) => (
  <div
    className={
      "flex-container gap-xxs flex-center " + isPlaylist
        ? "flex-column"
        : "flex-row"
    }
  >
    <div className="flex-container flex-center">
      {isPlaylist && (
        <ControlButton className="previous" icon="prev" fn={previous} />
      )}
      {showPlay && <PlayBtn playing={playing} stop={stop} play={play} />}
      {isPlaylist && <ControlButton className="next" icon="next" fn={next} />}
    </div>
    <div className="sc-player__time">
      {formatTime(currentTime)} / {formatTime(duration)}
    </div>
  </div>
);
Controls.defaultProps = {
  showPlay: true,
};

export const PlayBtn = ({
  update,
  updateTrack,
  soundcloudUrl,
  playing,
  stop,
  play,
}) => {
  return update ? (
    <button
      className={`flex-container flex-center play-button`}
      onClick={() => updateTrack(soundcloudUrl)}
    >
      <Icon size={32} name={"play_arrow"} />
    </button>
  ) : (
    <ControlButton
      className="stop"
      icon={playing ? "stop" : "play"}
      fn={playing ? stop : play}
    />
  );
};

export default Controls;

import React from "react";
import { SC } from "./SoundcloudPlayer";
import { Icon } from "../img/icons";
import "../styles/common/play-button.scss";
const PlayButton = ({ soundcloudUrl, full }) => {
  const [isLoading, setIsLoading] = React.useState(false);
  const {
    updateTrack,
    currentTrack,
    currentPlaylistUrl,
    playing,
    error,
    controls: { stop },
  } = React.useContext(SC);

  const isPlaying = React.useMemo(() => {
    if (!soundcloudUrl) return false;
    if (!playing) return false;
    // these have query strings, so we need to compare the origins and pathnames
    const currentTrackUrl = currentTrack?.permalink_url
      ? new URL(currentTrack.permalink_url).origin +
        new URL(currentTrack.permalink_url).pathname
      : currentTrack.permalink_url;

    const playlistUrl = currentPlaylistUrl
      ? new URL(currentPlaylistUrl).origin +
        new URL(currentPlaylistUrl).pathname
      : currentPlaylistUrl;

    if (soundcloudUrl === currentTrackUrl || soundcloudUrl === playlistUrl) {
      return true;
    }

    return false;
  }, [playing, currentTrack, currentPlaylistUrl, soundcloudUrl]);

  React.useEffect(() => {
    // Reset loading when track changes, or when isPlaying or error
    if (isPlaying || error || currentTrack) {
      setIsLoading(false);
    }
  }, [isPlaying, error, currentTrack]);

  return soundcloudUrl ? (
    <button
      className={`sc-player__button flex-container flex-center play-button ${
        full ? " full" : ""
      } ${isLoading ? "loading" : ""}
       ${isPlaying ? "playing" : ""}`}
      onClick={() => {
        if (isPlaying) {
          return stop();
        }
        setIsLoading(true);
        updateTrack(soundcloudUrl);
      }}
    >
      <Icon
        size={32}
        name={isLoading ? "album" : isPlaying ? "stop" : "play_arrow"}
      />
    </button>
  ) : null;
};

export default PlayButton;

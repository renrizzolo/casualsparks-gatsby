import React from 'react';
import { SC } from './SoundcloudPlayer';
import { Icon } from '../img/icons';
import '../styles/common/play-button.scss';
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

  const isPlaying =
    (soundcloudUrl === currentTrack.permalink_url && playing) ||
    (currentPlaylistUrl &&
      currentPlaylistUrl.split('://')[1] === soundcloudUrl.split('://')[1] &&
      playing);

  React.useEffect(() => {
    (isPlaying || error) && isLoading && setIsLoading(false);
  }, [isPlaying, error, isLoading]);

  return soundcloudUrl ? (
    <button
      className={`sc-player__button flex-container flex-center play-button ${
        full ? ' full' : ''
      } ${isLoading ? 'loading' : ''}`}
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
        name={isLoading ? 'album' : isPlaying ? 'stop' : 'play_arrow'}
      />
    </button>
  ) : null;
};

export default PlayButton;

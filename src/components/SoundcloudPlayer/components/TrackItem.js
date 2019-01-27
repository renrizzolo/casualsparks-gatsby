import React from 'react'
import { Icon } from '../../../img/icons'
import { ControlButton } from './'

const TrackItem = ({
  controls: { play, pause, previous, next, stop, seek },
  hero,
  error,
  playing,
  currentTrack,
  track,
  url,
  index,
  style,
  isPlaylist,
  currentTime,
  prospectiveSeek,
  events,
  show,
}) => {
  const isPlaying = track.id === currentTrack.id && playing
  const playlistIndex = index !== null ? { playlistIndex: index } : null
  return (
    <div
      style={style}
      key={track.id}
      className={`sc-player__item ${hero ? 'hero' : undefined} ${isPlaying &&
        !hero ?
        'highlighted' : undefined}`}
      onClick={() =>
        !hero ? (isPlaying ? pause() : play(playlistIndex)) : null
      }
    >
      <div className="flex-container flex-center flex-1">
        <div className="sc-player__controls flex-container flex-center">

          {hero && (
            <React.Fragment>
              {isPlaylist &&
                <ControlButton
                  className="previous"
                  icon="prev"
                  fn={previous}
                />
              }
              <ControlButton
                className="stop"
                icon={playing ? 'stop' : 'play'}
                fn={playing ? stop : play}
              />
              {isPlaylist &&
                <ControlButton
                  className="next"
                  icon="next"
                  fn={next}
                />
              }
              {error && (
                <span className="error notice">
                  {error.toString()}
                </span>
              )}
            </React.Fragment>
          )}
        </div>
        <div className="sc-player__text">
          {hero && track && <img className="sc-player__thumb" src={track.artwork_url} />}
          {hero && track && track.user ?
            <a href={track.permalink_url} target="_blank" rel="noopener">
              {track.user.username} - {track.title}
            </a>
            :
            <span>{track && track.user && track.user.username} - {track && track.title}</span>
          }
        </div>
        <div className="sc-player__waveform" onClick={seek}>
          {hero && currentTrack.waveform_url && (
            <div
              onMouseOut={events.resetProspectiveSeek}
              onMouseMove={events.waveFormHover}
            >
              <span
                className="sc-player__seek sc-player__prospective-seek"
                style={{
                  width: `${
                    prospectiveSeek > 0
                      ? (prospectiveSeek / (currentTrack.duration / 1000)) * 100
                      : (currentTime / (currentTrack.duration / 1000)) * 100
                    }%`,
                }}
              />

              <span
                className="sc-player__seek"
                style={{
                  width: `${(currentTime / (currentTrack.duration / 1000)) *
                    100}%`,
                }}
              />
              <img src={currentTrack.waveform_url} />
            </div>
          )}
        </div>
        {!hero && (
          <a
            className="sc-player__button play"
            disabled={!url}
            onClick={() => (isPlaying ? pause() : play(playlistIndex))}
          >
            {isPlaying ? (
              <Icon name="pause" className="sc-player__icon play" size={28} />
            ) : (
                <Icon name="play" className="sc-player__icon pause" size={28} />
              )}
          </a>
        )}
      </div>
    </div>
  )
}

export default TrackItem

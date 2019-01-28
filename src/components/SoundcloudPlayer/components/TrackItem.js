import React from 'react'
import { Icon } from '../../../img/icons'
import { ControlButton, Waveform } from './'

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
  lite,
}) => {
  const isPlaying = track.id === currentTrack.id && playing
  const playlistIndex = index !== null ? { playlistIndex: index } : null
  return (
    <div
      style={style}
      key={track.id}
      className={`sc-player__item
      ${lite ? ' lite' : ''} 
      ${hero ? ' hero' : ''} 
      ${isPlaying && !hero ? ' highlighted' : ''}
      `}
      onClick={() =>
        !hero ? (isPlaying ? pause() : play(playlistIndex)) : null
      }
    >
      <div className="sc-player__item-content">
        {hero && (
          <div className="sc-player__controls flex-container flex-center">
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
          </div>
        )}
       { !lite && <div className="sc-player__text">
          {hero && track && <img className="sc-player__thumb" src={track.artwork_url} />}
          {hero && track && track.user ?
            <a href={track.permalink_url} target="_blank" rel="noopener">
              {track.user.username} - {track.title}
            </a>
            :
            <span>{track && track.user && track.user.username} - {track && track.title}</span>
          }
        </div>}
        {hero && currentTrack.waveform_url && (
          <Waveform 
            events={events} 
            seek={seek} 
            prospectiveSeek={prospectiveSeek} 
            currentTime={currentTime} 
            currentTrack={currentTrack}
          />
        )}
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

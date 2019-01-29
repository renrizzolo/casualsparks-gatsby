import React from 'react'
import { ControlButton } from './'
import { Icon } from '../../../img/icons'

const Controls = ({
  showPlay,
  update,
  updateTrack,
  isPlaylist,
  playing,
  controls: { previous, next, stop, play },
}) => (
  <React.Fragment>
    {isPlaylist && (
      <ControlButton className="previous" icon="prev" fn={previous} />
    )}
    {showPlay && <PlayBtn playing={playing} stop={stop} play={play} />}
    {isPlaylist && <ControlButton className="next" icon="next" fn={next} />}
  </React.Fragment>
)
Controls.defaultProps = {
  showPlay: true,
}

export const PlayBtn = ({
  update,
  updateTrack,
  soundcloudUrl,
  playing,
  stop,
  play,
}) => {
  return update ? (
    <a
      className={`flex-container flex-center play-button`}
      onClick={() => updateTrack(soundcloudUrl)}
    >
      <Icon size={32} name={'play_arrow'} />
    </a>
  ) : (
    <ControlButton
      className="stop"
      icon={playing ? 'stop' : 'play'}
      fn={playing ? stop : play}
    />
  )
}

export default Controls

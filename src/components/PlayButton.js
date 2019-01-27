import React from 'react'
import { SC } from './SoundcloudPlayer'
import { Icon } from '../img/icons'

const PlayButton = ({ soundcloudUrl, full }) => {
    return (
      soundcloudUrl ? (
        <SC.Consumer>
            {({ updateTrack, currentTrack }) => {
            const isPlaying = soundcloudUrl === currentTrack.permalink_url;            
              return (
                <a
                  className={`flex-1 button dark-blue ${full && 'full'}`}
                  onClick={() => updateTrack(soundcloudUrl)}
        >
                  <span className="flex-container flex-center">
                    Play&nbsp;
                      <Icon name={'play'} />
                  </span>
                </a>
              )
            }}
          </SC.Consumer>
        )
        :
        null
    )
  }

export default PlayButton;
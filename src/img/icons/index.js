import React from 'react'
import { default as Prev } from './baseline-fast_rewind-24px.svg'
import { default as Next } from './baseline-fast_forward-24px.svg'
import { default as Stop } from './baseline-stop-24px.svg'
import { default as Play } from './baseline-play_circle_outline-24px.svg'
import { default as PlayArrow } from './baseline-play_arrow-24px.svg'

import { default as Pause } from './baseline-pause_circle_outline-24px.svg'
import { default as Close } from './baseline-close-24px.svg'
import { default as Album } from './baseline-album-24px.svg'
import { default as Music } from './baseline-queue_music-24px.svg'

const components = {
  play: Play,
  play_arrow: PlayArrow,
  pause: Pause,
  prev: Prev,
  next: Next,
  stop: Stop,
  close: Close,
  album: Album,
  music: Music,
};

export const Icon = ({ name, style, className, size, children }) => {  
  const IconComponent = components[name]
  return ( 
    <IconComponent width={size} height={size} style={style} className={className}>
      {children}
    </IconComponent>
  )
}

Icon.defaultProps = {
  size: 24,
}
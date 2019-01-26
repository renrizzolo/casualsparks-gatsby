import React, { Component } from 'react'
import { Trail, Spring, Transition, animated, config } from 'react-spring'
import '../../styles/common/player.scss'
import { Icon } from '../../img/icons'

import { appendQueryParam, fetchUrl, parseURL } from './utils'

const SOUNDCLOUD_API_URL = 'https://api.soundcloud.com'
export const SC = React.createContext()

export default class SoundcloudPlayerProvider extends Component {
  state = {
    show: false,
    playing: false,
    error: false,
    url: null,
    currentTime: 0,
    currentTrack: {},
    tracks: [],
    updateTrack: () => {},
    controls: {},
    events: {},
  }
  track = null
  playlist = null
  playing = false
  duration = 0
  playStarted = false

  componentDidMount = () => {
    this.audio = document.createElement('audio')
    this.setState({
      updateTrack: this.updateTrack,
      togglePlayer: this.togglePlayer,
      controls: {
        play: this.playTrack,
        pause: this.pause,
        previous: this.previous,
        next: this.next,
        stop: this.stop,
        seek: this.seek,
      },
      events: {
        resetProspectiveSeek: this.resetProspectiveSeek,
        waveFormHover: this.waveFormHover,
      },
    })
    // this.scPlayer = new SoundCloudAudio('a7c99e975fa37c393cb1a6d89d5c1e0b');
    this.audio.addEventListener('timeupdate', this.updateCurrentTime)
    this.audio.addEventListener('ended', this.handleEnd)
    document.addEventListener('keydown', this.handleKeys)
  }

  componentWillUnmount = () => {
    this.audio.removeEventListener('timeupdate', this.updateCurrentTime)
    this.audio.removeEventListener('ended', this.handleEnd)
    document.removeEventListener('keydown', this.handleKeys)
  }

  handleKeys = e => {
    console.log(e.code)

    const { playing, playlistIndex, url, show } = this.state
    if (url) {
      if (e.code.toLowerCase() === 'space') {
        console.log('playing', playing, playlistIndex)
        if (playing) {
          this.pause()
        } else {
          this.playTrack({ playlistIndex: playlistIndex })
          !show && this.togglePlayer()
        }
      }

      if (e.code.toLowerCase() === 'escape') {
        show && this.togglePlayer()
      }
    }
  }

  updateCurrentTime = () => {
    this.setState({
      currentTime: this.audio.currentTime,
    })
  }
  handleEnd = () => {
    this.stop()
  }
  start = url => {
    if (url) {
      this.stop()
      this.resolve(url, track => {
        console.log('track obj', track)
        this.setState({
          currentTrack: track,
          tracks: track.tracks || [],
        })
        // once track is loaded it can be played
        this.playTrack()
        // .then(res => console.log(res))
        // .catch(err => console.log(err))
      })
    }
  }

  togglePlayer = () => {
    this.setState({
      show: !this.state.show,
    })
    console.log(!this.state.show)
  }

  resetData = () => {
    this.track = null
    this.playlist = null
  }

  resolve = (url, callback) => {
    const { clientId } = this.props
    if (!clientId) {
      console.warn('No client id present. Please supply the cilentId prop')
      return
    }
    const resolveUrl = `${SOUNDCLOUD_API_URL}/resolve.json?url=${encodeURIComponent(
      url
    )}&client_id=${clientId}`
    const data = fetchUrl(resolveUrl)
    data
      .then(res => {
        this.resetData()

        if (Array.isArray(res)) {
          res = { tracks: res }
        }

        if (res.tracks) {
          this.playlist = res
        } else {
          this.track = res

          // save timings
          const U = parseURL(url)
          this.track.stream_url += U.hash
        }

        this.duration =
          res.duration && !isNaN(res.duration)
            ? res.duration / 1000 // convert to seconds
            : 0 // no duration is zero
        callback(res)
      })
      .catch(err => console.log(err))
  }

  updateTrack = url => {
    console.log('this.updateTrack', url)

    this.setState({
      url,
      show: true,
    })
    this.start(url)
  }

  playTrack = async (options = null) => {
    if (this.playStarted) {
      console.log('play started, returning')

      return
    }
    console.log('play started')

    this.playStarted = true

    return this.play(options)
      .then(() => {
        console.log('playing:', this.playing)
        this.playStarted = false
        console.log('play finished')

        this.setState({
          paused: false,
          error: false,
        })
        options &&
          options.playlistIndex &&
          this.setState({
          currentTrack: this.playlist.tracks[options.playlistIndex],
          })
      })
      .catch(err => {
        console.log('err', err)
        console.log('play errorerd')

        this.playStarted = false

        // this shit is firing
        // for unknon reasons
        // this.setState({
        //   error: true
        // })
      })
  }

  play = async options => {
    options = options || {}
    let src
    const { playlistIndex } = this.state

    if (options.streamUrl) {
      // this won't really work
      // (it'll play the track but there won't be any track
      // data to show the UI)
      src = options.streamUrl
    } else if (this.playlist) {
      src = await this.getPlaylistSrc(options)
      this.setState({
        currentTrack: this.playlist.tracks[this.state.playlistIndex],
      })
      console.log('awatied', src)
    } else if (this.track) {
      this.setState({
        currentTrack: this.track,
      })
      src = this.track.stream_url
    }

    console.log(src)

    if (!src) {
      console.error('No track source.')
      return
    }

    if (this.props.clientId) {
      console.log('before app', src)

      src = appendQueryParam(src, 'client_id', this.props.clientId)
    }

    if (src !== this.audio.src) {
      this.audio.src = src
    }

    this.playing = src
    console.log(src, playlistIndex)

    const audio = await this.audio.play()
    this.setState({
      playing: true,
    })
    return audio
  }

  getPlaylistSrc = options => {
    const length = this.playlist.tracks.length
    const { playlistIndex } = this.state
    if (length) {
      console.log('length', options)

      let src
      if (options.playlistIndex === undefined) {
        const index = playlistIndex || 0
        this.setState({
          playlistIndex: index,
        })
        src = this.playlist.tracks[index].stream_url
        console.log('src', src)
      } else {
        console.log('set to', options.playlistIndex)

        this.setState({
          playlistIndex: options.playlistIndex,
        })
        src = this.playlist.tracks[options.playlistIndex].stream_url
        console.log('sr', src)
      }

      // be silent if index is out of range
      if (playlistIndex >= length || playlistIndex < 0) {
        console.log('out of range')

        this.setState({
          playlistIndex: 0,
        })
        return
      }
      return src
    }
  }

  pause = () => {
    this.audio.pause()
    this.setState({
      playing: false,
    })
  }

  stop = () => {
    this.audio.pause()
    this.audio.currentTime = 0
    this.setState({
      playing: false,
    })
    console.log('stopped playback')
  }

  next = options => {
    const { playlistIndex } = this.state
    options = options || {}
    var tracksLength = this.playlist.tracks.length
    if (this.skipping) {
      console.log('play started, returning')
      return
    }

    // if (playlistIndex >= tracksLength - 1) {
    //   if (options.loop) {
    //     this.setState({
    //       playlistIndex: -1,
    //     })
    //     this.skipping = true;
    //   } else {
    //     return
    //   }
    // }

    if (this.playlist && tracksLength) {
      this.skipping = true;

      this.setState(
        state => ({
          playlistIndex: state.playlistIndex + 1,
        }),
        () => {
          console.log('playing next', this.state.playlistIndex)

          this.playTrack({ playlistIndex: this.state.playlistIndex })
          .then(() => {
            this.skipping = false;
          })
          .catch(() => {
            this.skipping = false;
          })
        }
      )
    }
  }

  previous = () => {

    const { playlistIndex } = this.state
    if (playlistIndex <= 0) {
      return
    }
    if (this.skipping) {
      console.log('play started, returning')
      return
    }
    if (this.playlist && this.playlist.tracks.length) {
      this.skipping = true;
      this.setState(
        state => ({
          playlistIndex: state.playlistIndex - 1,
        }),
        () => {
          console.log('playing prev', this.state.playlistIndex)
          
          this.playTrack({ playlistIndex: this.state.playlistIndex })
          .then(() => {
            this.skipping = false;
          })
          .catch(() => {
            this.skipping = false;
          })
        }
      )
    }
  }

  seek = e => {
    if (!this.audio.readyState) {
      return false
    }
    const { target } = e
    console.log(target.offsetWidth, e.nativeEvent.offsetX)

    const percent = e.nativeEvent.offsetX / e.target.offsetWidth
    console.log(percent)

    console.log(percent * (this.audio.duration || 0))

    this.audio.currentTime = percent * (this.audio.duration || 0)

    if (!this.state.playing) {
      this.playTrack({ playlistIndex: this.state.playlistIndex })
    }
  }

  waveFormHover = e => {
    const percent = e.nativeEvent.offsetX / e.target.offsetWidth

    this.setState({
      prospectiveSeek: percent * this.audio.duration,
    })
  }
  resetProspectiveSeek = () => {
    this.setState({
      prospectiveSeek: 0,
    })
  }
  setVolume = volumePercentage => {
    if (!this.audio.readyState) {
      return
    }

    this.audio.volume = volumePercentage
  }

  setTime = seconds => {
    if (!this.audio.readyState) {
      return
    }

    this.audio.currentTime = seconds
  }

  // play = (index = null, track) => {
  //   this.play(index)
  //   .then(() => {
  //     this.setState({
  //       playing: this.scPlayer.playing,
  //       paused: false,
  //       error: false
  //     })
  //     track && this.setState({
  //       currentTrack: track
  //     })
  //   })
  //   .catch(err => {
  //     console.log('err', err);
  //     // this shit is firing
  //     // for unknon reasons
  //     // this.setState({
  //     //   error: true
  //     // })
  //   })
  // }

  // pause = (params) => {
  //   console.log(this.scPlayer.playing);

  //   this.scPlayer.pause()
  //     // .then(() =>
  //       this.setState({
  //         playing: this.scPlayer.playing,
  //         paused: true,
  //         error: false
  //       })
  //     // )
  //     // .catch(
  //     //   this.setState({
  //     //     error: true
  //     //   })
  //     // )
  // }

  // stop = (params) => {
  //   this.scPlayer.stop()
  //   this.setState({
  //     playing: this.scPlayer.playing,
  //     paused: false,
  //     error: false
  //   })
  // }

  render() {
    const { children } = this.props
 
    return <SC.Provider value={this.state}>{children}</SC.Provider>
  }
}
export const SoundcloudPlayerUI = () => {
  return (
    <SC.Consumer>
      {({
        controls,
        togglePlayer,
        show,
        error,
        playing,
        currentTime,
        currentTrack,
        currentTrack: { title, user, id },
        url,
        tracks,
        prospectiveSeek,
        events,
      }) =>
        url ? (
          <div>
            {/* <ControlButton className="open" icon={AlbumIcon} fn={togglePlayer} /> */}
            <Spring
              native
              from={{ transform: show ? 'translateY(100%)' : 'translateY(0)' }}
              to={{ transform: show ? 'translateY(0)' : 'translateY(100%)' }}
              config={{ tension: 105, friction: 12 }}
            >
              {props => (
                <animated.div className="sc-player" style={props}>
                  <div className="track">
                    <div
                      className="sc-player__items flex-1"
                      style={{ height: '100%' }}
                    >
                      {title && (
                        <Spring
                          native
                          from={{ opacity: 0 }}
                          to={{ opacity: 1 }}
                        >
                          {props => (
                            <animated.div style={props}>
                              <TrackItem
                                togglePlayer={togglePlayer}
                                hero
                                events={events}
                                prospectiveSeek={prospectiveSeek}
                                currentTime={currentTime}
                                isPlaylist={Boolean(tracks && tracks.length)}
                                playing={playing}
                                controls={controls}
                                currentTrack={currentTrack}
                                track={currentTrack}
                                url={url}
                                show={show}
                                index={null}
                              />
                            </animated.div>
                          )}
                        </Spring>
                      )}
                      {tracks && tracks.length > 0 && (
                        <div>
                          <Trail
                            items={tracks}
                            keys={item => item.id}
                            from={{ opacity: 0 }}
                            to={{ opacity: 1 }}
                          >
                            {(track, i) => props => (
                              <TrackItem
                                style={{...props, cursor: 'pointer'}}
                                playing={playing}
                                controls={controls}
                                currentTrack={currentTrack}
                                track={track}
                                url={url}
                                index={i}
                              />
                            )}
                          </Trail>
                        </div>
                      )}
                    </div>
                    {error && (
                      <span className="error notice">
                        Something went wrong...
                      </span>
                    )}
                  </div>
                </animated.div>
              )}
            </Spring>
          </div>
        ) : null
      }
    </SC.Consumer>
  )
}
const TrackItem = ({
  controls: { play, pause, previous, next, stop, seek },
  hero,
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
  togglePlayer,
  show,
}) => {
  const isPlaying = track.id === currentTrack.id && playing
  const playlistIndex = index !== null ? { playlistIndex: index } : null
  return (
    <div
      style={style}
      key={track.id}
      className={`sc-player__item ${hero && 'hero'} ${isPlaying &&
        !hero &&
        'highlighted'}`}
      onClick={() =>
        !hero ? (isPlaying ? pause() : play(playlistIndex)) : null
      }
    >
      <div className="flex-container flex-center flex-1">
        <div className="sc-player__controls flex-container flex-center">
          {hero && (
            <div className="flex-container flex-center">
              <Transition
                native
                items={show}
                from={{
                  opacity: 0,
                  position: 'absolute',
                  right: '1rem',
                  transform: 'translateY(-5px)',
                }}
                enter={{ opacity: 1, transform: 'translateY(0px)' }}
                leave={{ opacity: 0, transform: 'translateY(-5px)' }}
                config={{ ...config.slow, delay: 300 }}
              >
                {show => props =>
                  show && (
                    <animated.div style={props}>
                      <ControlButton
                        className="toggle open"
                        icon="close"
                        fn={togglePlayer}
                      />
                    </animated.div>
                  )}
              </Transition>
              <Transition
                native
                items={show}
                from={{
                  position: 'absolute',
                  opacity: 1,
                  zIndex: -1,
                  transform: 'translateY(-25px) scale(1)',
                }}
                enter={{
                  opacity: 1,
                  transform: 'translateY(-75px) scale(1.5)',
                }}
                leave={{ opacity: 0, transform: 'translateY(-25px), scale(1)' }}
                config={{ ...config.slow, delay: 350 }}
              >
                {show => props =>
                  !show && (
                    <animated.div className="sc-player__open-container" style={props}>
                      <div className={playing && 'pulse'}>
                        <ControlButton
                          className={`toggle closed`}
                          icon="music"
                          fn={togglePlayer}
                        />
                      </div>
                    </animated.div>
                  )}
              </Transition>
            </div>
          )}

          {hero &&  (
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
            </React.Fragment>
          )}
        </div>
        <div className="sc-player__text">
          {hero && <img className="sc-player__thumb" src={track.artwork_url} />}
          { hero ? 
            <a href={track.permalink_url} target="_blank" rel="noopener">
              {track.user.username} - {track.title}
            </a>
            :
            <span>{ track.user.username } - { track.title }</span>
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

const ControlButton = ({ className, fn, icon }) => (
  <a onClick={fn} className={`sc-player__button ${className}`}>
    <Icon name={icon} className={`sc-player__icon ${className}`} />
  </a>
)

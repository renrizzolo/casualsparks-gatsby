import React, { Component } from 'react'
import { Trail, Spring,  animated } from 'react-spring'
import '../../styles/common/player.scss'
import {TrackItem, ControlButton, PlayerToggle, Waveform, Controls } from './components'
import { appendQueryParam, fetchUrl, parseURL } from './utils'

const SOUNDCLOUD_API_URL = 'https://api.soundcloud.com'

export const SC = React.createContext()

export default class SoundcloudPlayerProvider extends Component {
  state = {
    show: false,
    playing: false,
    error: null,
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
    this.playlist && this.next();
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

  resolve = async (url, callback) => {
    const { clientId } = this.props
    this.setState({
      error: null,
    })
    if (!clientId) {
      console.warn('No client id present. Please supply the cilentId prop')
      return
    }
    const resolveUrl = `${SOUNDCLOUD_API_URL}/resolve.json?url=${encodeURIComponent(
      url
    )}&client_id=${clientId}`

    const res = await fetchUrl(resolveUrl)
    if (!res) {
      if (res.errors) {
        this.setState({
          error: 'Soundcloud Server errror, probably.',
        })
        return;
      }
    }
    if (res.errors) {
      this.setState({
        error: res.errors[0].error_message,
      })
      return;
    }
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
    
  }

  updateTrack = url => {
    console.log('this.updateTrack', url)

    this.setState({
      url,
      reallyPlaying: false,
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
          reallyPlaying: true,
          paused: false,
          error: null,
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
        // silent fail - most likely my fault
        this.playStarted = false

      })
  }

  play = async options => {
    options = options || {}
    let src
    const { playlistIndex } = this.state
    this.setState({
      error: null,
    })
    if (options.streamUrl) {
      // this won't really work
      // (it'll play the track but there won't be any track
      // data to show the UI)
      src = options.streamUrl
    } else if (this.playlist) {
      src = await this.getPlaylistSrc(options)
      this.setState({
        currentPlaylistUrl: this.playlist.permalink_url,
        currentTrack: this.playlist.tracks[this.state.playlistIndex],
      })
      console.log('awatied', src)
    } else if (this.track) {
      this.setState({
        currentPlaylistUrl: null,

        currentTrack: this.track,
      })
      src = this.track.stream_url
    }

    console.log(src)

    if (!src) {
      this.setState({
        error: 'no track source supplied'
      })
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
      // not sure about this
      // currentTrack: [],
    })
    console.log('stopped playback')
  }

  next = options => {
    const { playlistIndex } = this.state
    options = options || {}
    const tracksLength = this.playlist.tracks.length
    if (this.skipping) {
      console.log('play started, returning')
      return
    }

    if (playlistIndex >= tracksLength - 1) {
      // if (options.loop) {
      //   this.setState({
      //     playlistIndex: -1,
      //   })
      //   this.skipping = true;
      // } else {
        return
    }

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

  // waveFormHover = e => {
  //   const percent = e.nativeEvent.offsetX / e.target.offsetWidth
  //   this.setState({
  //     prospectiveSeek: percent * this.audio.duration,
  //   })
  // }

  // resetProspectiveSeek = () => {
  //   this.setState({
  //     prospectiveSeek: 0,
  //   })
  // }

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

  render() {
    const { children } = this.props
 
    return <SC.Provider value={this.state}>{children}</SC.Provider>
  }
}



export const SoundcloudPlayerLite = ({ soundcloudUrl, className }) => {
  return (
    <SC.Consumer>
      {({
        controls,
        togglePlayer,
        show,
        error,
        playing,
        currentTime,
        currentPlaylistUrl,
        currentTrack,
        currentTrack: { title, user, id },
        url,
        tracks,
        prospectiveSeek,
        events,
      }) => {
        console.log('pliayin', currentPlaylistUrl);
        return (
          (soundcloudUrl === currentTrack.permalink_url && playing
            || currentPlaylistUrl && currentPlaylistUrl.split('://')[1] === soundcloudUrl.split('://')[1] && playing ) ? (
            <Spring
              native
              from={{ opacity: 0 }}
              to={{ opacity: 1 }}
            >
              {props => (
                  <animated.div style={props} className={`sc-player__item lite ${className}`}>
                    <div className="sc-player__item-content">
                        <div className="sc-player__controls flex-container flex-center">
                        <Controls
                          controls={controls}
                          playing={playing} 
                          isPlaylist={Boolean(tracks && tracks.length)}
                          showPlay={false}
                        />
                            {error && (
                              <span className="error notice">
                                {error.toString()}
                              </span>
                            )}
                        </div>
                    <Waveform
                      events={events}
                      seek={controls.seek}
                      prospectiveSeek={prospectiveSeek}
                      currentTime={currentTime}
                      currentTrack={currentTrack}
                    />
                  </div>
                 
                </animated.div>
              )}
            </Spring>
          ) : null
        )}
      }
    </SC.Consumer>
    )
  }

export const SoundcloudPlayerUI = ({soundcloudUrl, lite}) => {
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
        reallyPlaying,
        events,
      }) => {
        const loading = show && !reallyPlaying;

       return (
        soundcloudUrl === currentTrack.permalink_url && lite ? (
          <Spring
            native
            from={{ opacity: 0 }}
            to={{ opacity: 1 }}
          >
            {props => (
              <animated.div style={props}>
                <TrackItem
                  error={error}
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
        ) :
        !lite && url ? (
          <div>
            <Spring
              native
              from={{ transform: show ? 'translateY(100%)' : 'translateY(0)' }}
              to={{ transform: show && reallyPlaying ? 'translateY(0)' : 'translateY(100%)' }}
              config={{ tension: 105, friction: 12 }}
            >
              {props => (
                <animated.div className="sc-player" style={props}>
                  <div className="track">
                    <div
                      className="sc-player__items flex-1"
                      style={{ height: '100%' }}
                    >
                      <PlayerToggle
                        loading={loading}
                        playing={playing}
                        show={show}
                        togglePlayer={togglePlayer}
                      />
                      <div className="sc-player__items flex-1">
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
                                  key={i}
                                  style={{ ...props, cursor: 'pointer' }}
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
                      <Spring
                        native
                        from={{ opacity: 0 }}
                        to={{ opacity: 1 }}
                      >
                        {props => (
                          <animated.div style={props}>
                            <TrackItem
                              error={error}
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

                    </div>

                  </div>
                </animated.div>
              )}
            </Spring>
          </div>
        ) : null
      )}
      }
    </SC.Consumer>
  )
}

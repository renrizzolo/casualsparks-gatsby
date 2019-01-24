import React, { Component } from 'react'
import SoundCloudAudio from 'soundcloud-audio'
import '../../styles/common/player.scss'
import PlayIcon from '../../img/baseline-play_circle_outline-24px.svg'
import PauseIcon from '../../img/baseline-pause_circle_outline-24px.svg'

export const SC = React.createContext();

export default class SoundcloudPlayer extends Component {
  state = {
    playing: false,
    paused: false,
    error: false,
    url: null,
    currentTrack: [],
    currentPlaylist: [],
    tracks: [],
    updateTrack: () => { }
  }
  componentDidMount = () => {
    this.setState({
      updateTrack: this.updateTrack
    })
    this.scPlayer = new SoundCloudAudio('a7c99e975fa37c393cb1a6d89d5c1e0b');
    this.start();
  }
  updateTrack = (url) => {
    console.log('this.updateTrack', url);
    
    this.setState({
      url
    })
    this.start(url);
  }
  start = (url) => {
    console.log('start', url);
    
    if (url && this.scPlayer) {
      this.stop();
      this.scPlayer.resolve(url, (track) => {

        console.log('track obj', track);
        this.setState({
          currentTrack: track,
          currentPlaylist: track.tracks ? track : [],
          tracks: track.tracks || []
        })
        // once track is loaded it can be played
        this.play()
        // .then(res => console.log(res))
        // .catch(err => console.log(err))
      })
    }
  }

  play = (index = null, track) => {
    this.scPlayer.play(index)
    .then(() => {
      this.setState({
        playing: this.scPlayer.playing,
        paused: false,
        error: false
      })
      track && this.setState({
        currentTrack: track
      })
    })
    .catch(err => { 
      console.log('err', err);
      // this shit is firing
      // for unknon reasons
      // this.setState({
      //   error: true
      // })
    })
  }

  pause = (params) => {
    console.log(this.scPlayer.playing);
    
    this.scPlayer.pause()
      // .then(() =>
        this.setState({
          playing: this.scPlayer.playing,
          paused: true,
          error: false
        })
      // )
      // .catch(
      //   this.setState({
      //     error: true
      //   })
      // )
  }

  stop = (params) => {
    this.scPlayer.stop()
    this.setState({
      playing: this.scPlayer.playing,
      paused: false,
      error: false
    })
  }

  

  render() {

    const { 
      error, 
      playing, 
      paused,
      currentTrack,
      currentTrack: { title, user, id }, 
      url,
      tracks
    } = this.state;

    const { children } = this.props;
    const currentTime = this.scPlayer ? this.scPlayer.audio.currentTime.toFixed(0) : null;
    return (
      <SC.Provider value={this.state}>
          {children}
        <SC.Consumer>
          {SC => SC.url ?
            <div className="sc-player">
              <div className="track flex-container flex-container__row align-center">
                <div className="sc-player__controls">
                  <button className="sc-player__button play" disabled={!url || playing} onClick={this.play}>play</button>
                  <button className="sc-player__button pause" disabled={!url || paused} onClick={this.pause}>pause</button>
                </div>
                <div className="sc-player__items">

                  {title && 
                    <span className="sc-player__item"> 
                      <img className="sc-player__thumb" src={currentTrack.artwork_url}/>
                      <span className="sc-player__text">{user.username} - {title}</span>
                    </span>
                  }
                  {
                    tracks && tracks.length > 1 && 
                    <div>
                      {tracks.map((track, i) => (
                        <span key={track.id} className="sc-player__item">
                          <span className="sc-player__text">
                            {track.user.username} - {track.title}
                          </span>
                          <ControlButton 
                            playing={playing} 
                            play={this.play}
                            pause={this.pause} 
                            currentTrack={currentTrack}
                            track={track} 
                            url={url} 
                            index={i}
                          />
                        </span>
                        ))
                      }
                      </div>
                  }
                </div>
                {error && <span className="error notice">Something went wrong...</span>}
              </div>
            </div>
            :
            null
          }
        </SC.Consumer>
      </SC.Provider>
    )
  }
}

const ControlButton = ({play, pause, playing, track, currentTrack, url, index = null}) => {
  const isPlaying = track.id === currentTrack.id && playing;
  return (
    <button
      className="sc-player__button play" disabled={!url}
      onClick={() => isPlaying ? pause() : play({ playlistIndex: index }, track)}
    >
     { isPlaying ? 
     <PauseIcon className="sc-player__icon play" /> 
     : 
     <PlayIcon className="sc-player__icon pause" /> 
     }
    </button>
  )
}
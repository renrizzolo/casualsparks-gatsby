import React, { Component } from 'react'
import SoundCloudAudio from 'soundcloud-audio'
import '../../styles/common/player.scss'
import PlayIcon from '../../img/baseline-play_circle_outline-24px.svg'
import PauseIcon from '../../img/baseline-pause_circle_outline-24px.svg'
import { appendQueryParam, fetchUrl, parseURL } from './utils';

const SOUNDCLOUD_API_URL = 'https://api.soundcloud.com';
export const SC = React.createContext();

export default class SoundcloudPlayerProvider extends Component {
  state = {
    playing: false,
    error: false,
    url: null,
    currentTrack: {},
    tracks: [],
    updateTrack: () => { },
    controls: {}
  }
  track = null;
  playlist = null;
  playing = false;
  duration = 0;

  
  componentDidMount = () => {
    this.audio = document.createElement('audio');
    this.setState({
      updateTrack: this.updateTrack,
      controls: {
        play: this.playTrack,
        pause: this.pause,
        previous: this.previous,
        next: this.next,
      }
    })
    // this.scPlayer = new SoundCloudAudio('a7c99e975fa37c393cb1a6d89d5c1e0b');

  }

  start = (url) => {
    if (url) {
      this.stop();
      this.resolve(url, (track) => {

        console.log('track obj', track);
        this.setState({
          currentTrack: track,
          tracks: track.tracks || []
        })
        // once track is loaded it can be played
        this.playTrack()
        // .then(res => console.log(res))
        // .catch(err => console.log(err))
      })
    }
  }
  
  cleanData = () => {
    this.track = null;
    this.playlist = null;
  }

  resolve = (url, callback) => {
    const { clientId } = this.props;
    if (!clientId) {
      console.warn('No client id present. Please supply the cilentId prop');
      return;
    }
    const resolveUrl = `${SOUNDCLOUD_API_URL}/resolve.json?url=${encodeURIComponent(url)}&client_id=${clientId}`;
    const data = fetchUrl(resolveUrl);
    data.then(res => {
      
      this.cleanData();
      
      if (Array.isArray(res)) {
        res = { tracks: res };
      }
      
      if (res.tracks) {
        this.playlist = res;
      } else {
        this.track = res;
        
        // save timings
        const U = parseURL(url);
        this.track.stream_url += U.hash;
      }
      
      this.duration =
      res.duration && !isNaN(res.duration)
      ? res.duration / 1000 // convert to seconds
      : 0; // no duration is zero
      callback(res);
    })
    .catch(err => console.log(err))

  };


  updateTrack = (url) => {
    console.log('this.updateTrack', url);
    
    this.setState({
      url
    })
    this.start(url);
  }


  playTrack = (index = null) => {
    this.play(index)
    .then(() => {
      console.log('playing:', this.playing);
      
      this.setState({
        playing: this.playing,
        paused: false,
        error: false
      })
      index && index.playlistIndex && this.setState({
        currentTrack: this.playlist.tracks[index.playlistIndex],
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

  play = async (options) => {
    options = options || {};
    let src;
    console.log('options', options);
    const { playlistIndex } = this.state;

    if (options.streamUrl) {
      src = options.streamUrl;
    } else if (this.playlist) {

        src = await this.getPlaylistSrc(options);
        this.setState({
          currentTrack: this.playlist.tracks[this.state.playlistIndex]
        })
        console.log('awatied', src);
      
    } else if (this.track) {
      this.setState({
        currentTrack: this.track
      })
      src = this.track.stream_url;
    }

    console.log(src);
    
    if (!src ) {
        console.error(
          'No track source.'
        );
        return;
    }

    if (this.props.clientId) {
      console.log('before app', src);
      
      src = appendQueryParam(src, 'client_id', this.props.clientId);
    }

    if (src !== this.audio.src) {
      this.audio.src = src;
    }

    this.playing = src;
    console.log(src, playlistIndex);

    const audio = await this.audio.play();
    return audio;
  };

  getPlaylistSrc = (options) => {
    const length = this.playlist.tracks.length;
    const { playlistIndex } = this.state;
    if (length) {
      console.log('length', options);
      
      let src;
      if (options.playlistIndex === undefined) {
        const index = playlistIndex || 0;
        this.setState({
          playlistIndex: index,
        })
        src = this.playlist.tracks[index].stream_url;
      console.log('src', src);
      } else {
        console.log('set to', options.playlistIndex);

        this.setState({
          playlistIndex: options.playlistIndex,
        })
        src = this.playlist.tracks[options.playlistIndex].stream_url;
        console.log('sr', src);
      }

      // be silent if index is out of range
      if (playlistIndex >= length || playlistIndex < 0) {
        console.log('out of range');
        
        this.setState({
          playlistIndex: 0,
        })
        return;
      }
      return src;
    }
  }

  pause = () => {
    this.audio.pause();
    this.setState({
      playing: false
    })
  };

  stop = () => { 
    this.audio.pause();
    this.audio.currentTime = 0;
    this.setState({
      playing: false
    })
  };


  next = (options) => {
    const { playlistIndex } = this.state;
    options = options || {};
    var tracksLength = this.playlist.tracks.length;

    if (playlistIndex >= tracksLength - 1) {
      if (options.loop) {
        this.setState({
          playlistIndex: -1
        })
      } else {
        return;
      }
    }

    if (this.playlist && tracksLength) {
      this.setState(state => ({
        playlistIndex: state.playlistIndex + 1
      }), () => {
        console.log('playing next', this.state.playlistIndex);

        this.playTrack({ playlistIndex: this.state.playlistIndex });
      })
    }
  };

  previous = () =>  {
    const { playlistIndex } = this.state;
    if (playlistIndex <= 0) {
      return;
    }

    if (this.playlist && this.playlist.tracks.length) {
      this.setState(state => ({
        playlistIndex: state.playlistIndex - 1
      }), () => {
        console.log('playing prev', this.state.playlistIndex);
        
        this.playTrack({ playlistIndex: this.state.playlistIndex });
      })
    }
  };
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
    const { children } = this.props;

    return (
      <SC.Provider value={this.state}>
          {children}
      </SC.Provider>
    )
  }
}
export const SoundcloudPlayerUI = () => {

  return (
    <SC.Consumer>
      {({
        controls,
        error,
        playing,
        currentTrack,
        currentTrack: { title, user, id },
        url,
        tracks,
      }) => url ?
        <div className="sc-player">
          <div className="track flex-container flex-container__row align-center">
            <div className="sc-player__items flex-1">

            {tracks && tracks.length > 1 && 
              <div>
              <button onClick={controls.previous}>prev</button>
              <button onClick={controls.next}>next</button>
              </div>
            }
            {title &&
                    <TrackItem
                      hero
                      playing={playing}
                      controls={controls}
                      currentTrack={currentTrack}
                      track={currentTrack}
                      url={url}
                      index={null}
                    />
              }
              {
                tracks && tracks.length &&
                <div>
                  {tracks.map((track, i) => {

                    
                    console.log('i', i);
                    return(
                    <TrackItem
                        playing={playing}
                        controls={controls}
                        currentTrack={currentTrack}
                        track={track}
                        url={url}
                        index={i}
                      />
                  )})
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
  );
}
const TrackItem = ({ controls: { play, pause, previous, next }, hero, playing, track, currentTrack, url, index}) => {
  
  const isPlaying = track.id === currentTrack.id && playing;
  console.log(isPlaying && {index});
  const playlistIndex = index ? { playlistIndex: index } : null;  
  return (
    <div key={track.id} className={`sc-player__item ${isPlaying && !hero && 'highlighted'}`} onClick={() => isPlaying ? pause() : play(playlistIndex, track)}>
    <span className="sc-player__text">
      {hero && <img className="sc-player__thumb" src={currentTrack.artwork_url} />}
      {track.user.username} - {track.title}
      </span>
    <button
      className="sc-player__button play" disabled={!url}
      onClick={() => isPlaying ? pause() : play(playlistIndex, track)}
    >
     { isPlaying ? 
     <PauseIcon className="sc-player__icon play" /> 
     : 
     <PlayIcon className="sc-player__icon pause" /> 
     }
    </button>
    </div>

  )
}
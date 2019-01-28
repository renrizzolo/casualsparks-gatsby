import React from 'react'
import ToggleClass from '../components/ToggleClass'
import WatchConnection from '../components/WatchConnection'
import OfflineError from '../components/OfflineError'
import { InFromBottom } from '../animations'
import { Link } from 'gatsby'
import { kebabCase } from 'lodash'
import PreviewCompatibleImage from '../components/PreviewCompatibleImage'
import PlayButton from './PlayButton'
import { SoundcloudPlayerLite } from '../components/SoundcloudPlayer'

const ReleaseItem = ({ style, data, slug, backgroundColor }) => {
  const now = new Date();
  const releaseDate = new Date(data.datenum);
  const forthcoming = releaseDate > now;

  return (
    <div className="item-outer flex-container flex-container__column">
      <div className="item-meta-container">
        {forthcoming && 
        <span className="item-forthcoming">forthcoming </span>} 
        {data.date && 
        <div className="item-date">{data.date}</div>}
      </div>
    <div
      style={style}
      className={`item background-${backgroundColor}`}
    >
      {/* <SoundcloudPlayerLite 
        className="item-grid__player" 
        soundcloudUrl={data.soundcloudUrl}
      /> */}
      <header className="item-grid__header flex-1">
        <div>
          <div className="item-info flex-container align-center">
            <PlayButton soundcloudUrl={data.soundcloudUrl} />
            <div>
              <h1 className="item-heading">
                <Link to={`/artists/${kebabCase(data.artist)}`}>
                  {data.artist}
                </Link>
              </h1>
              {slug ? (
                <h2 className="item-sub-heading">
                <Link to={slug}>
                  {data.title}
                </Link>
                </h2>
              ) : (
                <h2 className="item-sub-heading">{data.title}</h2>
              )}
            </div>
          </div>
          <div className="link-container">

            {data.links &&
              data.links.map(link => (
                <a
                  key={link.label}
                  target="_blank"
                  rel="noopener"
                  className="item-button item-button__small light-blue shop-link"
                  href={link.url}
                >
                  {link.label}
                </a>
              ))}
          </div>
        </div>
      </header>

      {/*    <WatchConnection render={online => (
        online ?
          (data.previewHTML &&
            <div dangerouslySetInnerHTML={{ __html: data.previewHTML }} />
          )
          :
          <OfflineError />
      )}
      /> */}
      <div className="item-image flex-1">
        <PreviewCompatibleImage imageInfo={data.image} />

      {/*       {data.trackList &&
        <aside>
          <ToggleClass className="track-list" toggleClass="expanded">
            {toggle => (
              <div>
                <h2 onMouseUp={toggle}>Track list <span></span></h2>
                <ol>
                  {data.trackList.map((track, i) => (
                    <li key={i}>{track}</li>
                  ))
                  }
                </ol>
              </div>
            )}
          </ToggleClass>
        </aside>
      } */}
      {/*   <Link className="button full" style={{marginTop: 16}} to={slug}>
        View →
      </Link> */}
      </div>
    </div>
    </div>
  )
}

ReleaseItem.defaultProps = {
  backgroundColor: 'pearl',
  description: false,
}

export default ReleaseItem

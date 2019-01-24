import React from 'react'
import ToggleClass from '../components/ToggleClass';
import WatchConnection from '../components/WatchConnection';
import OfflineError from '../components/OfflineError';
import { InFromBottom } from '../animations';
import { Link } from 'gatsby';
import { kebabCase } from 'lodash'
import PreviewCompatibleImage from '../components/PreviewCompatibleImage';
import { SC } from '../components/SoundcloudPlayer'

const ReleaseItem = ({style, data, slug, description, backgroundColor}) => {

  return (
    <div style={style} show={false} className={`item background-${backgroundColor}`}>
      <header>
        <div className="item-info">
          <Link to={`/artists/${kebabCase(data.artist)}`}>
            <h1 className="item-heading">{data.artist}</h1>
          </Link>
          {slug ? <Link to={slug}><h2 className="item-sub-heading">{data.title}</h2></Link>
            :
            <h2 className="item-sub-heading">{data.title}</h2>
          }
          <div className="link-container">
            {data.links && data.links.map((link) => (
              <a 
                key={link.label}
                target="_blank"
                rel="noopener"
                className="button light-blue shop-link"
                href={link.url}
              >
                {link.label}
              </a>
            ))
            }
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
      <Link className="button full" style={{marginTop: 16}} to={slug}>
        View →
      </Link>
      {
        data.soundcloudUrl && 
        <SC.Consumer>
          {
            ({ updateTrack }) => {            
            return (
              <button onClick={() => updateTrack(data.soundcloudUrl)} class="button blue">Play</button>
            )}
          }
        </SC.Consumer>
      }
    </div>
  )
}

ReleaseItem.defaultProps = {
  backgroundColor: 'pearl',
  description: false
}

export default ReleaseItem

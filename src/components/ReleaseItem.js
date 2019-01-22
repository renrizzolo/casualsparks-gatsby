import React from 'react'
import ToggleClass from '../components/ToggleClass';
import WatchConnection from '../components/WatchConnection';
import OfflineError from '../components/OfflineError';
import { Link } from 'gatsby'

const ReleaseItem = ({data, slug, description, backgroundColor}) => {

  return (
    <div className={`item background-${backgroundColor}`}>
      <header>
        <div className="item-info">
          <h1 className="item-heading">{data.artist}</h1>
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

      <WatchConnection render={online => (
        online ?
          (data.previewHTML &&
            <div dangerouslySetInnerHTML={{ __html: data.previewHTML }} />
          )
          :
          <OfflineError />
      )}
      />

      {data.trackList &&
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
      }
      <Link className="button" to={slug}>
        View →
      </Link>
    </div>
  )
}

ReleaseItem.defaultProps = {
  backgroundColor: 'pearl',
  description: false
}

export default ReleaseItem

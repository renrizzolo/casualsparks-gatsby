import React from "react";
import { animated } from "react-spring";
import { Link } from "gatsby";
import kebabCase from "lodash.kebabcase";
import PreviewCompatibleImage from "../components/PreviewCompatibleImage";
import PlayButton from "./PlayButton";
import ItemButton from "../components/ItemButton";

const ReleaseItem = ({ style, data, slug, backgroundColor }) => {
  const now = new Date();
  const releaseDate = new Date(data.datenum);
  const forthcoming = releaseDate > now;

  return (
    <div className="item-outer flex-container flex-container__column">
      <div className="item-meta-container">
        {forthcoming && <span className="item-forthcoming">forthcoming </span>}
        {data.date && <div className="item-date">{data.date}</div>}
      </div>
      <animated.div
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
                    <Link to={slug}>{data.title}</Link>
                  </h2>
                ) : (
                  <h2 className="item-sub-heading">{data.title}</h2>
                )}
              </div>
            </div>
            <div className="link-container">
              {data.links &&
                data.links.map((link) => (
                  <ItemButton
                    small
                    key={link.label}
                    label={link.label}
                    href={link.url}
                    iconName={link.label.toLowerCase()}
                  />
                ))}
              {data.soundcloudUrl && (
                <ItemButton
                  small
                  className="button-soundcloud"
                  label="SoundCloud"
                  href={data.soundcloudUrl}
                  iconName="soundcloud"
                  iconStyle={{ fill: "#f50", marginRight: 6 }}
                />
              )}
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
          <Link to={slug}>
            <PreviewCompatibleImage imageInfo={data.image} />
          </Link>
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
      </animated.div>
    </div>
  );
};

ReleaseItem.defaultProps = {
  backgroundColor: "pearl",
  description: false,
};

export default ReleaseItem;

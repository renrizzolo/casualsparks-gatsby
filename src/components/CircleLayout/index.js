import React from 'react';
import { Zoom, Fade, FadeZoom } from '../../animations';

const items = [
  {
    key: 'cs-circle-1',
    className: 'cs-circle cs-circle__outer-1',
  },
  {
    key: 'cs-circle-2',
    className: 'cs-circle cs-circle__outer-2',
  },
  {
    key: 'cs-circle-3',
    className: 'cs-circle cs-circle__outer-3',
  },
];

const CircleLayout = ({ children, show, zoom }) => (
  <Fade show={true}>
    {style => (
      <div
        style={style}
        className="flex-center flex-container__row viewport-half"
      >
        <Zoom
          zoom={zoom}
          show={show}
          className="cs-circle darker"
          id="cs-circle"
          style={{
            backgroundImage: "url('https://unsplash.it/700/?random')",
            backgroundSize: 'cover',
            backgroundBlendMode: 'overlay',
          }}
        />
        {children}
        <FadeZoom items={items} />
      </div>
    )}
  </Fade>
);
export default CircleLayout;

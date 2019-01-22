import React from 'react';

import { Transition, Spring, config } from 'react-spring'


export const FadeZoom = ({items, children, ...rest}) => {
	return( 
    <Transition
      items={items} 
      keys={item => item.key}
      from={{ transform: 'scale(0.7)', opacity: 0.01 }}
      enter={{ transform: 'scale(1)', opacity: 0.4 }}
      leave={{ transform: 'scale(0.7)', opacity: 0.01 }}
      {...rest}
    >
{/*       {show =>
        show && (props => <div style={props}>{children}</div>)
      } */}
      {item => props =>
        <div style={props} className={item.className}/>
      }
    </Transition>
  );
}

export const Zoom = ({ children, style, show,...rest }) => (
  <Spring
    from={{ transform: show ? 'scale(6)' : 'scale(1)' }}
    to={{ transform: show ? 'scale(1)' : 'scale(1)' }}
    config={{ tension: 125, friction: 17, delay: 250  }}
  >
    {props => <div {...rest} style={{...props, ...style}}>{children}</div>}
  </Spring>
)

export const Fade = ({children, show, ...rest}) => {
	return( 
    <Spring
      from={{ opacity: 0 }}
      to={{ opacity: 1 }}
      {...rest}
    >
      {props => children(props)}
    </Spring>
  );
}
export const MenuTranslate = ({children, show, ...rest}) => {
	return( 
		<Spring
      from={{
        opacity:  show ? 1 : 0,
        transform: show ? 'perspective(0) translate3d(0, 0, 0)' : 'perspective(200px) translate3d(- 50px, 10px, 20px)',
       
      }}
      to={{
        opacity: !show ? 1 : 0,
        transform: !show ? 'perspective(0) translate3d(0, 0, 0)' : 'perspective(200px) translate3d(- 50px, 10px, 20px)',
      }}
      config={config.gentle} 
      {...rest}
    >
      {props => children(props)}
    </Spring>
  );
}
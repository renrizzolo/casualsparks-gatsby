import React from 'react'

import { Transition, Spring, Trail, config } from 'react-spring'

export const FadeZoom = ({ items, children, ...rest }) => {
  return (
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
      {item => props => <div style={props} className={item.className} />}
    </Transition>
  )
}

export const TrailIn = ({ items, component: Component }) => (
  <Trail
    items={items}
    keys={item => item.key}
    from={{ transform: 'translate3d(0,-40px,0)' }}
    to={{ transform: 'translate3d(0,0px,0)' }}
  >
    {({ node: post }) => props => (
      <div style={props}>
        <Component
          key={post.id}
          slug={post.fields.slug}
          data={post.frontmatter}
        />
      </div>
    )}
  </Trail>
)

export const InFromTop = ({ children, style, className, show, ...rest }) => (
  <Spring
    from={{ transform: show ? 'translateY(-150px)' : 'translateY(0)' }}
    to={{ transform: show ? 'translateY(0)' : 'translateY(-150px)' }}
    config={{ tension: 125, friction: 17, delay: 250 }}
  >
    {props => (
      <div {...rest} className={className} style={{ ...props, ...style }}>
        {children}
      </div>
    )}
  </Spring>
)

export const InFromBottom = ({ children, style, className, show, ...rest }) => (
  <Spring
    from={{ transform: show ? 'translateY(50px)' : 'translateY(0)' }}
    to={{ transform: show ? 'translateY(0)' : 'translateY(50px)' }}
    config={{ tension: 105, friction: 12, delay: 250 }}
  >
    {props => (
      <div {...rest} className={className} style={{ ...props, ...style }}>
        {children}
      </div>
    )}
  </Spring>
)

export const Zoom = ({ children, style, show, zoom, ...rest }) => (
  <Spring
    from={{ transform: show ? 'scale(6)' : 'scale(1)' }}
    to={{ transform: zoom ? 'scale(6)' : 'scale(1)' }}
    config={{ tension: 125, friction: 17, delay: 250 }}
  >
    {props => (
      <div {...rest} style={{ ...props, ...style }}>
        {children}
      </div>
    )}
  </Spring>
)

export const Fade = ({ children, show, ...rest }) => {
  return (
    <Spring from={{ opacity: 0 }} to={{ opacity: 1 }} {...rest}>
      {props => children(props)}
    </Spring>
  )
}
export const MenuTranslate = ({ children, show, ...rest }) => {
  return (
    <Spring
      from={{
        opacity: show ? 1 : 0,
        transform: show
          ? 'translate3d(0px, 0px, 0px)' : 'translate3d(-10px, 10px, 20px)',
      }}
      to={{
        opacity: !show ? 1 : 0,
        transform: !show
          ? 'translate3d(0px, 0px, 0px)' : 'translate3d(-10px, 10px, 20px)',
      }}
      config={config.gentle}
      {...rest}
    >
      {props => children(props)}
    </Spring>
  )
}

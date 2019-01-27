import React from 'react'
import { Trail, Spring, Transition, animated, config } from 'react-spring'
import { ControlButton } from './'
import { Icon } from '../../../img/icons'

const PlayerToggle = ({ togglePlayer, playing, show }) => (
  <div className="sc-player__toggle flex-container flex-center">
    <Transition
      native
      items={show}
      from={{
        opacity: 0,
        position: 'absolute',
        right: '1rem',
        transform: 'translateY(-2rem)',
      }}
      enter={{ opacity: 1, transform: 'translateY(-2rem)' }}
      leave={{ opacity: 0, transform: 'translateY(0)' }}
      config={{ ...config.slow }}
    >
      {show => props =>
        show && (
          <animated.div style={props}>
            <ControlButton
              size={30}
              className="toggle open"
              icon="close"
              fn={togglePlayer}
            />
          </animated.div>
        )}
    </Transition>
    <Transition
      native
      items={show}
      from={{
        position: 'absolute',
        right: '1rem',

        opacity: 1,
        zIndex: -1,
        transform: 'translateY(-25px) scale(0.5)',
      }}
      enter={{
        opacity: 1,
        transform: 'translateY(-75px) scale(1)',
      }}
      leave={{ opacity: 0, transform: 'translateY(-25px), scale(0.5)' }}
      config={{ ...config.slow, delay: 350 }}
    >
      {show => props =>
        !show && (
          <animated.div className="sc-player__open-container" style={props}>
            <div className={playing ? 'pulse' : undefined}>
              <ControlButton
                size={30}
                className={`toggle closed`}
                icon="music"
                fn={togglePlayer}
              />
            </div>
          </animated.div>
        )}
    </Transition>
  </div>
)

export default PlayerToggle

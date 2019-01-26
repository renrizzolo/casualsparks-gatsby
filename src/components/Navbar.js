import React from 'react'
import { Link } from 'gatsby'
import { Location } from '@reach/router'
import { SvgLogo, LogoSmall } from './logo'

import { Zoom, FadeZoom, MenuTranslate } from '../animations'

const Navbar = class extends React.Component {
  state = {
    showMenu: false,
  }
  handleMenu = () => {
    this.setState(state => ({
      showMenu: !state.showMenu,
    }))
  }

  stripSlash = path => {
    return path.replace(/\//g, '')
  }

  render() {
    return (
      <Location>
        {({ navigate, location: { pathname } }) => (
          <React.Fragment>
            <span
              className={
                this.state.showMenu
                  ? `menu-button open ${this.stripSlash(pathname)}`
                  : `menu-button ${this.stripSlash(pathname)}`
              }
            >
              <a onClick={this.handleMenu}>
                {this.state.showMenu ? 'close' : 'menu'}
              </a>
            </span>
            <MenuTranslate key="nav" show={!this.state.showMenu}>
              {style => (
                <Menu
                  style={style}
                  className={`mobile ${
                    this.state.showMenu ? 'open' : 'closed'
                  } ${this.stripSlash(pathname)}`}
                />
              )}
            </MenuTranslate>

            <Menu className={`desktop ${this.stripSlash(pathname)}`} />
          </React.Fragment>
        )}
      </Location>
    )
  }
}

const Menu = props => {
  return (
    <ul
      style={props.style}
      role="navigation"
      aria-label="Primary"
      className={`nav ${props.className}`}
    >
      <LogoSmall />
      <li>
        <Link to="/" activeClassName="active">
          Home
        </Link>
      </li>
      <li>
        <Link to="/music" activeClassName="active">
          Music
        </Link>
      </li>
      <li>
        <Link to="/about" activeClassName="active">
          About
        </Link>
      </li>
      <li>
        <Link to="/contact" activeClassName="active">
          Contact
        </Link>
      </li>
    </ul>
  )
}

export default Navbar

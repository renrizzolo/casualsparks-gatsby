import React, { Component } from 'react'
import Helmet from 'react-helmet'
import { StaticQuery, graphql } from 'gatsby'
import CircleLayout from './CircleLayout'
import { Fade } from '../animations'
import Navbar from './Navbar'
import '../styles/index.scss'
import SoundcloudPlayerProvider, {
  SoundcloudPlayerUI,
} from './SoundcloudPlayer'

class TemplateWrapper extends Component {
  state = {
    mounted: false,
    zoom: false,
  }

  componentDidMount = () => {
    const scrollEl = document.getElementById('scroll-width')
    const scrollbarWidth = scrollEl.offsetWidth - scrollEl.clientWidth
    const root = document.documentElement
    const originalOffset = getComputedStyle(root).getPropertyValue(
      '--menu-offset'
    )

    root.style.setProperty('--menu-offset', originalOffset - scrollbarWidth)

    setTimeout(() => {
      this.setState({
        mounted: true,
      })
    }, 1000)
  }

  // componentWillReceiveProps(nextProps) {
  //   if (nextProps.pageContext.layout === 'circle' && this.props.pageContext.layout === 'square') {
  //     console.log('didupdate', this.props.pageContext);
  //     this.setState({
  //       zoom: true
  //     })
  //   }
  //   if (nextProps.pageContext.layout === 'square' && this.props.pageContext.layout === 'circle') {
  //     this.setState({
  //       zoom: false
  //     })
  //   }
  // }

  render() {
    const { children, pageContext } = this.props
    console.log('context', pageContext)
    return (
      <StaticQuery
        query={graphql`
          query HeadingQuery {
            site {
              siteMetadata {
                title
                description
              }
            }
          }
        `}
        render={data => (
          <div>
            <Helmet>
              <html lang="en" />
              <title>{data.site.siteMetadata.title}</title>
              <meta
                name="description"
                content={data.site.siteMetadata.description}
              />
              <link
                rel="icon"
                type="image/png"
                href="/img/Casual-Sparks-light-blue-32.png"
                sizes="32x32"
              />
              <meta name="theme-color" content="#fff" />
              <meta property="og:type" content="business.business" />
              <meta
                property="og:title"
                content={data.site.siteMetadata.title}
              />
              <meta property="og:url" content="/" />
              <meta
                property="og:image"
                content="/img/Casual-Sparks-light-blue-600.png"
              />
            </Helmet>
            <div className="scroll-width" id="scroll-width" />
            <Navbar />
            <div
              className={`page ${pageContext &&
                pageContext.title &&
                pageContext.title.toLowerCase()}`}
            >
              <SoundcloudPlayerProvider clientId="a7c99e975fa37c393cb1a6d89d5c1e0b">
                {pageContext && pageContext.layout === 'circle' ? (
                  <CircleLayout
                    show={!this.state.mounted}
                    zoom={this.state.zoom}
                  >
                    {children}
                  </CircleLayout>
                ) : (
                  <Fade show={this.state.mounted}>
                    {style => <div style={style}>{children}</div>}
                  </Fade>
                )}
                <SoundcloudPlayerUI />
              </SoundcloudPlayerProvider>
            </div>
          </div>
        )}
      />
    )
  }
}

export default TemplateWrapper

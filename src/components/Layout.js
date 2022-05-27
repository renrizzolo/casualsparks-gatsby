import React, { Component } from 'react';
import CircleLayout from './CircleLayout';
import { Fade } from '../animations';
import Navbar from './Navbar';
import '../styles/index.scss';
import SoundcloudPlayerProvider, {
  SoundcloudPlayerUI,
} from './SoundcloudPlayer';

class TemplateWrapper extends Component {
  state = {
    mounted: false,
    zoom: false,
  };

  componentDidMount = () => {

    setTimeout(() => {
      this.setState({
        mounted: true,
      });
    }, 1000);
  };

  render() {
    const { children, pageContext } = this.props;
    return (

      <div>

        <div className="scroll-width" id="scroll-width" />
        <Navbar />
        <div
          className={`page ${pageContext &&
            pageContext.title &&
            pageContext.title.toLowerCase()}`}
        >
          <SoundcloudPlayerProvider clientId="a7c99e975fa37c393cb1a6d89d5c1e0b">
            {pageContext && pageContext.layout && (
              <div>
                {pageContext && pageContext.layout === 'square' ? (
                  <Fade show={this.state.mounted}>
                    {style => <div style={style}>{children}</div>}
                  </Fade>
                ) : (
                  <CircleLayout
                    show={!this.state.mounted}
                    zoom={this.state.zoom}
                  >
                    {children}
                  </CircleLayout>
                )}
              </div>
            )}
            <SoundcloudPlayerUI />
          </SoundcloudPlayerProvider>
        </div>
      </div>
    );
  }
}

export default TemplateWrapper;

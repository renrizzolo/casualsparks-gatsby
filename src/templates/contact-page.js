import React from 'react';
import PropTypes from 'prop-types';
import { graphql } from 'gatsby';
import SocialLink from '../components/SocialLink';
import { Fade } from '../animations/';
import { HTMLContent } from '../components/Content';
import ContactForm from '../components/ContactForm';
import ToggleClass from '../components/ToggleClass';
import Head from '../components/Head';

export const ContactPageTemplate = ({ title, links, html }) => {
  return (
    <Fade>
      {style => (
        <div style={style} className="circle-text flex-container__column">
          <ToggleClass>
            {(toggle, toggled) => (
              <div>
                {!toggled ? (
                  <div>
                    <h1 className="heading">{title}</h1>
                    <div className="social">
                      {links.map((item, i) => (
                        <SocialLink
                          key={i}
                          title={item.label}
                          url={item.url}
                          icon={item.icon}
                        />
                      ))}
                    </div>
                    <footer>
                      <HTMLContent content={html} />
                    </footer>
                  </div>
                ) : (
                  <ContactForm />
                )}
                <button class="button dark-blue" onClick={toggle}>
                  {!toggled ? 'email →' : '←'}
                </button>
              </div>
            )}
          </ToggleClass>
        </div>
      )}
    </Fade>
  );
};

ContactPageTemplate.propTypes = {
  html: PropTypes.object,
  title: PropTypes.string.isRequired,
  links: PropTypes.shape({
    label: PropTypes.string,
    icon: PropTypes.string,
    url: PropTypes.string,
  }),
};

const ContactPage = ({ data }) => {
  const { markdownRemark: post } = data;

  return (
    <>
      <Head
        title={post.frontmatter.title}
      />
      <ContactPageTemplate
        html={post.html}
        title={post.frontmatter.title}
        links={post.frontmatter.links}
      />
    </>
  );
};

ContactPage.propTypes = {
  data: PropTypes.object.isRequired,
};

export default ContactPage;

export const contactPageQuery = graphql`
  query ContactPage($id: String!) {
    markdownRemark(id: { eq: $id }) {
      html
      frontmatter {
        path
        title
        links {
          label
          icon
          url
        }
      }
    }
  }
`;

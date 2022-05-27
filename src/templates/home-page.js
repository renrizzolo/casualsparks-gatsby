import React from 'react';
import PropTypes from 'prop-types';
import { graphql } from 'gatsby';
import { SvgLogo } from '../components/logo';
import { Fade } from '../animations/';
import Head from '../components/Head';

export const HomePageTemplate = ({ title, content, contentComponent }) => {
  return (
    <Fade key="circle-text">
      {style => (
        <div
          style={style}
          className="circle-text circle-text__home flex-center flex-container__column"
        >
          <SvgLogo />
        </div>
      )}
    </Fade>
  );
};

HomePageTemplate.propTypes = {
  title: PropTypes.string.isRequired,
  content: PropTypes.string,
  contentComponent: PropTypes.func,
};

const HomePage = ({ data }) => {
  return (
    <>
      <Head
        title={'Home'}
      />
      <HomePageTemplate />
    </>
  )
};

HomePage.propTypes = {
  data: PropTypes.object.isRequired,
};

export default HomePage;

export const homePageQuery = graphql`
  query HomePage($id: String!) {
    markdownRemark(id: { eq: $id }) {
      html
      frontmatter {
        path
        title
      }
    }
  }
`;

import React from 'react';
import PropTypes from 'prop-types';
import { graphql } from 'gatsby';

import '../styles/common/item-grid.scss';
import PageLayout from '../components/PageLayout';
import Releases from '../components/Releases';
import Head from '../components/Head';
const MusicPageTemplate = ({ title, sections }) => {
  return (
    <PageLayout title={title} backgroundColor="blue">
      <Grid sections={sections} />
    </PageLayout>
  );
};

const Grid = ({ sections }) => {
  return sections.map(section => (
    <section key={section.title} className="item-grid">
      <h1 className="heading item-grid__heading">
        <span className="dark-blue-bkg">{section.title}</span>
      </h1>
      <Releases section={section} />
    </section>
  ));
};

// MusicPageTemplate.propTypes = {
// 	image: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
// 	title: PropTypes.string,
// 	heading: PropTypes.string,
// 	description: PropTypes.string,
// 	intro: PropTypes.shape({
// 		blurbs: PropTypes.array,
// 	}),
// 	main: PropTypes.shape({
// 		heading: PropTypes.string,
// 		description: PropTypes.string,
// 		image1: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
// 		image2: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
// 		image3: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
// 	}),
// 	testimonials: PropTypes.array,
// 	fullImage: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
// 	pricing: PropTypes.shape({
// 		heading: PropTypes.string,
// 		description: PropTypes.string,
// 		plans: PropTypes.array,
// 	}),
// }

const MusicPage = ({ data }) => {
  const { frontmatter } = data.markdownRemark;

  return (
    <>
      <Head title={frontmatter.title} />
      <MusicPageTemplate
        title={frontmatter.title}
        sections={frontmatter.sections}
      />
    </>
  );
};
MusicPage.propTypes = {
  data: PropTypes.shape({
    markdownRemark: PropTypes.shape({
      frontmatter: PropTypes.object,
    }),
  }),
};

export default MusicPage;

export const musicPageQuery = graphql`
  query MusicPage($id: String!) {
    markdownRemark(id: { eq: $id }) {
      frontmatter {
        title
        sections {
          title
          type
        }
      }
    }
  }
`;

import React from 'react';
import PropTypes from 'prop-types';
import { graphql } from 'gatsby'
import { Fade } from '../animations';
import { Link } from '@reach/router';
import '../styles/common/item-grid.scss';
import ToggleClass from '../components/ToggleClass';
import WatchConnection from '../components/WatchConnection';
import OfflineError from '../components/OfflineError';
import PageLayout from '../components/PageLayout';

const MusicPageTemplate = ({title, sections}) => {
	return (
		<PageLayout title={title}  backgroundColor="blue">
			<Grid sections={sections}/>
		</PageLayout>
	);
}

const Grid = ({sections}) => {
		return (
				sections.map(section => (
					<section className="item-grid">
						<h1 className="heading item-grid__heading"><span className="dark-blue-bkg">{section.title}</span></h1>
						{	section.items.map((item) => (
							<Item
								key={item.id}
								data={item}
							/>
							))
							}
						</section>
					))
				
		);
}


const Item = (props) => {
	const { data } = props;
	return (
			<div className="item background-pearl">
				<header>
					<div className="item-info">
						<h1 className="item-heading">{data.artist}</h1>
					{data.id ? <Link to={`/release/${data.id}`}><h2 className="item-sub-heading">{data.name}</h2></Link>
						:
						<h2 className="item-sub-heading">{data.name}</h2>
					}
						<div className="link-container">
							{data.links && data.links.map((link) => (
								<a key={link.name} target="_blank" rel="noopener" className="button light-blue shop-link" href={link.url}>{link.name}</a>
							))
							}
						</div>
					</div>
				</header>

				<WatchConnection render={ online => (
					online ? 
					(data.previewHTML &&
						<div dangerouslySetInnerHTML={{ __html: data.previewHTML }} />
					)
					:
						<OfflineError/>
					)}
				/>

				{data.trackList &&
					<aside>
						<ToggleClass className="track-list" toggleClass="expanded">
							{toggle => (
								<div>
								<h2 onMouseUp={toggle}>Track list <span></span></h2>
									<ol>
									{	data.trackList.map((track, i) => (
										<li key={i}>{track}</li>
										))
									}
									</ol>
								</div>
							)}
						</ToggleClass>
					</aside>
				}
			</div>
	)
}

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
	const { frontmatter } = data.markdownRemark

	return (
			<MusicPageTemplate
				title={frontmatter.title}
				sections={frontmatter.sections}
			/>
	)
}
MusicPage.propTypes = {
	data: PropTypes.shape({
		markdownRemark: PropTypes.shape({
			frontmatter: PropTypes.object,
		}),
	}),
}

export default MusicPage;


export const musicPageQuery = graphql`
  query MusicPage($id: String!) {
    markdownRemark(id: { eq: $id }) {
      frontmatter {
        title
        sections {
          title 
          items {
						name
						artist
						id
						previewHTML
		    		description
						trackList
						links {
							name
							url
						}
					}
        }  
      }
    }
  }
`

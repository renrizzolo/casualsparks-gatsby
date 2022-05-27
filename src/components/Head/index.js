import React from "react"
import { Helmet } from "react-helmet"
import { useLocation } from "@reach/router"
import { useStaticQuery, graphql } from "gatsby"
import { getImage } from "gatsby-plugin-image"

const Head = ({ title, description, image, article, titleTemplate = '%s' }) => {
  const { pathname } = useLocation()
  const { site } = useStaticQuery(query)
  const {
    defaultTitle,
    defaultDescription,
    siteUrl,
    defaultImage,
    twitterUsername,
  } = site.siteMetadata

  let imgSrc = image

  if (imgSrc?.childImageSharp) {
    const img = getImage(image.childImageSharp)
    console.log(img)
    imgSrc = img.images?.fallback?.src
  }

  const seo = {
    title: title || defaultTitle,
    description: description || defaultDescription,
    image: `${siteUrl}${imgSrc || defaultImage}`,
    url: `${siteUrl}${pathname}`,
  }

  console.log({ seo })

  return (
    <Helmet titleTemplate={titleTemplate}>
      <html lang="en" />
      <title>{`${seo.title}`}</title>
      <meta
        name="description"
        content={seo.description}
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
        content={`${seo.title}`}
      />
      {seo.title && <meta name="twitter:title" content={seo.title} />}

      {seo.description && (
        <meta name="twitter:description" content={seo.description} />
      )}

      {seo.url && <meta property="og:url" content={seo.url} />}

      <meta
        property="og:image"
        content={seo.image}
      />
      {twitterUsername && (
        <meta name="twitter:creator" content={twitterUsername} />
      )}
    </Helmet>
  )
}
export default Head


const query = graphql`
  query SEO {
    site {
      siteMetadata {
        defaultTitle: title
        defaultDescription: description
        siteUrl: url
        defaultImage: image
        twitterUsername
      }
    }
  }
`
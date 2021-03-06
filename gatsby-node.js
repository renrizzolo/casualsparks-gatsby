const _ = require("lodash");
const nodePath = require("path");
const { createFilePath } = require("gatsby-source-filesystem");
const { fmImagesToRelative } = require("gatsby-remark-relative-images");

exports.createPages = ({ actions, graphql }) => {
  const { createPage } = actions;

  return graphql(`
    {
      allMarkdownRemark(limit: 1000) {
        edges {
          node {
            id
            fields {
              slug
            }
            frontmatter {
              path
              title
              templateKey
            }
          }
        }
      }
    }
  `).then((result) => {
    if (result.errors) {
      result.errors.forEach((e) => console.error(e.toString()));
      return Promise.reject(result.errors);
    }

    const posts = result.data.allMarkdownRemark.edges;
    const circlePaths = ["contact", "about", "home"];
    posts.forEach(({ node }) => {
      const { id, frontmatter } = node;
      const { path, templateKey, title } = frontmatter;
      // console.log(node);
      console.log(
        path,
        "context",
        path && circlePaths.includes(path) ? "circle" : "square"
      );

      createPage({
        path: node.fields.slug,
        component: nodePath.resolve(`src/templates/${String(templateKey)}.js`),
        // additional data can be passed via context
        context: {
          id,
          title,
          layout: path && circlePaths.includes(path) ? "circle" : "square",
        },
      });
    });
  });
};

// exports.onCreatePage = ({ page, actions }) => {
//   const { createPage } = actions
//     createPage({
//       ...page,
//       context: {
//         layout: page.path.match(/contact|about/) ? 'circle' : 'square'
//       }
//     })
// }

exports.onCreateNode = ({ node, actions, getNode }) => {
  const { createNodeField } = actions;
  fmImagesToRelative(node); // convert image paths for gatsby images

  if (node.internal.type === `MarkdownRemark`) {
    const value = createFilePath({ node, getNode });
    createNodeField({
      name: `slug`,
      node,
      value,
    });
  }
};

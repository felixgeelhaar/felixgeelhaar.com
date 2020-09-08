const { hot } = require("react-hot-loader/root")

// prefer default export if available
const preferDefault = m => (m && m.default) || m


exports.components = {
  "component---cache-dev-404-page-js": hot(preferDefault(require("/Users/f0978/Development/private/js/felixgeelhaar.com/.cache/dev-404-page.js"))),
  "component---src-pages-index-tsx": hot(preferDefault(require("/Users/f0978/Development/private/js/felixgeelhaar.com/src/pages/index.tsx")))
}


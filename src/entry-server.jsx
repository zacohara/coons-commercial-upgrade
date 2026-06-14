import { renderToString } from 'react-dom/server'
import App, { headFor, CITIES, PAGES, BLOG } from './App.jsx'

// Every route the site should pre-render to a static HTML file.
export const ROUTES = [
  'home',
  ...Object.keys(PAGES),            // repair, maintenance, coatings, replacement, inspections, emergency, about, projects
  ...CITIES.map((c) => c.slug),      // katy, the-woodlands, ...
  'blog',
  ...BLOG.map((b) => 'blog/' + b.slug),
]

export function render(route) {
  const html = renderToString(<App route={route} />)
  return { html, head: headFor(route) }
}

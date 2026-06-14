import { StrictMode } from 'react'
import { hydrateRoot } from 'react-dom/client'
import App from './App.jsx'

// Pages are pre-rendered to static HTML at build time, so we hydrate the
// existing server-rendered markup instead of creating a fresh root.
hydrateRoot(
  document.getElementById('root'),
  <StrictMode>
    <App />
  </StrictMode>,
)

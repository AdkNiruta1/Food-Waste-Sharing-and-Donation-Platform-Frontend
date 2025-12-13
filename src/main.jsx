import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import AppContext from './context/ContextApp.jsx';
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AppContext>
      <App />
    </AppContext>
  </StrictMode>,
)

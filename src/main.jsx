import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import { AuthProvider } from './context/AuthContext.jsx';
import AppContext from './context/ContextApp.jsx';
createRoot(document.getElementById('root')).render(
  <AppContext>
    <AuthProvider>
      <App />
    </AuthProvider>
  </AppContext>
)

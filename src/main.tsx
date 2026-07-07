/**
 * Punto de entrada principal de React y Vite.
 * Monta el componente raíz `App` en el DOM dentro de un `StrictMode`.
 */
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

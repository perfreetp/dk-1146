import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import './index.css'
import { usePersonalityStore } from './stores/personalityStore'
import { useMonitorStore } from './stores/monitorStore'

usePersonalityStore.getState().initialize();
useMonitorStore.getState().initialize();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

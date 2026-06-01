import './index.css'
import './App.css'
import { createRoot } from 'react-dom/client'
import App from './App'
import { AppProvider } from './store/AppStore'

const root = document.getElementById('root');
if (root) {
  createRoot(root).render(
    <AppProvider>
      <App />
    </AppProvider>
  );
}

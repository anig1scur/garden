import { HashRouter } from 'react-router-dom';
import { createRoot } from 'react-dom/client';
import App from '@/App';
import "./style.css";

const container = document.getElementById('root');
const root = createRoot(container!);
const app = (
  <HashRouter>
    <App />
  </HashRouter>
);
root.render(app);

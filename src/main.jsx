import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '/src/css/index.css'
import { UI } from './components/UI';

createRoot(document.getElementById('root')).render(
	<StrictMode>
		<UI />
	</StrictMode>,
);
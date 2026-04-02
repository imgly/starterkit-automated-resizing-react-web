/**
 * CE.SDK Automated Resizing Starterkit - React Entry Point
 *
 * Content-aware resizing for social media formats using CE.SDK and React.
 *
 * @see https://img.ly/docs/cesdk/starterkits/auto-resize/
 */

import type { Configuration } from '@cesdk/cesdk-js';
import { createRoot } from 'react-dom/client';

import App from './app/App';

// ============================================================================
// Configuration
// ============================================================================

const config: Configuration = {
  // Unique user identifier for analytics (customize for your app)
  userId: 'starterkit-automated-resizing-user',

  // Local assets (uncomment and set path for self-hosted assets)
  // baseURL: `/assets/`,

  // License key (required for production)
  // license: 'YOUR_LICENSE_KEY',
};

// ============================================================================
// Initialize React Application
// ============================================================================

const container = document.getElementById('root');
if (!container) {
  throw new Error('Root container not found');
}

const root = createRoot(container);
root.render(<App config={config} />);

import { BACKEND_URI as ENV_BACKEND_URI } from '@env';

// Fallback to localhost if @env is undefined or unparsed
export const BACKEND_URI = ENV_BACKEND_URI || 'http://localhost:5000';

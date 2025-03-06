export const ASSEMBLYAI_API_KEY = process.env.REACT_APP_ASSEMBLYAI_API_KEY as string;
export const ASSEMBLYAI_API_URL = 'https://api.assemblyai.com/v2';
export const ASSEMBLYAI_POLLING_INTERVAL = 3000;
export const ASSEMBLYAI_POLLING_TIMEOUT = 30000;
export const ASSEMBLYAI_UPLOAD_ENDPOINT = `${ASSEMBLYAI_API_URL}/upload`;
export const ASSEMBLYAI_TRANSCRIPT_ENDPOINT = `${ASSEMBLYAI_API_URL}/transcript`;
export const ASSEMBLYAI_TRANSCRIPT_POLLING_ENDPOINT = `${ASSEMBLYAI_API_URL}/transcript/:id`;

export const RANDOM_USERS_API_URL = 'https://randomuser.me/api/?results=';
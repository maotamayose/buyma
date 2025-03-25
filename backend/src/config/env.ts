export function getGoogleApiConfig() {
    const API_KEY = process.env.GOOGLE_API_KEY;
    const CX = process.env.GOOGLE_CSE_ID;
  
    if (!API_KEY || !CX) {
      throw new Error('Missing GOOGLE_API_KEY or GOOGLE_CSE_ID in environment variables.');
    }
  
    return { API_KEY, CX };
  }
  
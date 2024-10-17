import { wait } from '../utils.js';

async function fetchWithRetry(url: string, tries = 3, responseType: 'text' | 'json' = 'text'): Promise<any> {
  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Fetch failed with status: ${response.status}`);
    }

    return responseType === 'json' ? await response.json() : await response.text();
  } catch (error) {
    if (tries > 1) {
      const delay = Math.floor(Math.random() * 1000); // Add some jitter to the delay

      console.log(`Will retry in ${delay}`);
      await wait(delay);

      return fetchWithRetry(url, tries - 1, responseType);
    } else {
      // Handle error type explicitly
      if (error instanceof Error) {
        throw new Error(`Failed to fetch after ${3 - tries + 1} attempts: ${error.message}`);
      } else {
        throw new Error('Unknown error occurred during fetch.');
      }
    }
  }
}

// Function to fetch text with retry
export async function fetchText(url: string): Promise<string> {
  return fetchWithRetry(url, 3, 'text');
}

// Function to fetch JSON with retry
export async function fetchJson(url: string): Promise<any> {
  return fetchWithRetry(url, 3, 'json');
}

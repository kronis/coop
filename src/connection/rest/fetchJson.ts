export async function fetchJson(url: string): Promise<unknown> {
  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Failed to fetch from ${url}. Status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Error fetching JSON from ${url}: ${error.message}`);
    } else {
      throw new Error(`Error fetching JSON from ${url}: ${String(error)}`);
    }
  }
}

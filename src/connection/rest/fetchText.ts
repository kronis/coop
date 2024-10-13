export async function fetchText(url: string): Promise<any> {
  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Failed to fetch from ${url}. Status: ${response.status}`);
    }

    const data = await response.text();
    return data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Error fetching JSON from ${url}: ${error.message}`);
    } else {
      throw new Error(`Error fetching JSON from ${url}: ${String(error)}`);
    }
  }
}

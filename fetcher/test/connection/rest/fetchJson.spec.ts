import nock from 'nock';
import { expect } from 'chai';
import { fetchJson } from '../../../src/connection/index.js';

describe('fetchJson', () => {
  const mockUrl = 'http://example.com/data.json';

  beforeEach(() => {
    // Clean up any mocks to prevent test pollution
    nock.cleanAll();
  });

  it('should fetch and parse JSON data successfully', async () => {
    const mockResponse = { name: 'Test', value: 123 };

    // Mock the external request
    nock('http://example.com').get('/data.json').reply(200, mockResponse);

    const data = await fetchJson(mockUrl);
    expect(data).to.deep.equal(mockResponse);
  });

  it('should throw an error when the response is not ok', async () => {
    // Mock a failure response
    nock('http://example.com').get('/data.json').reply(500);

    try {
      await fetchJson(mockUrl);
      throw new Error('Test failed: Expected error was not thrown');
    } catch (error) {
      if (error instanceof Error) {
        expect(error.message).to.include('Failed to fetch after');
      } else {
        throw new Error('Test failed: Unexpected error type');
      }
    }
  });

  it('should throw an error if the fetch fails', async () => {
    // Mock a network error
    nock('http://example.com').get('/data.json').replyWithError('Network error');

    try {
      await fetchJson(mockUrl);
      throw new Error('Test failed: Expected error was not thrown');
    } catch (error) {
      if (error instanceof Error) {
        expect(error.message).to.include('Failed to fetch after');
      } else {
        throw new Error('Test failed: Unexpected error type');
      }
    }
  });
});

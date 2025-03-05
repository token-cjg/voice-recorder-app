/**
 * @jest-environment jsdom
 */
import { waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';

describe('Index entry point with RTL', () => {
  beforeEach(() => {
    const root = document.createElement('div');
    root.id = 'root';
    document.body.appendChild(root);
    jest.resetModules();
  });

  afterEach(() => {
    const root = document.getElementById('root');
    if (root) {
      document.body.removeChild(root);
    }
  });

  it('renders without crashing and shows App content', async () => {
    await import('./index');

    await waitFor(() => {
      const rootElement = document.getElementById('root');
      expect(rootElement?.childElementCount).toBeGreaterThan(0);
    });
  });

  it('calls reportWebVitals', async () => {
    const reportModule = await import('./reportWebVitals');
    jest.spyOn(reportModule, 'default').mockImplementation(() => {});

    await import('./index');
    expect(reportModule.default).toHaveBeenCalled();
  });
});
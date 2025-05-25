import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import App from './App';

// Mock API responses
jest.mock('./api', () => ({
  chatWithGPT: jest.fn().mockResolvedValue('GPT mock response'),
  chatWithDeepSeek: jest.fn().mockResolvedValue('DeepSeek mock response'),
}));

describe('App Component', () => {
  test('renders the app header', () => {
    render(<App />);
    expect(screen.getByText(/AI Chat Comparison/i)).toBeInTheDocument();
  });

  test('renders ChatGPT and DeepSeek cards', () => {
    render(<App />);
    expect(screen.getByText(/ChatGPT/i)).toBeInTheDocument();
    expect(screen.getByText(/DeepSeek/i)).toBeInTheDocument();
  });

  test('renders input and send button', () => {
    render(<App />);
    expect(screen.getByPlaceholderText(/Ask something amazing/i)).toBeInTheDocument();
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  test('shows loading state and displays responses after submit', async () => {
    render(<App />);

    const input = screen.getByPlaceholderText(/Ask something amazing/i);
    const button = screen.getByRole('button');

    // Enter text and submit
    fireEvent.change(input, { target: { value: 'Hello' } });
    fireEvent.click(button);

    // Loading indicator
    expect(await screen.findByText(/Generating response.../i)).toBeInTheDocument();

    // Wait for mocked response to appear
    await waitFor(() => {
      expect(screen.getByText('GPT mock response')).toBeInTheDocument();
      // eslint-disable-next-line testing-library/no-wait-for-multiple-assertions
      expect(screen.getByText('DeepSeek mock response')).toBeInTheDocument();
    });
  });

  test('handles empty input gracefully', () => {
    render(<App />);
    const button = screen.getByRole('button');
    fireEvent.click(button); // No input
    expect(screen.queryByText(/Generating response.../i)).not.toBeInTheDocument();
  });
});

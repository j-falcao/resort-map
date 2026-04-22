import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, test, expect, vi, beforeEach } from 'vitest';
import MapGrid from '../components/MapGrid';
import * as api from '../api';

// 🔥 Mock the whole module
vi.mock('../api');

describe('MapGrid', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('renders loading then map', async () => {
    vi.mocked(api.fetchMap).mockResolvedValue({
      grid: [[{ type: 'pool' }]],
    });

    render(<MapGrid />);

    expect(screen.getByText(/loading map/i)).toBeInTheDocument();

    // wait for render after fetch
    await screen.findByRole('img');
  });

  test('shows message when clicking unavailable cabana', async () => {
    vi.mocked(api.fetchMap).mockResolvedValue({
      grid: [[{ type: 'cabana', id: 'A1', available: false }]],
    });

    render(<MapGrid />);

    const cabana = await screen.findByAltText('cabana-A1');
    await userEvent.click(cabana);

    expect(
      await screen.findByText(/cabana is not available/i)
    ).toBeInTheDocument();
  });

  test('opens modal when cabana is available', async () => {
    vi.mocked(api.fetchMap).mockResolvedValue({
      grid: [[{ type: 'cabana', id: 'A1', available: true }]],
    });

    render(<MapGrid />);

    const cabana = await screen.findByAltText('cabana-A1');
    await userEvent.click(cabana);

    expect(await screen.findByText(/book cabana/i)).toBeInTheDocument();
    expect(screen.getByText(/Cabana: A1/)).toBeInTheDocument();
  });

  test('successful booking flow', async () => {
    vi.mocked(api.fetchMap).mockResolvedValue({
      grid: [[{ type: 'cabana', id: 'A1', available: true }]],
    });

    vi.mocked(api.bookCabana).mockResolvedValue({ success: true, cabanaId: 'A1' });

    render(<MapGrid />);

    const cabana = await screen.findByAltText('cabana-A1');
    await userEvent.click(cabana);

    await userEvent.type(screen.getByLabelText(/room number/i), '101');
    await userEvent.type(screen.getByLabelText(/guest name/i), 'John');

    await userEvent.click(screen.getByText(/confirm/i));

    expect(
      await screen.findByText(/booking confirmed/i)
    ).toBeInTheDocument();
  });

  test('shows error on failed booking', async () => {
    vi.mocked(api.fetchMap).mockResolvedValue({
      grid: [[{ type: 'cabana', id: 'A1', available: true }]],
    });

    vi.mocked(api.bookCabana).mockRejectedValue(
      new Error('Booking failed')
    );

    render(<MapGrid />);

    const cabana = await screen.findByAltText('cabana-A1');
    await userEvent.click(cabana);

    await userEvent.type(screen.getByLabelText(/room number/i), '101');
    await userEvent.type(screen.getByLabelText(/guest name/i), 'John');

    await userEvent.click(screen.getByText(/confirm/i));

    expect(
      await screen.findByText(/booking failed/i)
    ).toBeInTheDocument();
  });

  test('refreshes map after successful booking', async () => {
    const firstMap = {
      grid: [[{ type: 'cabana', id: 'A1', available: true }]],
    };

    const updatedMap = {
      grid: [[{ type: 'cabana', id: 'A1', available: false }]],
    };

    vi.mocked(api.fetchMap)
      .mockResolvedValueOnce(firstMap)
      .mockResolvedValueOnce(updatedMap);

    vi.mocked(api.bookCabana).mockResolvedValue({});

    render(<MapGrid />);

    const cabana = await screen.findByAltText('cabana-A1');

    await userEvent.click(cabana);

    await userEvent.type(screen.getByLabelText(/room number/i), '101');
    await userEvent.type(screen.getByLabelText(/guest name/i), 'John');

    await userEvent.click(screen.getByText(/confirm/i));

    await screen.findByText(/booking confirmed/i);

    expect(api.fetchMap).toHaveBeenCalledTimes(2);
  });
});
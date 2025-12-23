import { render, screen, waitFor } from '@testing-library/react';
import MyReservationsPage from '@/app/(dashboard)/meals/reservations/page';
import { getMyReservations, cancelReservation } from '@/services/meal.service';
import { toast } from 'sonner';

// Mock meal service
jest.mock('@/services/meal.service', () => ({
    getMyReservations: jest.fn(),
    cancelReservation: jest.fn(),
}));

// Mock framer-motion
jest.mock('framer-motion', () => ({
    motion: {
        div: ({ children, className, ...props }) => (
            <div className={className} data-testid="motion-div" {...props}>
                {children}
            </div>
        ),
    },
    AnimatePresence: ({ children }) => <>{children}</>,
}));

// Mock UI components
jest.mock('@/components/ui/button', () => ({
    Button: ({ children, onClick, disabled, className, variant, ...props }) => (
        <button onClick={onClick} disabled={disabled} className={className} {...props}>
            {children}
        </button>
    ),
}));

// Mock sonner
jest.mock('sonner', () => ({
    toast: {
        success: jest.fn(),
        error: jest.fn(),
    },
}));

describe('MyReservationsPage', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('renders page with title', async () => {
        getMyReservations.mockResolvedValueOnce({ data: [] });

        render(<MyReservationsPage />);
        expect(screen.getByText('Rezervasyonlarım')).toBeInTheDocument();
    });

    it('shows filter tabs', async () => {
        getMyReservations.mockResolvedValueOnce({ data: [] });

        render(<MyReservationsPage />);
        expect(screen.getByText(/Tümü/)).toBeInTheDocument();
        expect(screen.getByText(/Gelecek/)).toBeInTheDocument();
        expect(screen.getByText(/Geçmiş/)).toBeInTheDocument();
    });

    it('shows empty state when no reservations', async () => {
        getMyReservations.mockResolvedValueOnce({ data: [] });

        render(<MyReservationsPage />);

        await waitFor(() => {
            expect(screen.getByText('Henüz rezervasyonunuz yok')).toBeInTheDocument();
        });
    });

    it('displays reservations when available', async () => {
        getMyReservations.mockResolvedValueOnce({
            data: [
                {
                    id: 1,
                    cafeteriaName: 'Main Cafeteria',
                    date: '2025-01-15',
                    mealType: 'lunch',
                    qrCode: 'QR123',
                    status: 'reserved'
                }
            ]
        });

        render(<MyReservationsPage />);

        await waitFor(() => {
            expect(screen.getByText('Main Cafeteria')).toBeInTheDocument();
        });
    });

    it('handles API error', async () => {
        getMyReservations.mockRejectedValueOnce(new Error('API Error'));

        render(<MyReservationsPage />);

        await waitFor(() => {
            expect(toast.error).toHaveBeenCalledWith('Rezervasyonlar yüklenemedi');
        });
    });
});

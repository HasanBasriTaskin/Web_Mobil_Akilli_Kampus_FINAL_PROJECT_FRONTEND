import { render, screen, waitFor } from '@testing-library/react';
import MyEventsPage from '@/app/(dashboard)/my-events/page';
import { getMyEvents, cancelEventRegistration } from '@/services/event.service';
import { toast } from 'sonner';

// Mock event service
jest.mock('@/services/event.service', () => ({
    getMyEvents: jest.fn(),
    cancelEventRegistration: jest.fn(),
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

describe('MyEventsPage', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('renders page with title', async () => {
        getMyEvents.mockResolvedValueOnce({ data: [] });

        render(<MyEventsPage />);

        await waitFor(() => {
            expect(screen.getByText('Etkinliklerim')).toBeInTheDocument();
        });
    });

    it('shows empty state when no events', async () => {
        getMyEvents.mockResolvedValueOnce({ data: [] });

        render(<MyEventsPage />);

        await waitFor(() => {
            expect(screen.getByText(/Henüz etkinliğe kayıt olmadınız/)).toBeInTheDocument();
        });
    });

    it('displays events when available', async () => {
        getMyEvents.mockResolvedValueOnce({
            data: [
                {
                    id: '1',
                    event: {
                        id: '1',
                        title: 'Tech Conference',
                        date: '2025-01-15T10:00:00',
                        startTime: '10:00',
                        endTime: '12:00',
                        location: 'Main Hall',
                        category: 'conference'
                    },
                    qrCode: 'QR123',
                    checkedIn: false
                }
            ]
        });

        render(<MyEventsPage />);

        await waitFor(() => {
            expect(screen.getByText('Tech Conference')).toBeInTheDocument();
        });
    });

    it('handles API error', async () => {
        getMyEvents.mockRejectedValueOnce(new Error('API Error'));

        render(<MyEventsPage />);

        await waitFor(() => {
            expect(toast.error).toHaveBeenCalledWith('Kayıtlı etkinlikler yüklenemedi');
        });
    });
});

import { render, screen, waitFor } from '@testing-library/react';
import EventDetailPage from '@/app/(dashboard)/events/[id]/page';
import { getEventById, registerToEvent } from '@/services/event.service';
import { toast } from 'sonner';

// Mock next/navigation
jest.mock('next/navigation', () => ({
    useRouter: () => ({
        push: jest.fn(),
    }),
    useParams: () => ({ id: '1' }),
}));

// Mock event service
jest.mock('@/services/event.service', () => ({
    getEventById: jest.fn(),
    registerToEvent: jest.fn(),
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
}));

// Mock UI components
jest.mock('@/components/ui/button', () => ({
    Button: ({ children, onClick, className, disabled, variant, ...props }) => (
        <button onClick={onClick} className={className} disabled={disabled} {...props}>
            {children}
        </button>
    ),
}));

jest.mock('@/components/ui/input', () => ({
    Input: ({ placeholder, ...props }) => (
        <input placeholder={placeholder} {...props} />
    ),
}));

// Mock sonner
jest.mock('sonner', () => ({
    toast: {
        success: jest.fn(),
        error: jest.fn(),
    },
}));

describe('EventDetailPage', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('shows loading state initially', () => {
        getEventById.mockReturnValue(new Promise(() => { }));

        render(<EventDetailPage />);
        // Should show loading skeleton
        const skeletons = document.querySelectorAll('.animate-pulse');
        expect(skeletons.length).toBeGreaterThan(0);
    });

    it('shows event not found when event is null', async () => {
        getEventById.mockResolvedValueOnce({ data: null });

        render(<EventDetailPage />);

        await waitFor(() => {
            expect(screen.getByText('Etkinlik bulunamadı')).toBeInTheDocument();
        });
    });

    it('displays event details when loaded', async () => {
        getEventById.mockResolvedValueOnce({
            data: {
                id: '1',
                title: 'Tech Conference 2024',
                description: 'Annual tech conference',
                date: '2025-01-15',
                startTime: '09:00',
                endTime: '17:00',
                location: 'Main Hall',
                category: 'conference',
                capacity: 100,
                registeredCount: 50,
                registrationDeadline: '2025-01-10',
                isPaid: false
            }
        });

        render(<EventDetailPage />);

        await waitFor(() => {
            expect(screen.getByText('Tech Conference 2024')).toBeInTheDocument();
        });
    });

    it('shows capacity information', async () => {
        getEventById.mockResolvedValueOnce({
            data: {
                id: '1',
                title: 'Tech Conference',
                description: 'Description',
                date: '2025-01-15',
                startTime: '09:00',
                endTime: '17:00',
                location: 'Main Hall',
                category: 'conference',
                capacity: 100,
                registeredCount: 50,
                registrationDeadline: '2025-01-10'
            }
        });

        render(<EventDetailPage />);

        await waitFor(() => {
            expect(screen.getByText('Kapasite Bilgileri')).toBeInTheDocument();
        });
    });

    it('handles API error', async () => {
        getEventById.mockRejectedValueOnce(new Error('API Error'));

        render(<EventDetailPage />);

        await waitFor(() => {
            expect(toast.error).toHaveBeenCalledWith('Etkinlik detayı yüklenemedi');
        });
    });
});

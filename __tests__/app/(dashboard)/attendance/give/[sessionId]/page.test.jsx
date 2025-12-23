import { render, screen, waitFor } from '@testing-library/react';
import GiveAttendancePage from '@/app/(dashboard)/attendance/give/[sessionId]/page';
import { getSessionById, checkIn } from '@/services/attendance.service';
import { toast } from 'sonner';

// Mock next/navigation
jest.mock('next/navigation', () => ({
    useParams: () => ({ sessionId: '1' }),
}));

// Mock attendance service
jest.mock('@/services/attendance.service', () => ({
    getSessionById: jest.fn(),
    checkIn: jest.fn(),
    calculateDistance: jest.fn(() => 10),
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

// Mock sonner
jest.mock('sonner', () => ({
    toast: {
        success: jest.fn(),
        error: jest.fn(),
    },
}));

// Mock geolocation
Object.defineProperty(global.navigator, 'geolocation', {
    value: {
        getCurrentPosition: jest.fn().mockImplementation((success) =>
            success({
                coords: {
                    latitude: 41.0082,
                    longitude: 28.9784,
                    accuracy: 10
                }
            })
        ),
    },
    writable: true
});

describe('GiveAttendancePage', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('shows loading state initially', () => {
        getSessionById.mockReturnValue(new Promise(() => { }));

        render(<GiveAttendancePage />);
        // Check for loading spinner
        const spinners = document.querySelectorAll('.animate-spin');
        expect(spinners.length).toBeGreaterThan(0);
    });

    it('shows session not found error', async () => {
        getSessionById.mockRejectedValueOnce(new Error('Not found'));

        render(<GiveAttendancePage />);

        await waitFor(() => {
            expect(screen.getByText('Oturum bulunamadı')).toBeInTheDocument();
        });
    });

    it('displays session info when loaded', async () => {
        getSessionById.mockResolvedValueOnce({
            data: {
                id: 1,
                courseName: 'CS101 - Intro to CS',
                courseCode: 'CS101',
                sectionNumber: '01',
                date: '2025-01-15',
                latitude: 41.0082,
                longitude: 28.9784,
                geofenceRadius: 50
            }
        });

        render(<GiveAttendancePage />);

        await waitFor(() => {
            expect(screen.getByText('CS101 - Intro to CS')).toBeInTheDocument();
        });
    });

    it('shows location section', async () => {
        getSessionById.mockResolvedValueOnce({
            data: {
                id: 1,
                courseName: 'CS101',
                courseCode: 'CS101',
                sectionNumber: '01',
                date: '2025-01-15'
            }
        });

        render(<GiveAttendancePage />);

        await waitFor(() => {
            expect(screen.getByText('Konumunuz')).toBeInTheDocument();
        });
    });

    it('shows check-in button', async () => {
        getSessionById.mockResolvedValueOnce({
            data: {
                id: 1,
                courseName: 'CS101',
                courseCode: 'CS101',
                sectionNumber: '01',
                date: '2025-01-15'
            }
        });

        render(<GiveAttendancePage />);

        await waitFor(() => {
            expect(screen.getByText('Yoklama Ver')).toBeInTheDocument();
        });
    });
});

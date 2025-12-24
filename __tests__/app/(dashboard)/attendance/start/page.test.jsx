import { render, screen, waitFor } from '@testing-library/react';
import StartAttendancePage from '@/app/(dashboard)/attendance/start/page';
import { getMySessions, createSession, closeSession } from '@/services/attendance.service';
import { toast } from 'sonner';

// Mock attendance service
jest.mock('@/services/attendance.service', () => ({
    getMySessions: jest.fn(),
    createSession: jest.fn(),
    closeSession: jest.fn(),
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
const mockGeolocation = {
    getCurrentPosition: jest.fn().mockImplementation((success) =>
        success({
            coords: {
                latitude: 41.0082,
                longitude: 28.9784,
                accuracy: 10
            }
        })
    ),
    watchPosition: jest.fn(),
    clearWatch: jest.fn()
};

Object.defineProperty(global.navigator, 'geolocation', {
    value: mockGeolocation,
    writable: true
});

describe('StartAttendancePage', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        getMySessions.mockResolvedValue({ data: [] });
    });

    it('renders page with title', async () => {
        render(<StartAttendancePage />);
        expect(screen.getByText('Yoklama Başlat')).toBeInTheDocument();
    });

    it('shows new session form when no active session', async () => {
        render(<StartAttendancePage />);

        await waitFor(() => {
            expect(screen.getByText('Yeni Oturum')).toBeInTheDocument();
        });
    });

    it('shows section selector', async () => {
        render(<StartAttendancePage />);

        await waitFor(() => {
            expect(screen.getByText('Seksiyon seçin...')).toBeInTheDocument();
        });
    });

    it('shows how it works section', async () => {
        render(<StartAttendancePage />);
        expect(screen.getByText('Nasıl Çalışır?')).toBeInTheDocument();
    });

    it('shows GPS based info', async () => {
        render(<StartAttendancePage />);
        expect(screen.getByText('GPS Tabanlı')).toBeInTheDocument();
    });

    it('shows start button', async () => {
        render(<StartAttendancePage />);
        expect(screen.getByText('Oturumu Başlat')).toBeInTheDocument();
    });

    it('shows active session when one exists', async () => {
        getMySessions.mockResolvedValue({
            data: [{
                id: 1,
                courseName: 'CS101',
                sectionNumber: '01',
                status: 'Open',
                qrCode: 'ABC123',
                presentCount: 10,
                totalStudents: 30
            }]
        });

        render(<StartAttendancePage />);

        await waitFor(() => {
            expect(screen.getByText('Aktif Oturum')).toBeInTheDocument();
        });
    });
});

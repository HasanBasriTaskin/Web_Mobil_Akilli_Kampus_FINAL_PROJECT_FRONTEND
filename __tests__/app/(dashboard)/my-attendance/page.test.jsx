import { render, screen, waitFor } from '@testing-library/react';
import MyAttendancePage from '@/app/(dashboard)/my-attendance/page';
import { getMyAttendance } from '@/services/attendance.service';
import { toast } from 'sonner';

// Mock attendance service
jest.mock('@/services/attendance.service', () => ({
    getMyAttendance: jest.fn(),
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

describe('MyAttendancePage', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('renders page with title', async () => {
        getMyAttendance.mockResolvedValueOnce({ data: [] });

        render(<MyAttendancePage />);
        expect(screen.getByText('Devam Durumum')).toBeInTheDocument();
    });

    it('shows overall stats section', async () => {
        getMyAttendance.mockResolvedValueOnce({ data: [] });

        render(<MyAttendancePage />);
        expect(screen.getByText('Genel Oran')).toBeInTheDocument();
    });

    it('shows empty state when no courses', async () => {
        getMyAttendance.mockResolvedValueOnce({ data: [] });

        render(<MyAttendancePage />);

        await waitFor(() => {
            expect(screen.getByText('Yoklama verisi yok')).toBeInTheDocument();
        });
    });

    it('displays course attendance when available', async () => {
        getMyAttendance.mockResolvedValueOnce({
            data: [
                {
                    courseCode: 'CS101',
                    courseName: 'Introduction to CS',
                    totalSessions: 10,
                    attendedSessions: 8,
                    excusedSessions: 1,
                    attendancePercentage: 90,
                    warningLevel: 'OK'
                }
            ]
        });

        render(<MyAttendancePage />);

        await waitFor(() => {
            expect(screen.getByText('CS101')).toBeInTheDocument();
            expect(screen.getByText('Introduction to CS')).toBeInTheDocument();
        });
    });

    it('calculates and displays overall percentage', async () => {
        getMyAttendance.mockResolvedValueOnce({
            data: [
                {
                    courseCode: 'CS101',
                    courseName: 'CS',
                    totalSessions: 10,
                    attendedSessions: 8,
                    excusedSessions: 1,
                    attendancePercentage: 90,
                    warningLevel: 'OK'
                },
                {
                    courseCode: 'MATH101',
                    courseName: 'Math',
                    totalSessions: 10,
                    attendedSessions: 7,
                    excusedSessions: 2,
                    attendancePercentage: 90,
                    warningLevel: 'OK'
                }
            ]
        });

        render(<MyAttendancePage />);

        await waitFor(() => {
            expect(screen.getByText('20')).toBeInTheDocument(); // Total sessions
            expect(screen.getByText('15')).toBeInTheDocument(); // Attended sessions
            expect(screen.getByText('3')).toBeInTheDocument();  // Excused sessions
        });
    });

    it('handles API error', async () => {
        getMyAttendance.mockRejectedValueOnce(new Error('API Error'));

        render(<MyAttendancePage />);

        await waitFor(() => {
            expect(toast.error).toHaveBeenCalledWith('Veriler yüklenemedi');
        });
    });
});

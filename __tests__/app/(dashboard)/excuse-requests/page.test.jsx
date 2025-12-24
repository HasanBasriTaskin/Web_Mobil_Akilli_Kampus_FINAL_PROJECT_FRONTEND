import { render, screen, waitFor } from '@testing-library/react';
import ExcuseRequestsPage from '@/app/(dashboard)/excuse-requests/page';
import { getExcuseRequests, approveExcuseRequest, rejectExcuseRequest } from '@/services/attendance.service';
import { toast } from 'sonner';

// Mock attendance service
jest.mock('@/services/attendance.service', () => ({
    getExcuseRequests: jest.fn(),
    approveExcuseRequest: jest.fn(),
    rejectExcuseRequest: jest.fn(),
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

describe('ExcuseRequestsPage', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('renders page with title', async () => {
        getExcuseRequests.mockResolvedValueOnce({ data: [] });

        render(<ExcuseRequestsPage />);
        expect(screen.getByText('Mazeret Talepleri')).toBeInTheDocument();
    });

    it('shows filter buttons', async () => {
        getExcuseRequests.mockResolvedValueOnce({ data: [] });

        render(<ExcuseRequestsPage />);
        expect(screen.getByText('Bekleyen')).toBeInTheDocument();
        expect(screen.getByText('Onaylanan')).toBeInTheDocument();
    });

    it('shows empty state when no requests', async () => {
        getExcuseRequests.mockResolvedValueOnce({ data: [] });

        render(<ExcuseRequestsPage />);

        await waitFor(() => {
            expect(screen.getByText('Talep bulunamadı')).toBeInTheDocument();
        });
    });

    it('displays requests when available', async () => {
        getExcuseRequests.mockResolvedValueOnce({
            data: [
                {
                    id: 1,
                    studentName: 'John Doe',
                    studentNumber: '12345',
                    sessionDate: '2024-01-15',
                    courseCode: 'CS101',
                    reason: 'Sick leave',
                    status: 'Pending'
                }
            ]
        });

        render(<ExcuseRequestsPage />);

        await waitFor(() => {
            expect(screen.getByText('John Doe')).toBeInTheDocument();
        });
    });

    it('handles API error', async () => {
        getExcuseRequests.mockRejectedValueOnce(new Error('API Error'));

        render(<ExcuseRequestsPage />);

        await waitFor(() => {
            expect(toast.error).toHaveBeenCalledWith('Talepler yüklenemedi');
        });
    });
});

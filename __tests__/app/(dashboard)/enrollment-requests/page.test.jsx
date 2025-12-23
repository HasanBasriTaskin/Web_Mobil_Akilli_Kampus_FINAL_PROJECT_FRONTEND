import { render, screen, waitFor } from '@testing-library/react';
import FacultyEnrollmentsPage from '@/app/(dashboard)/enrollment-requests/page';
import * as apiClient from '@/services/api-client';
import { toast } from 'sonner';

// Mock api-client
jest.mock('@/services/api-client', () => ({
    get: jest.fn(),
    post: jest.fn(),
}));

// Mock auth store
jest.mock('@/stores/auth.store', () => ({
    useAuthStore: () => ({ user: { id: '1', role: 'Faculty' } }),
}));

// Mock framer-motion
jest.mock('framer-motion', () => ({
    motion: {
        div: ({ children, className, ...props }) => (
            <div className={className} data-testid="motion-div" {...props}>
                {children}
            </div>
        ),
        button: ({ children, className, onClick, ...props }) => (
            <button className={className} onClick={onClick} data-testid="motion-button" {...props}>
                {children}
            </button>
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

describe('FacultyEnrollmentsPage', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('renders page with title', async () => {
        apiClient.get.mockResolvedValueOnce({ data: [] });

        render(<FacultyEnrollmentsPage />);
        expect(screen.getByText('Kayıt Talepleri')).toBeInTheDocument();
    });

    it('shows sections header', async () => {
        apiClient.get.mockResolvedValueOnce({ data: [] });

        render(<FacultyEnrollmentsPage />);

        await waitFor(() => {
            expect(screen.getByText('Derslerim')).toBeInTheDocument();
        });
    });

    it('shows empty state when no sections', async () => {
        apiClient.get.mockResolvedValueOnce({ data: [] });

        render(<FacultyEnrollmentsPage />);

        await waitFor(() => {
            expect(screen.getByText('Henüz ders atanmamış')).toBeInTheDocument();
        });
    });

    it('displays sections when available', async () => {
        apiClient.get.mockResolvedValueOnce({
            data: [
                {
                    id: 1,
                    courseCode: 'CS101',
                    courseName: 'Intro to CS',
                    pendingCount: 3
                }
            ]
        });

        render(<FacultyEnrollmentsPage />);

        await waitFor(() => {
            expect(screen.getByText('CS101')).toBeInTheDocument();
        });
    });

    it('handles API error', async () => {
        apiClient.get.mockRejectedValueOnce(new Error('API Error'));

        render(<FacultyEnrollmentsPage />);

        await waitFor(() => {
            expect(toast.error).toHaveBeenCalledWith('Dersler yüklenemedi');
        });
    });
});

import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import GradesPage from '@/app/(dashboard)/grades/page';
import { getMyGrades } from '@/services/grade.service';
import { toast } from 'sonner';

// Mock grade service
jest.mock('@/services/grade.service', () => ({
    getMyGrades: jest.fn(),
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

describe('GradesPage', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('renders page with title', async () => {
        getMyGrades.mockResolvedValueOnce({ data: [] });

        render(<GradesPage />);
        expect(screen.getByText('Notlarım')).toBeInTheDocument();
    });

    it('renders download button', async () => {
        getMyGrades.mockResolvedValueOnce({ data: [] });

        render(<GradesPage />);
        expect(screen.getByText('Transkript İndir')).toBeInTheDocument();
    });

    it('shows empty state when no grades', async () => {
        getMyGrades.mockResolvedValueOnce({ data: [] });

        render(<GradesPage />);

        await waitFor(() => {
            expect(screen.getByText('Henüz not bulunmuyor')).toBeInTheDocument();
        });
    });

    it('displays grades when available', async () => {
        getMyGrades.mockResolvedValueOnce({
            data: [
                {
                    enrollmentId: 1,
                    courseCode: 'CS101',
                    courseName: 'Introduction to CS',
                    credits: 3,
                    midtermGrade: 85,
                    finalGrade: 90,
                    letterGrade: 'AA'
                }
            ]
        });

        render(<GradesPage />);

        await waitFor(() => {
            expect(screen.getByText('CS101')).toBeInTheDocument();
            expect(screen.getByText('Introduction to CS')).toBeInTheDocument();
            expect(screen.getByText('AA')).toBeInTheDocument();
        });
    });

    it('handles download click', async () => {
        getMyGrades.mockResolvedValueOnce({ data: [] });

        render(<GradesPage />);
        const downloadBtn = screen.getByText('Transkript İndir');
        fireEvent.click(downloadBtn);

        await waitFor(() => {
            expect(toast.success).toHaveBeenCalledWith('Transkript indirildi');
        });
    });

    it('handles API error', async () => {
        getMyGrades.mockRejectedValueOnce(new Error('API Error'));

        render(<GradesPage />);

        await waitFor(() => {
            expect(toast.error).toHaveBeenCalledWith('Veriler yüklenemedi');
        });
    });
});

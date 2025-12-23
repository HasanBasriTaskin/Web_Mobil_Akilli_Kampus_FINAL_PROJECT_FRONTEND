import { render, screen, waitFor } from '@testing-library/react';
import GradebookPage from '@/app/(dashboard)/gradebook/[sectionId]/page';
import { getSectionStudents, submitGrade } from '@/services/academic.service';
import { toast } from 'sonner';

// Mock next/navigation
jest.mock('next/navigation', () => ({
    useRouter: () => ({
        back: jest.fn(),
    }),
    useParams: () => ({ sectionId: '1' }),
}));

// Mock academic service
jest.mock('@/services/academic.service', () => ({
    getSectionStudents: jest.fn(),
    submitGrade: jest.fn(),
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
        warning: jest.fn(),
    },
}));

describe('GradebookPage', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('renders page with title', async () => {
        getSectionStudents.mockResolvedValueOnce({ data: [] });

        render(<GradebookPage />);

        await waitFor(() => {
            expect(screen.getByText('Not Defteri')).toBeInTheDocument();
        });
    });

    it('shows back button', async () => {
        getSectionStudents.mockResolvedValueOnce({ data: [] });

        render(<GradebookPage />);

        await waitFor(() => {
            expect(screen.getByText('Geri')).toBeInTheDocument();
        });
    });

    it('shows export button', async () => {
        getSectionStudents.mockResolvedValueOnce({ data: [] });

        render(<GradebookPage />);

        await waitFor(() => {
            expect(screen.getByText('Dışa Aktar')).toBeInTheDocument();
        });
    });

    it('shows save button', async () => {
        getSectionStudents.mockResolvedValueOnce({ data: [] });

        render(<GradebookPage />);

        await waitFor(() => {
            expect(screen.getByText('Kaydet')).toBeInTheDocument();
        });
    });

    it('shows empty state when no students', async () => {
        getSectionStudents.mockResolvedValueOnce({ data: [] });

        render(<GradebookPage />);

        await waitFor(() => {
            expect(screen.getByText('Öğrenci bulunamadı')).toBeInTheDocument();
        });
    });

    it('displays students when available', async () => {
        getSectionStudents.mockResolvedValueOnce({
            data: [
                {
                    studentId: 1,
                    enrollmentId: 1,
                    studentName: 'John Doe',
                    studentNumber: '12345',
                    midtermGrade: 80,
                    finalGrade: 85
                }
            ]
        });

        render(<GradebookPage />);

        await waitFor(() => {
            expect(screen.getByText('John Doe')).toBeInTheDocument();
        });
    });

    it('handles API error', async () => {
        getSectionStudents.mockRejectedValueOnce(new Error('API Error'));

        render(<GradebookPage />);

        await waitFor(() => {
            expect(toast.error).toHaveBeenCalledWith('Öğrenciler yüklenemedi');
        });
    });
});

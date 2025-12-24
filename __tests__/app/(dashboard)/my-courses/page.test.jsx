import { render, screen, waitFor } from '@testing-library/react';
import MyCoursesPage from '@/app/(dashboard)/my-courses/page';
import { getMyCourses, dropCourse } from '@/services/enrollment.service';
import { toast } from 'sonner';

// Mock enrollment service
jest.mock('@/services/enrollment.service', () => ({
    getMyCourses: jest.fn(),
    dropCourse: jest.fn(),
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

describe('MyCoursesPage', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('renders page with title', async () => {
        const { getMyCourses } = require('@/services/enrollment.service');
        getMyCourses.mockResolvedValueOnce({ data: [] });

        render(<MyCoursesPage />);
        expect(screen.getByText('Kayıtlı Derslerim')).toBeInTheDocument();
    });

    it('shows loading state', () => {
        const { getMyCourses } = require('@/services/enrollment.service');
        getMyCourses.mockImplementation(() => new Promise(() => { }));

        render(<MyCoursesPage />);
        expect(screen.getByText(/Yükleniyor/)).toBeInTheDocument();
    });

    it('shows empty state when no courses', async () => {
        const { getMyCourses } = require('@/services/enrollment.service');
        getMyCourses.mockResolvedValueOnce({ data: [] });

        render(<MyCoursesPage />);

        await waitFor(() => {
            expect(screen.getByText('Henüz kayıtlı dersiniz yok')).toBeInTheDocument();
        });
    });

    it('displays courses when available', async () => {
        const { getMyCourses } = require('@/services/enrollment.service');
        getMyCourses.mockResolvedValueOnce({
            data: [
                {
                    enrollmentId: 1,
                    courseCode: 'CS101',
                    courseName: 'Introduction to CS',
                    sectionNumber: 'A',
                    instructorName: 'Dr. Smith',
                    credits: 3,
                    status: 'Approved'
                }
            ]
        });

        render(<MyCoursesPage />);

        await waitFor(() => {
            expect(screen.getByText('CS101')).toBeInTheDocument();
            expect(screen.getByText('Introduction to CS')).toBeInTheDocument();
        });
    });

    it('handles API error', async () => {
        const { getMyCourses } = require('@/services/enrollment.service');
        getMyCourses.mockRejectedValueOnce(new Error('API Error'));

        render(<MyCoursesPage />);

        await waitFor(() => {
            expect(toast.error).toHaveBeenCalledWith('Dersler yüklenemedi');
        });
    });
});

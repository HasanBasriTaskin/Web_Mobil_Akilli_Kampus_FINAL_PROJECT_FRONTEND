import { render, screen, waitFor } from '@testing-library/react';
import CourseDetailPage from '@/app/(dashboard)/courses/[id]/page';
import { getCourseById } from '@/services/course.service';
import { enrollInCourse } from '@/services/enrollment.service';
import { toast } from 'sonner';

// Mock next/navigation
jest.mock('next/navigation', () => ({
    useRouter: () => ({
        push: jest.fn(),
        back: jest.fn(),
    }),
    useParams: () => ({ id: '1' }),
}));

// Mock services
jest.mock('@/services/course.service', () => ({
    getCourseById: jest.fn(),
}));

jest.mock('@/services/enrollment.service', () => ({
    enrollInCourse: jest.fn(),
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

describe('CourseDetailPage', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('shows loading state initially', () => {
        getCourseById.mockReturnValue(new Promise(() => { }));

        render(<CourseDetailPage />);
        const skeletons = document.querySelectorAll('.animate-pulse');
        expect(skeletons.length).toBeGreaterThan(0);
    });

    it('shows course not found when course is null', async () => {
        getCourseById.mockResolvedValueOnce({ data: null });

        render(<CourseDetailPage />);

        await waitFor(() => {
            expect(screen.getByText('Ders bulunamadı')).toBeInTheDocument();
        });
    });

    it('displays course details when loaded', async () => {
        getCourseById.mockResolvedValueOnce({
            data: {
                id: '1',
                code: 'CS101',
                name: 'Introduction to Computer Science',
                credits: 3,
                description: 'Intro course to CS'
            }
        });

        render(<CourseDetailPage />);

        await waitFor(() => {
            expect(screen.getByText('CS101')).toBeInTheDocument();
            expect(screen.getByText('Introduction to Computer Science')).toBeInTheDocument();
        });
    });

    it('shows back button', async () => {
        getCourseById.mockResolvedValueOnce({
            data: {
                id: '1',
                code: 'CS101',
                name: 'Intro to CS',
                credits: 3
            }
        });

        render(<CourseDetailPage />);

        await waitFor(() => {
            expect(screen.getByText('Geri')).toBeInTheDocument();
        });
    });

    it('displays sections when available', async () => {
        getCourseById.mockResolvedValueOnce({
            data: {
                id: '1',
                code: 'CS101',
                name: 'Intro to CS',
                credits: 3,
                sections: [
                    {
                        id: 1,
                        sectionNumber: '01',
                        instructorName: 'Dr. Smith',
                        capacity: 30,
                        availableSeats: 10,
                        semester: 'Fall',
                        year: '2024'
                    }
                ]
            }
        });

        render(<CourseDetailPage />);

        await waitFor(() => {
            expect(screen.getByText('Açık Seksiyonlar')).toBeInTheDocument();
        });
    });

    it('handles API error', async () => {
        getCourseById.mockRejectedValueOnce(new Error('API Error'));

        render(<CourseDetailPage />);

        await waitFor(() => {
            expect(toast.error).toHaveBeenCalledWith('Ders bilgileri yüklenemedi');
        });
    });
});

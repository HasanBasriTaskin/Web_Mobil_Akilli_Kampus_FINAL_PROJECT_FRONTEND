import { render, screen, waitFor } from '@testing-library/react';
import AttendanceReportsListPage from '@/app/(dashboard)/attendance/reports/page';
import { getSections } from '@/services/academic.service';

// Mock next/navigation
jest.mock('next/navigation', () => ({
    useRouter: () => ({
        push: jest.fn(),
    }),
}));

// Mock auth store
jest.mock('@/stores/auth.store', () => ({
    useAuthStore: () => ({
        user: { id: '1', role: 'Faculty' }
    }),
}));

// Mock academic service
jest.mock('@/services/academic.service', () => ({
    getSections: jest.fn(),
}));

// Mock academic mock data
jest.mock('@/mocks/academic.mock', () => ({
    mockSections: []
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
    Button: ({ children, className, ...props }) => (
        <button className={className} {...props}>{children}</button>
    ),
}));

// Mock sonner
jest.mock('sonner', () => ({
    toast: {
        success: jest.fn(),
        error: jest.fn(),
    },
}));

describe('AttendanceReportsListPage', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('renders page with title', async () => {
        getSections.mockResolvedValueOnce({ success: true, data: [] });

        render(<AttendanceReportsListPage />);

        await waitFor(() => {
            expect(screen.getByText('Yoklama Raporları')).toBeInTheDocument();
        });
    });

    it('shows empty state when no sections', async () => {
        getSections.mockResolvedValueOnce({ success: true, data: [] });

        render(<AttendanceReportsListPage />);

        await waitFor(() => {
            expect(screen.getByText('Henüz size atanmış ders bulunmuyor')).toBeInTheDocument();
        });
    });

    it('displays sections when available', async () => {
        getSections.mockResolvedValueOnce({
            success: true,
            data: [
                {
                    id: 1,
                    sectionNumber: '01',
                    course: { code: 'CS101', name: 'Intro to CS' },
                    instructor: { id: '1' },
                    enrolledCount: 30
                }
            ]
        });

        render(<AttendanceReportsListPage />);

        await waitFor(() => {
            expect(screen.getByText('CS101')).toBeInTheDocument();
            expect(screen.getByText('Intro to CS')).toBeInTheDocument();
        });
    });

    it('shows report view button', async () => {
        getSections.mockResolvedValueOnce({
            success: true,
            data: [
                {
                    id: 1,
                    sectionNumber: '01',
                    course: { code: 'CS101', name: 'Intro to CS' },
                    instructor: { id: '1' }
                }
            ]
        });

        render(<AttendanceReportsListPage />);

        await waitFor(() => {
            expect(screen.getByText('Raporu Görüntüle')).toBeInTheDocument();
        });
    });
});

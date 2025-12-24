import { render, screen, waitFor } from '@testing-library/react';
import AttendanceReportPage from '@/app/(dashboard)/attendance/report/[sectionId]/page';
import { getAttendanceReport } from '@/services/attendance.service';
import { toast } from 'sonner';

// Mock next/navigation
jest.mock('next/navigation', () => ({
    useParams: () => ({ sectionId: '1' }),
}));

// Mock attendance service
jest.mock('@/services/attendance.service', () => ({
    getAttendanceReport: jest.fn(),
}));

// Mock academic mock data
jest.mock('@/mocks/academic.mock', () => ({
    mockAttendanceReport: {
        totalStudents: 20,
        goodAttendance: 15,
        warningAttendance: 3,
        criticalAttendance: 2,
        section: { course: { name: 'CS101' }, sectionNumber: '01' },
        students: []
    }
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
    Button: ({ children, onClick, className, ...props }) => (
        <button onClick={onClick} className={className} {...props}>{children}</button>
    ),
}));

jest.mock('@/components/ui/input', () => ({
    Input: ({ placeholder, ...props }) => (
        <input placeholder={placeholder} {...props} />
    ),
}));

// Mock sonner
jest.mock('sonner', () => ({
    toast: {
        success: jest.fn(),
        error: jest.fn(),
    },
}));

describe('AttendanceReportPage', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('shows loading state initially', () => {
        getAttendanceReport.mockReturnValue(new Promise(() => { }));

        render(<AttendanceReportPage />);
        expect(screen.getByText('Yükleniyor...')).toBeInTheDocument();
    });

    it('renders page with title', async () => {
        getAttendanceReport.mockResolvedValueOnce({
            success: true,
            data: {
                totalStudents: 20,
                goodAttendance: 15,
                warningAttendance: 3,
                criticalAttendance: 2,
                section: { course: { name: 'CS101' }, sectionNumber: '01' },
                students: []
            }
        });

        render(<AttendanceReportPage />);

        await waitFor(() => {
            expect(screen.getByText('Yoklama Raporu')).toBeInTheDocument();
        });
    });

    it('shows summary cards', async () => {
        getAttendanceReport.mockResolvedValueOnce({
            success: true,
            data: {
                totalStudents: 20,
                goodAttendance: 15,
                warningAttendance: 3,
                criticalAttendance: 2,
                section: { course: { name: 'CS101' }, sectionNumber: '01' },
                students: []
            }
        });

        render(<AttendanceReportPage />);

        await waitFor(() => {
            expect(screen.getByText('Toplam Öğrenci')).toBeInTheDocument();
            expect(screen.getByText('İyi Durumda')).toBeInTheDocument();
        });
    });

    it('shows export button', async () => {
        getAttendanceReport.mockResolvedValueOnce({
            success: true,
            data: {
                totalStudents: 20,
                section: { course: { name: 'CS101' }, sectionNumber: '01' },
                students: []
            }
        });

        render(<AttendanceReportPage />);

        await waitFor(() => {
            expect(screen.getByText("Excel'e Aktar")).toBeInTheDocument();
        });
    });

    it('shows date filter', async () => {
        getAttendanceReport.mockResolvedValueOnce({
            success: true,
            data: {
                totalStudents: 20,
                section: { course: { name: 'CS101' }, sectionNumber: '01' },
                students: []
            }
        });

        render(<AttendanceReportPage />);

        await waitFor(() => {
            expect(screen.getByText('Tarih Filtresi:')).toBeInTheDocument();
            expect(screen.getByText('Filtrele')).toBeInTheDocument();
        });
    });
});

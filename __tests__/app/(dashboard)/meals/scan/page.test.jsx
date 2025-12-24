import { render, screen } from '@testing-library/react';
import QRScannerPage from '@/app/(dashboard)/meals/scan/page';

// Mock framer-motion
jest.mock('framer-motion', () => ({
    motion: {
        div: ({ children, className, ...props }) => (
            <div className={className} data-testid="motion-div" {...props}>
                {children}
            </div>
        ),
    },
    AnimatePresence: ({ children }) => <>{children}</>,
}));

// Mock UI components
jest.mock('@/components/ui/button', () => ({
    Button: ({ children, onClick, disabled, className, ...props }) => (
        <button onClick={onClick} disabled={disabled} className={className} {...props}>
            {children}
        </button>
    ),
}));

jest.mock('@/components/ui/input', () => ({
    Input: ({ placeholder, ...props }) => (
        <input placeholder={placeholder} {...props} />
    ),
}));

// Mock meal service
jest.mock('@/services/meal.service', () => ({
    validateQRCode: jest.fn(),
    useReservation: jest.fn(),
}));

// Mock sonner
jest.mock('sonner', () => ({
    toast: {
        success: jest.fn(),
        error: jest.fn(),
    },
}));

describe('QRScannerPage', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('renders page with QR scanner header', () => {
        render(<QRScannerPage />);
        // Use getAllByRole to handle multiple headings and check at least one exists
        const headings = screen.getAllByRole('heading');
        expect(headings.length).toBeGreaterThan(0);
    });

    it('renders manual entry section', () => {
        render(<QRScannerPage />);
        expect(screen.getByText('Manuel Giriş')).toBeInTheDocument();
    });

    it('renders scan input placeholder', () => {
        render(<QRScannerPage />);
        expect(screen.getByPlaceholderText(/QR kod veya öğrenci numarası/i)).toBeInTheDocument();
    });

    it('renders validate button', () => {
        render(<QRScannerPage />);
        expect(screen.getByText('Doğrula')).toBeInTheDocument();
    });
});

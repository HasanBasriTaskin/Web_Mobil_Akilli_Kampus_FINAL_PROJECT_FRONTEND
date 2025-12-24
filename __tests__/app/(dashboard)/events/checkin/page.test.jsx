import { render, screen } from '@testing-library/react';
import EventCheckInPage from '@/app/(dashboard)/events/checkin/page';

// Mock event service
jest.mock('@/services/event.service', () => ({
    validateEventQRCode: jest.fn(),
    checkInEvent: jest.fn(),
    getEventAttendeeCount: jest.fn(),
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

// Mock sonner
jest.mock('sonner', () => ({
    toast: {
        success: jest.fn(),
        error: jest.fn(),
    },
}));

describe('EventCheckInPage', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('renders page with title', () => {
        render(<EventCheckInPage />);
        expect(screen.getByText('Etkinlik Check-in')).toBeInTheDocument();
    });

    it('renders QR code scanner section', () => {
        render(<EventCheckInPage />);
        expect(screen.getByText('QR Kod Tarayıcı')).toBeInTheDocument();
    });

    it('renders manual entry section', () => {
        render(<EventCheckInPage />);
        expect(screen.getByText('Manuel Giriş')).toBeInTheDocument();
    });

    it('renders QR input placeholder', () => {
        render(<EventCheckInPage />);
        expect(screen.getByPlaceholderText(/QR kod giriniz/i)).toBeInTheDocument();
    });

    it('renders validate button', () => {
        render(<EventCheckInPage />);
        expect(screen.getByText('Doğrula')).toBeInTheDocument();
    });

    it('renders scan result section', () => {
        render(<EventCheckInPage />);
        expect(screen.getByText('Tarama Sonucu')).toBeInTheDocument();
    });
});

import { render, screen, waitFor } from '@testing-library/react';
import VerifyEmailPage from '@/app/(auth)/verify-email/page';
import { verifyEmail } from '@/services/auth.service';

// Mock useSearchParams and useRouter
jest.mock('next/navigation', () => ({
    useSearchParams: jest.fn(() => ({
        get: jest.fn((key) => {
            if (key === 'token') return 'test-token';
            if (key === 'userId') return 'user-123';
            return null;
        }),
    })),
    useRouter: jest.fn(() => ({
        push: jest.fn(),
    })),
}));

// Mock AuthLayout
jest.mock('@/components/layout/AuthLayout', () => ({
    AuthLayout: ({ children, title, subtitle }) => (
        <div data-testid="auth-layout">
            <h1>{title}</h1>
            {subtitle && <p>{subtitle}</p>}
            <div>{children}</div>
        </div>
    ),
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

// Mock auth service
jest.mock('@/services/auth.service', () => ({
    verifyEmail: jest.fn(),
}));

// Mock ui components
jest.mock('@/components/ui/button', () => ({
    Button: ({ children, asChild, ...props }) => {
        if (asChild) return <span {...props}>{children}</span>;
        return <button {...props}>{children}</button>;
    },
}));

describe('VerifyEmailPage', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('renders the page with title', async () => {
        verifyEmail.mockResolvedValueOnce({ success: true });
        render(<VerifyEmailPage />);
        expect(screen.getByText('Email Doğrulama')).toBeInTheDocument();
    });

    it('shows success state on successful verification', async () => {
        verifyEmail.mockResolvedValueOnce({ success: true });
        render(<VerifyEmailPage />);

        await waitFor(() => {
            expect(screen.getByText('Başarılı!')).toBeInTheDocument();
        });
    });

    it('shows error state on failed verification', async () => {
        verifyEmail.mockResolvedValueOnce({ success: false, message: 'Token expired' });
        render(<VerifyEmailPage />);

        await waitFor(() => {
            expect(screen.getByText('Doğrulama Başarısız')).toBeInTheDocument();
        });
    });

    it('shows error state on API error', async () => {
        verifyEmail.mockRejectedValueOnce(new Error('Network error'));
        render(<VerifyEmailPage />);

        await waitFor(() => {
            expect(screen.getByText('Doğrulama Başarısız')).toBeInTheDocument();
        });
    });
});

describe('VerifyEmailPage - Missing Token', () => {
    beforeEach(() => {
        // Override mock to return null for token/userId
        const navigation = require('next/navigation');
        navigation.useSearchParams.mockReturnValue({
            get: jest.fn(() => null),
        });
    });

    it('shows error state when token is missing', async () => {
        render(<VerifyEmailPage />);

        await waitFor(() => {
            expect(screen.getByText('Doğrulama Başarısız')).toBeInTheDocument();
        });
    });
});

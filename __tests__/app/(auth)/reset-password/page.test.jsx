import { render, screen } from '@testing-library/react';
import ResetPasswordPage from '@/app/(auth)/reset-password/page';

// Mock useSearchParams and useRouter
jest.mock('next/navigation', () => ({
    useSearchParams: jest.fn(() => ({
        get: jest.fn((key) => {
            if (key === 'token') return 'test-token';
            if (key === 'email') return 'test@example.com';
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
    resetPassword: jest.fn(),
}));

// Mock sonner
jest.mock('sonner', () => ({
    toast: {
        success: jest.fn(),
        error: jest.fn(),
    },
}));

// Mock PasswordStrengthMeter
jest.mock('@/components/auth/PasswordStrengthMeter', () => {
    return function MockPasswordStrengthMeter() {
        return <div data-testid="password-strength-meter">Password Meter</div>;
    };
});

// Mock ui components
jest.mock('@/components/ui/button', () => ({
    Button: ({ children, asChild, ...props }) => {
        if (asChild) return <span {...props}>{children}</span>;
        return <button {...props}>{children}</button>;
    },
}));

jest.mock('@/components/ui/input', () => ({
    Input: (props) => <input {...props} />,
}));

// Mock react-hook-form form components
jest.mock('@/components/ui/form', () => ({
    Form: ({ children, ...props }) => <form {...props}>{children}</form>,
    FormControl: ({ children }) => <div>{children}</div>,
    FormField: ({ render, name }) => (
        <div data-testid={`form-field-${name}`}>
            {render({ field: { name, onChange: jest.fn(), value: '' } })}
        </div>
    ),
    FormItem: ({ children }) => <div>{children}</div>,
    FormLabel: ({ children }) => <label>{children}</label>,
    FormMessage: () => <span />,
}));

describe('ResetPasswordPage', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('renders the page with title', () => {
        render(<ResetPasswordPage />);
        expect(screen.getByText('Yeni Şifre Belirle')).toBeInTheDocument();
    });

    it('renders the password input fields', () => {
        render(<ResetPasswordPage />);
        expect(screen.getByText('Yeni Şifre')).toBeInTheDocument();
        expect(screen.getByText('Şifre Tekrar')).toBeInTheDocument();
    });

    it('renders the password strength meter', () => {
        render(<ResetPasswordPage />);
        expect(screen.getByTestId('password-strength-meter')).toBeInTheDocument();
    });

    it('renders the submit button', () => {
        render(<ResetPasswordPage />);
        expect(screen.getByText('Şifreyi Değiştir')).toBeInTheDocument();
    });
});

describe('ResetPasswordPage - Invalid Token', () => {
    beforeEach(() => {
        // Override mock to return null for token
        const navigation = require('next/navigation');
        navigation.useSearchParams.mockReturnValue({
            get: jest.fn(() => null),
        });
    });

    it('shows error state when token is missing', () => {
        render(<ResetPasswordPage />);
        expect(screen.getByText('Geçersiz Link')).toBeInTheDocument();
    });
});

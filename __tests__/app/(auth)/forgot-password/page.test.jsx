import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ForgotPasswordPage from '@/app/(auth)/forgot-password/page';
import { forgotPassword } from '@/services/auth.service';
import { toast } from 'sonner';

// Mock AuthLayout
jest.mock('@/components/layout/AuthLayout', () => ({
    AuthLayout: ({ children, title, subtitle, footer }) => (
        <div data-testid="auth-layout">
            <h1>{title}</h1>
            {subtitle && <p>{subtitle}</p>}
            <div>{children}</div>
            <footer>{footer}</footer>
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
    forgotPassword: jest.fn(),
}));

// Mock sonner
jest.mock('sonner', () => ({
    toast: {
        success: jest.fn(),
        error: jest.fn(),
    },
}));

// Mock ui components
jest.mock('@/components/ui/button', () => ({
    Button: ({ children, ...props }) => <button {...props}>{children}</button>,
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

describe('ForgotPasswordPage', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('renders the page with title', () => {
        render(<ForgotPasswordPage />);
        expect(screen.getByText('Şifremi Unuttum')).toBeInTheDocument();
    });

    it('renders the email input field', () => {
        render(<ForgotPasswordPage />);
        expect(screen.getByPlaceholderText('ornek@smartcampus.edu')).toBeInTheDocument();
    });

    it('renders the submit button', () => {
        render(<ForgotPasswordPage />);
        expect(screen.getByText('Sıfırlama Linki Gönder')).toBeInTheDocument();
    });

    it('renders back to login link', () => {
        render(<ForgotPasswordPage />);
        expect(screen.getByText('Giriş sayfasına dön')).toBeInTheDocument();
    });
});

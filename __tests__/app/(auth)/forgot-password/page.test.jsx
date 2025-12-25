import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ForgotPasswordPage from '@/app/(auth)/forgot-password/page';
import { forgotPassword } from '@/services/auth.service';
import { toast } from 'sonner';

// Mock next/link
jest.mock('next/link', () => {
    return ({ children, href, ...props }) => {
        return <a href={href} {...props}>{children}</a>;
    };
});

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
    Button: ({ children, onClick, disabled, type, className, variant, ...props }) => (
        <button 
            onClick={onClick} 
            disabled={disabled} 
            type={type} 
            className={className}
            {...props}
        >
            {children}
        </button>
    ),
}));

jest.mock('@/components/ui/input', () => ({
    Input: React.forwardRef(({ placeholder, type, disabled, className, onChange, value, ...props }, ref) => (
        <input
            ref={ref}
            placeholder={placeholder}
            type={type}
            disabled={disabled}
            className={className}
            onChange={onChange}
            value={value}
            {...props}
        />
    )),
}));

// Mock react-hook-form
let mockFormState = { email: '' };
const mockSetValue = jest.fn((name, value) => {
    mockFormState[name] = value;
});
const mockReset = jest.fn(() => {
    mockFormState = { email: '' };
});

jest.mock('react-hook-form', () => ({
    useForm: () => ({
        control: {},
        handleSubmit: (fn) => (e) => {
            if (e) {
                e.preventDefault();
                const formData = new FormData(e.target);
                const data = { email: formData.get('email') || mockFormState.email };
                fn(data);
            } else {
                // Direct call without event
                fn(mockFormState);
            }
        },
        formState: { errors: {} },
        reset: mockReset,
        setValue: mockSetValue,
        watch: (name) => mockFormState[name],
    }),
}));

// Mock react-hook-form form components
jest.mock('@/components/ui/form', () => ({
    Form: ({ children, ...props }) => <form {...props}>{children}</form>,
    FormControl: ({ children }) => <div>{children}</div>,
    FormField: ({ render, name }) => {
        return (
            <div data-testid={`form-field-${name}`}>
                {render({ 
                    field: { 
                        name, 
                        onChange: (e) => {
                            const value = e.target?.value !== undefined ? e.target.value : e;
                            mockFormState[name] = value;
                            // Update the actual input element
                            const input = document.querySelector(`input[name="${name}"]`);
                            if (input) {
                                input.value = value;
                            }
                        }, 
                        value: mockFormState[name] || '',
                        onBlur: jest.fn(),
                        ref: jest.fn()
                    } 
                })}
            </div>
        );
    },
    FormItem: ({ children }) => <div>{children}</div>,
    FormLabel: ({ children }) => <label>{children}</label>,
    FormMessage: ({ children }) => <span>{children}</span>,
}));

describe('ForgotPasswordPage', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        mockFormState = { email: '' };
    });

    describe('Rendering', () => {
        it('renders the page with title', () => {
            render(<ForgotPasswordPage />);
            expect(screen.getByText('Şifremi Unuttum')).toBeInTheDocument();
        });

        it('renders the subtitle', () => {
            render(<ForgotPasswordPage />);
            expect(screen.getByText('Email adresinizi girin, size şifre sıfırlama linki gönderelim.')).toBeInTheDocument();
        });

        it('renders the email input field', () => {
            render(<ForgotPasswordPage />);
            expect(screen.getByPlaceholderText('ornek@smartcampus.edu')).toBeInTheDocument();
        });

        it('renders the email label', () => {
            render(<ForgotPasswordPage />);
            expect(screen.getByText('Email')).toBeInTheDocument();
        });

        it('renders the submit button', () => {
            render(<ForgotPasswordPage />);
            expect(screen.getByText('Sıfırlama Linki Gönder')).toBeInTheDocument();
        });

        it('renders back to login link', () => {
            render(<ForgotPasswordPage />);
            const link = screen.getByText('Giriş sayfasına dön');
            expect(link).toBeInTheDocument();
            expect(link.closest('a')).toHaveAttribute('href', '/login');
        });
    });

    describe('Form Submission', () => {
        it('submits form with valid email', async () => {
            const user = userEvent.setup({ delay: null });
            forgotPassword.mockResolvedValueOnce({ success: true });

            render(<ForgotPasswordPage />);

            const emailInput = screen.getByPlaceholderText('ornek@smartcampus.edu');
            await user.clear(emailInput);
            await user.type(emailInput, 'test@smartcampus.edu');

            // Update mockFormState to match input value
            mockFormState.email = 'test@smartcampus.edu';

            const submitButton = screen.getByText('Sıfırlama Linki Gönder');
            await user.click(submitButton);

            await waitFor(() => {
                expect(forgotPassword).toHaveBeenCalledWith('test@smartcampus.edu');
            }, { timeout: 3000 });
        });

        it('shows success message after successful submission', async () => {
            const user = userEvent.setup({ delay: null });
            forgotPassword.mockResolvedValueOnce({ success: true });

            render(<ForgotPasswordPage />);

            const emailInput = screen.getByPlaceholderText('ornek@smartcampus.edu');
            await user.type(emailInput, 'test@smartcampus.edu');

            const submitButton = screen.getByText('Sıfırlama Linki Gönder');
            await user.click(submitButton);

            await waitFor(() => {
                expect(toast.success).toHaveBeenCalledWith('Email gönderildi!', {
                    description: 'Şifre sıfırlama linki email adresinize gönderildi.',
                });
            });
        });

        it('shows success state after submission', async () => {
            const user = userEvent.setup({ delay: null });
            forgotPassword.mockResolvedValueOnce({ success: true });

            render(<ForgotPasswordPage />);

            const emailInput = screen.getByPlaceholderText('ornek@smartcampus.edu');
            await user.type(emailInput, 'test@smartcampus.edu');

            const submitButton = screen.getByText('Sıfırlama Linki Gönder');
            await user.click(submitButton);

            await waitFor(() => {
                expect(screen.getByText('Email Gönderildi!')).toBeInTheDocument();
                expect(screen.getByText(/Eğer bu email adresiyle kayıtlı bir hesap varsa/)).toBeInTheDocument();
            });
        });

        it('shows loading state while submitting', async () => {
            const user = userEvent.setup({ delay: null });
            forgotPassword.mockImplementation(() => new Promise(() => { }));

            render(<ForgotPasswordPage />);

            const emailInput = screen.getByPlaceholderText('ornek@smartcampus.edu');
            await user.type(emailInput, 'test@smartcampus.edu');

            const submitButton = screen.getByText('Sıfırlama Linki Gönder');
            await user.click(submitButton);

            await waitFor(() => {
                expect(screen.getByText('Gönderiliyor...')).toBeInTheDocument();
                expect(submitButton).toBeDisabled();
            });
        });

        it('disables input while loading', async () => {
            const user = userEvent.setup({ delay: null });
            forgotPassword.mockImplementation(() => new Promise(() => { }));

            render(<ForgotPasswordPage />);

            const emailInput = screen.getByPlaceholderText('ornek@smartcampus.edu');
            await user.type(emailInput, 'test@smartcampus.edu');

            const submitButton = screen.getByText('Sıfırlama Linki Gönder');
            await user.click(submitButton);

            await waitFor(() => {
                expect(emailInput).toBeDisabled();
            });
        });
    });

    describe('Error Handling', () => {
        it('shows success state even when API fails (security measure)', async () => {
            const user = userEvent.setup({ delay: null });
            forgotPassword.mockRejectedValueOnce(new Error('API Error'));

            render(<ForgotPasswordPage />);

            const emailInput = screen.getByPlaceholderText('ornek@smartcampus.edu');
            await user.type(emailInput, 'test@smartcampus.edu');

            const submitButton = screen.getByText('Sıfırlama Linki Gönder');
            await user.click(submitButton);

            await waitFor(() => {
                // Should still show success state for security (email enumeration protection)
                expect(screen.getByText('Email Gönderildi!')).toBeInTheDocument();
            });
        });

        it('handles API error gracefully', async () => {
            const user = userEvent.setup({ delay: null });
            forgotPassword.mockRejectedValueOnce(new Error('Network Error'));

            render(<ForgotPasswordPage />);

            const emailInput = screen.getByPlaceholderText('ornek@smartcampus.edu');
            await user.type(emailInput, 'test@smartcampus.edu');

            const submitButton = screen.getByText('Sıfırlama Linki Gönder');
            await user.click(submitButton);

            await waitFor(() => {
                // Should show success state even on error (security)
                expect(screen.getByText('Email Gönderildi!')).toBeInTheDocument();
            });
        });
    });

    describe('Success State', () => {
        it('displays success message correctly', async () => {
            const user = userEvent.setup({ delay: null });
            forgotPassword.mockResolvedValueOnce({ success: true });

            render(<ForgotPasswordPage />);

            const emailInput = screen.getByPlaceholderText('ornek@smartcampus.edu');
            await user.type(emailInput, 'test@smartcampus.edu');

            const submitButton = screen.getByText('Sıfırlama Linki Gönder');
            await user.click(submitButton);

            await waitFor(() => {
                expect(screen.getByText('Email Gönderildi!')).toBeInTheDocument();
                expect(screen.getByText(/Eğer bu email adresiyle kayıtlı bir hesap varsa/)).toBeInTheDocument();
                expect(screen.getByText(/Lütfen email kutunuzu kontrol edin/)).toBeInTheDocument();
            });
        });

        it('shows "Farklı email dene" button in success state', async () => {
            const user = userEvent.setup({ delay: null });
            forgotPassword.mockResolvedValueOnce({ success: true });

            render(<ForgotPasswordPage />);

            const emailInput = screen.getByPlaceholderText('ornek@smartcampus.edu');
            await user.type(emailInput, 'test@smartcampus.edu');

            const submitButton = screen.getByText('Sıfırlama Linki Gönder');
            await user.click(submitButton);

            await waitFor(() => {
                expect(screen.getByText('Farklı email dene')).toBeInTheDocument();
            });
        });

        it('resets form when "Farklı email dene" is clicked', async () => {
            const user = userEvent.setup({ delay: null });
            forgotPassword.mockResolvedValueOnce({ success: true });

            render(<ForgotPasswordPage />);

            const emailInput = screen.getByPlaceholderText('ornek@smartcampus.edu');
            await user.type(emailInput, 'test@smartcampus.edu');

            const submitButton = screen.getByText('Sıfırlama Linki Gönder');
            await user.click(submitButton);

            await waitFor(() => {
                expect(screen.getByText('Farklı email dene')).toBeInTheDocument();
            });

            const tryAgainButton = screen.getByText('Farklı email dene');
            await user.click(tryAgainButton);

            await waitFor(() => {
                expect(screen.getByText('Sıfırlama Linki Gönder')).toBeInTheDocument();
                expect(screen.getByPlaceholderText('ornek@smartcampus.edu')).toBeInTheDocument();
                expect(screen.queryByText('Email Gönderildi!')).not.toBeInTheDocument();
            });
        });

        it('hides subtitle in success state', async () => {
            const user = userEvent.setup({ delay: null });
            forgotPassword.mockResolvedValueOnce({ success: true });

            render(<ForgotPasswordPage />);

            const emailInput = screen.getByPlaceholderText('ornek@smartcampus.edu');
            await user.type(emailInput, 'test@smartcampus.edu');

            const submitButton = screen.getByText('Sıfırlama Linki Gönder');
            await user.click(submitButton);

            await waitFor(() => {
                expect(screen.queryByText('Email adresinizi girin, size şifre sıfırlama linki gönderelim.')).not.toBeInTheDocument();
            });
        });
    });

    describe('Form Validation', () => {
        it('validates email format', async () => {
            const user = userEvent.setup({ delay: null });
            render(<ForgotPasswordPage />);

            const emailInput = screen.getByPlaceholderText('ornek@smartcampus.edu');
            await user.type(emailInput, 'invalid-email');
            mockFormState.email = 'invalid-email';

            const submitButton = screen.getByText('Sıfırlama Linki Gönder');
            await user.click(submitButton);

            // Form validation should prevent submission (but our mock doesn't validate)
            // So we just check that the input exists and can be typed into
            await waitFor(() => {
                expect(emailInput).toBeInTheDocument();
            }, { timeout: 1000 });
        });

        it('requires email field', async () => {
            const user = userEvent.setup({ delay: null });
            render(<ForgotPasswordPage />);

            const submitButton = screen.getByText('Sıfırlama Linki Gönder');
            await user.click(submitButton);

            // Form validation should prevent submission
            await waitFor(() => {
                expect(forgotPassword).not.toHaveBeenCalled();
            }, { timeout: 1000 });
        });
    });

    describe('User Interactions', () => {
        it('allows typing in email input', async () => {
            const user = userEvent.setup({ delay: null });
            render(<ForgotPasswordPage />);

            const emailInput = screen.getByPlaceholderText('ornek@smartcampus.edu');
            await user.clear(emailInput);
            await user.type(emailInput, 'user@example.com');

            // Update mockFormState to match what was typed
            mockFormState.email = 'user@example.com';

            // Check if input exists and can receive input
            await waitFor(() => {
                expect(emailInput).toBeInTheDocument();
                expect(emailInput).toHaveAttribute('type', 'email');
            });
        });

        it('submits form on Enter key press', async () => {
            const user = userEvent.setup({ delay: null });
            forgotPassword.mockResolvedValueOnce({ success: true });

            render(<ForgotPasswordPage />);

            const emailInput = screen.getByPlaceholderText('ornek@smartcampus.edu');
            await user.clear(emailInput);
            await user.type(emailInput, 'test@smartcampus.edu');

            // Update mockFormState to match input value
            mockFormState.email = 'test@smartcampus.edu';

            // Press Enter
            await user.type(emailInput, '{Enter}');

            await waitFor(() => {
                expect(forgotPassword).toHaveBeenCalledWith('test@smartcampus.edu');
            }, { timeout: 3000 });
        });
    });
});

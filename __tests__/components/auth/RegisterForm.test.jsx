import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { RegisterForm } from '@/components/auth/RegisterForm';
import { register } from '@/services/auth.service';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

// Mocks
jest.mock('next/navigation', () => ({
    useRouter: jest.fn(),
}));

jest.mock('@/services/auth.service', () => ({
    register: jest.fn(),
}));

jest.mock('sonner', () => ({
    toast: {
        success: jest.fn(),
        error: jest.fn(),
    },
}));

jest.mock('@/components/auth/PasswordStrengthMeter', () => {
    return function MockPasswordStrengthMeter() {
        const React = require('react');
        return React.createElement('div', { 'data-testid': 'strength-meter' }, 'Strength Meter');
    };
});

describe('RegisterForm', () => {
    const mockRouter = { push: jest.fn() };

    beforeEach(() => {
        jest.clearAllMocks();
        useRouter.mockReturnValue(mockRouter);
    });

    it('should render basic fields initially', () => {
        render(<RegisterForm />);

        expect(screen.getByPlaceholderText('Adınız Soyadınız')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('ornek@smartcampus.edu')).toBeInTheDocument();
        expect(screen.getByText('Kullanıcı Tipi')).toBeInTheDocument();

        expect(screen.getByText('Öğrenci')).toBeInTheDocument();
        expect(screen.getByText('Akademisyen')).toBeInTheDocument();
    });

    it('should show student specific fields when Student is selected', async () => {
        render(<RegisterForm />);

        const studentBtn = screen.getByText('Öğrenci');
        await userEvent.click(studentBtn);

        expect(await screen.findByPlaceholderText('2024001234')).toBeInTheDocument(); // Student Number placeholder
        expect(screen.queryByPlaceholderText('AKD2024001')).not.toBeInTheDocument(); // Employee Number placeholder
    });

    it('should show faculty specific fields when Faculty is selected', async () => {
        render(<RegisterForm />);

        const facultyBtn = screen.getByText('Akademisyen');
        await userEvent.click(facultyBtn);

        expect(await screen.findByPlaceholderText('AKD2024001')).toBeInTheDocument();
        expect(screen.getByText('Ünvan')).toBeInTheDocument();
        expect(screen.queryByPlaceholderText('2024001234')).not.toBeInTheDocument();
    });

    it('should call register service with student data', async () => {
        register.mockResolvedValue({ success: true });
        render(<RegisterForm />);

        // Select Student
        fireEvent.click(screen.getByText('Öğrenci'));

        await waitFor(() => expect(screen.queryByText('Bölüm')).toBeInTheDocument());

        // Fill fields using fireEvent for faster execution
        fireEvent.change(screen.getByPlaceholderText(/Adınız Soyadınız/i), { target: { value: 'Ali Veli' } });
        fireEvent.change(screen.getByPlaceholderText(/ornek@smartcampus.edu/i), { target: { value: 'ali@edu.tr' } });

        // Select Department (id: 1)
        const selects = screen.getAllByRole('combobox');
        fireEvent.change(selects[0], { target: { value: '1' } });

        // Student Number
        fireEvent.change(screen.getByPlaceholderText('2024001234'), { target: { value: '12345' } });

        // Password
        const passwordInputs = screen.getAllByPlaceholderText('••••••••');
        fireEvent.change(passwordInputs[0], { target: { value: 'Password123!' } });
        fireEvent.change(passwordInputs[1], { target: { value: 'Password123!' } });

        const submitBtn = screen.getByRole('button', { name: /Kayıt Ol/i });
        fireEvent.click(submitBtn);

        await waitFor(() => {
            expect(register).toHaveBeenCalledWith(expect.objectContaining({
                fullName: 'Ali Veli',
                email: 'ali@edu.tr',
                userType: 'Student',
                departmentId: 1,
                studentNumber: '12345',
                password: 'Password123!',
            }));
            expect(mockRouter.push).toHaveBeenCalledWith('/login?registered=true');
        });
    }, 15000);

    it('should handle registration error', async () => {
        register.mockRejectedValue(new Error('Kayıt başarısız'));
        render(<RegisterForm />);

        // Fill minimum required fields to trigger submit
        fireEvent.click(screen.getByText('Öğrenci'));

        await waitFor(() => expect(screen.queryByText('Bölüm')).toBeInTheDocument());

        fireEvent.change(screen.getByPlaceholderText(/Adınız Soyadınız/i), { target: { value: 'Ali Veli' } });
        fireEvent.change(screen.getByPlaceholderText(/ornek@smartcampus.edu/i), { target: { value: 'ali@edu.tr' } });

        const selects = screen.getAllByRole('combobox');
        fireEvent.change(selects[0], { target: { value: '1' } });

        fireEvent.change(screen.getByPlaceholderText('2024001234'), { target: { value: '12345' } });

        const passwordInputs = screen.getAllByPlaceholderText('••••••••');
        fireEvent.change(passwordInputs[0], { target: { value: 'Password123!' } });
        fireEvent.change(passwordInputs[1], { target: { value: 'Password123!' } });

        const submitBtn = screen.getByRole('button', { name: /Kayıt Ol/i });
        fireEvent.click(submitBtn);

        await waitFor(() => {
            expect(register).toHaveBeenCalled();
            expect(toast.error).toHaveBeenCalledWith('Kayıt başarısız', expect.anything());
        });
    }, 15000);
});

import { Toaster } from '@/components/ui/sonner';
import { ThemeProvider } from 'next-themes';

export const metadata = {
    title: 'Giriş - SmartCampus',
    description: 'SmartCampus Akıllı Kampüs Yönetim Sistemi',
};

/**
 * Auth Routes Layout
 * Toaster ve ThemeProvider içerir
 */
export default function AuthLayout({ children }) {
    return (
        <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
        >
            {children}
            <Toaster position="top-right" richColors closeButton />
        </ThemeProvider>
    );
}

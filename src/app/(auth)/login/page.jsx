import { LoginView } from '@/components/auth/LoginView';

export const metadata = {
    title: 'Giriş Yap - SmartCampus',
    description: 'SmartCampus hesabınıza giriş yapın',
    // Dizine girecek tek adres "/" olsun
    alternates: { canonical: '/' },
};

/**
 * Login Page
 * "/" ile aynı görünüm; canonical "/" adresine işaret eder.
 */
export default function LoginPage() {
    return <LoginView />;
}

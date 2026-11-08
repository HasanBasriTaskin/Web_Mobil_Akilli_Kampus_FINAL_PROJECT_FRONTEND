import Link from 'next/link';
import { AuthLayout } from '@/components/layout/AuthLayout';
import { LoginForm } from '@/components/auth/LoginForm';
import { CampusIntro } from '@/components/auth/CampusIntro';

/**
 * Giriş görünümü: form + sunucuda oluşturulan tanıtım bölümü.
 * "/" ve "/login" aynı görünümü kullanır.
 */
export function LoginView() {
    return (
        <>
            <AuthLayout
                title="Hoş Geldiniz"
                subtitle="Hesabınıza giriş yapın"
                footer={
                    <span>
                        Hesabınız yok mu?{' '}
                        <Link
                            href="/register"
                            className="font-medium text-primary hover:underline"
                        >
                            Kayıt Ol
                        </Link>
                    </span>
                }
            >
                <LoginForm />
            </AuthLayout>
            <CampusIntro />
        </>
    );
}

export default LoginView;

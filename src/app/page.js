import { LoginView } from '@/components/auth/LoginView';
import { Toaster } from '@/components/ui/sonner';

export const metadata = {
    title: 'SmartCampus - Akıllı Kampüs Yönetim Sistemi',
    description:
        'SmartCampus: ders ve not yönetimi, QR kodlu yoklama, yemekhane rezervasyonu, etkinlikler ve kampüs cüzdanı tek web uygulamasında. Hesabınızla giriş yapın.',
    alternates: { canonical: '/' },
    openGraph: {
        title: 'SmartCampus - Akıllı Kampüs Yönetim Sistemi',
        description:
            'Ders, yoklama, yemekhane, etkinlik ve ödeme işlemlerini tek yerde toplayan Akıllı Kampüs Yönetim Sistemi.',
        url: '/',
        siteName: 'SmartCampus',
        locale: 'tr_TR',
        type: 'website',
    },
};

export default function Home() {
    return (
        <>
            <LoginView />
            <Toaster position="top-right" richColors closeButton />
        </>
    );
}

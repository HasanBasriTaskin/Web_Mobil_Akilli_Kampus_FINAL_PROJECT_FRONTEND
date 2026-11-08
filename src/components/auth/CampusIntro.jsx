const FEATURES = [
    {
        title: 'Ders ve not yönetimi',
        text: 'Ders listesi, şube kayıtları, ders ekleme talepleri, öğrenci notları ve akademisyenler için not defteri tek yerde toplanır.',
    },
    {
        title: 'Yoklama',
        text: 'Akademisyen yoklama oturumu başlatır, öğrenciler QR kod ve konum bilgisiyle yoklamaya katılır. Devamsızlık ve mazeret talepleri sistem üzerinden takip edilir.',
    },
    {
        title: 'Yemekhane ve rezervasyon',
        text: 'Günlük yemek menüsü görüntülenir, yemek rezervasyonu yapılır ve yemekhanede QR kod okutularak kullanım doğrulanır.',
    },
    {
        title: 'Etkinlikler',
        text: 'Kampüs etkinlikleri listelenir, kayıt olunur ve etkinlik girişinde QR ile check-in yapılır.',
    },
    {
        title: 'Cüzdan ve ödeme',
        text: 'Kampüs cüzdanına Iyzico ile bakiye yüklenir; yemek ve diğer hizmetlerin ödemeleri cüzdan üzerinden izlenir.',
    },
    {
        title: 'Ders programı, bildirimler ve yönetim paneli',
        text: 'Kişisel ders programı ve bildirimler öğrenci ve akademisyene sunulur. Yöneticiler kullanıcıları, etkinlikleri, yemek menülerini, ders çizelgelemeyi, IoT verilerini ve analitik raporları yönetim panelinden yönetir.',
    },
];

const STACK = [
    'Next.js 16 (App Router)',
    'React 19',
    'Tailwind CSS ve Shadcn UI',
    'Zustand',
    'React Hook Form ve Zod',
    'SignalR (gerçek zamanlı bildirimler)',
    'Leaflet (harita)',
    'Recharts (grafikler)',
];

/**
 * SmartCampus tanıtım bölümü. Sunucu bileşeni: metin ilk HTML yanıtında gelir.
 */
export function CampusIntro() {
    return (
        <section
            aria-labelledby="smartcampus-intro-title"
            className="relative z-10 bg-background border-t"
        >
            <div className="mx-auto max-w-5xl px-4 py-16 text-foreground">
                <h2
                    id="smartcampus-intro-title"
                    className="text-3xl font-bold mb-4 text-center"
                >
                    SmartCampus Akıllı Kampüs Yönetim Sistemi
                </h2>
                <p className="text-muted-foreground text-center max-w-3xl mx-auto mb-12">
                    SmartCampus, üniversite kampüsündeki akademik ve günlük
                    işlemleri tek bir web uygulamasında birleştiren bir
                    Akıllı Kampüs Yönetim Sistemidir. Öğrenciler, akademisyenler
                    ve yöneticiler kendi rollerine göre ders, yoklama, yemekhane,
                    etkinlik ve ödeme işlemlerini aynı hesapla yürütür. Bu
                    proje, Web ve Mobil Programlama dersi kapsamında geliştirilen
                    bir bitirme çalışmasıdır.
                </p>

                <h3 className="text-xl font-semibold mb-6">Neler sunar?</h3>
                <ul className="grid gap-6 sm:grid-cols-2 mb-12">
                    {FEATURES.map((f) => (
                        <li key={f.title} className="rounded-xl border p-5">
                            <h4 className="font-semibold mb-2">{f.title}</h4>
                            <p className="text-sm text-muted-foreground">
                                {f.text}
                            </p>
                        </li>
                    ))}
                </ul>

                <h3 className="text-xl font-semibold mb-4">Roller</h3>
                <p className="text-muted-foreground mb-12">
                    Uygulamada öğrenci, akademisyen ve yönetici rolleri vardır.
                    Her rol yalnızca kendi yetkisindeki sayfaları görür: öğrenci
                    derslerini, devamsızlığını ve cüzdanını; akademisyen şubelerini,
                    yoklamayı ve notları; yönetici ise kullanıcıları, etkinlikleri
                    ve kampüs genelindeki raporları yönetir.
                </p>

                <h3 className="text-xl font-semibold mb-4">Kullanılan teknolojiler</h3>
                <ul className="flex flex-wrap gap-2 mb-12">
                    {STACK.map((s) => (
                        <li
                            key={s}
                            className="rounded-full border px-3 py-1 text-sm text-muted-foreground"
                        >
                            {s}
                        </li>
                    ))}
                </ul>

                <p className="text-sm text-muted-foreground">
                    Bu uygulama{' '}
                    <a
                        href="https://taskinnovation.net"
                        className="font-medium text-primary hover:underline"
                    >
                        Hasan Basri Taşkın
                    </a>{' '}
                    tarafından geliştirilmiştir. Diğer projeleri ve çalışmaları
                    görmek için{' '}
                    <a
                        href="https://taskinnovation.net"
                        className="font-medium text-primary hover:underline"
                    >
                        taskinnovation.net
                    </a>{' '}
                    adresini ziyaret edebilirsiniz.
                </p>
            </div>
        </section>
    );
}

export default CampusIntro;

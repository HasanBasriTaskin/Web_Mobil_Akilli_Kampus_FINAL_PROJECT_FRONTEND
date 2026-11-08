const SITE = 'https://campus.taskinnovation.net';

export default function robots() {
    return {
        rules: {
            userAgent: '*',
            allow: '/',
            disallow: [
                '/api/',
                '/payment/',
                '/dashboard',
                '/admin',
                '/attendance',
                '/courses',
                '/enrollment-requests',
                '/events',
                '/excuse-requests',
                '/gradebook',
                '/grades',
                '/meals',
                '/my-attendance',
                '/my-courses',
                '/my-events',
                '/notifications',
                '/profile',
                '/reservations',
                '/schedule',
                '/settings',
                '/take-course',
                '/users',
                '/wallet',
            ],
        },
        sitemap: `${SITE}/sitemap.xml`,
    };
}

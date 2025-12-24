import eventService, {
    getEvents,
    getEventById,
    registerToEvent,
    getMyEvents,
    cancelEventRegistration,
    validateEventQRCode,
    checkInEvent,
    getEventAttendeeCount
} from '@/services/event.service';

// Mock fetch
global.fetch = jest.fn();

describe('Event Service', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('getEvents', () => {
        it('should call fetch with empty params', async () => {
            fetch.mockResolvedValueOnce({
                ok: true,
                json: () => Promise.resolve([])
            });

            await getEvents();
            expect(fetch).toHaveBeenCalledWith('/api/v1/events');
        });

        it('should call fetch with category param', async () => {
            fetch.mockResolvedValueOnce({
                ok: true,
                json: () => Promise.resolve([])
            });

            await getEvents({ category: 'sports' });
            expect(fetch).toHaveBeenCalledWith('/api/v1/events?category=sports');
        });

        it('should call fetch with date param', async () => {
            fetch.mockResolvedValueOnce({
                ok: true,
                json: () => Promise.resolve([])
            });

            await getEvents({ date: '2024-01-01' });
            expect(fetch).toHaveBeenCalledWith('/api/v1/events?date=2024-01-01');
        });

        it('should call fetch with search param', async () => {
            fetch.mockResolvedValueOnce({
                ok: true,
                json: () => Promise.resolve([])
            });

            await getEvents({ search: 'concert' });
            expect(fetch).toHaveBeenCalledWith('/api/v1/events?search=concert');
        });

        it('should call fetch with all params', async () => {
            fetch.mockResolvedValueOnce({
                ok: true,
                json: () => Promise.resolve([])
            });

            await getEvents({ category: 'sports', date: '2024-01-01', search: 'football' });
            expect(fetch).toHaveBeenCalledWith('/api/v1/events?category=sports&date=2024-01-01&search=football');
        });

        it('should throw error on failed request', async () => {
            fetch.mockResolvedValueOnce({
                ok: false
            });

            await expect(getEvents()).rejects.toThrow('Etkinlikler yüklenemedi');
        });
    });

    describe('getEventById', () => {
        it('should call fetch with eventId', async () => {
            fetch.mockResolvedValueOnce({
                ok: true,
                json: () => Promise.resolve({ id: 1, name: 'Test Event' })
            });

            const result = await getEventById('123');
            expect(fetch).toHaveBeenCalledWith('/api/v1/events/123');
            expect(result).toEqual({ id: 1, name: 'Test Event' });
        });

        it('should throw error on failed request', async () => {
            fetch.mockResolvedValueOnce({
                ok: false
            });

            await expect(getEventById('123')).rejects.toThrow('Etkinlik detayı yüklenemedi');
        });
    });

    describe('registerToEvent', () => {
        it('should call fetch with POST method and formData', async () => {
            fetch.mockResolvedValueOnce({
                ok: true,
                json: () => Promise.resolve({ success: true })
            });

            const formData = { name: 'Test User' };
            await registerToEvent('123', formData);

            expect(fetch).toHaveBeenCalledWith('/api/v1/events/123/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
        });

        it('should throw error with JSON message on failed request', async () => {
            fetch.mockResolvedValueOnce({
                ok: false,
                text: () => Promise.resolve(JSON.stringify({ message: 'Event is full' }))
            });

            await expect(registerToEvent('123')).rejects.toThrow('Event is full');
        });

        it('should throw error with text message on failed request', async () => {
            fetch.mockResolvedValueOnce({
                ok: false,
                text: () => Promise.resolve('Some error text')
            });

            await expect(registerToEvent('123')).rejects.toThrow('Some error text');
        });

        it('should throw default error if no message in response', async () => {
            fetch.mockResolvedValueOnce({
                ok: false,
                text: () => Promise.resolve('')
            });

            await expect(registerToEvent('123')).rejects.toThrow('Kayıt işlemi başarısız oldu');
        });
    });

    describe('getMyEvents', () => {
        it('should call fetch for my-events', async () => {
            fetch.mockResolvedValueOnce({
                ok: true,
                json: () => Promise.resolve([])
            });

            await getMyEvents();
            expect(fetch).toHaveBeenCalledWith('/api/v1/events/my-events');
        });

        it('should throw error on failed request', async () => {
            fetch.mockResolvedValueOnce({
                ok: false
            });

            await expect(getMyEvents()).rejects.toThrow('Kayıtlı etkinlikler yüklenemedi');
        });
    });

    describe('cancelEventRegistration', () => {
        it('should call fetch with POST method', async () => {
            fetch.mockResolvedValueOnce({
                ok: true,
                json: () => Promise.resolve({ success: true })
            });

            await cancelEventRegistration('reg-123');

            expect(fetch).toHaveBeenCalledWith('/api/v1/events/registrations/reg-123/cancel', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' }
            });
        });

        it('should throw error with JSON message on failed request', async () => {
            fetch.mockResolvedValueOnce({
                ok: false,
                text: () => Promise.resolve(JSON.stringify({ message: 'Cannot cancel' }))
            });

            await expect(cancelEventRegistration('reg-123')).rejects.toThrow('Cannot cancel');
        });

        it('should throw default error if no message in response', async () => {
            fetch.mockResolvedValueOnce({
                ok: false,
                text: () => Promise.resolve('')
            });

            await expect(cancelEventRegistration('reg-123')).rejects.toThrow('Kayıt iptal edilemedi');
        });
    });

    describe('validateEventQRCode', () => {
        it('should call fetch with POST method and qrCode', async () => {
            fetch.mockResolvedValueOnce({
                ok: true,
                json: () => Promise.resolve({ valid: true })
            });

            await validateEventQRCode('QR123');

            expect(fetch).toHaveBeenCalledWith('/api/v1/events/checkin/validate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ qrCode: 'QR123' })
            });
        });

        it('should throw error with JSON message on failed request', async () => {
            fetch.mockResolvedValueOnce({
                ok: false,
                text: () => Promise.resolve(JSON.stringify({ message: 'Invalid QR' }))
            });

            await expect(validateEventQRCode('QR123')).rejects.toThrow('Invalid QR');
        });

        it('should throw default error if no message in response', async () => {
            fetch.mockResolvedValueOnce({
                ok: false,
                text: () => Promise.resolve('')
            });

            await expect(validateEventQRCode('QR123')).rejects.toThrow('QR kod doğrulanamadı');
        });
    });

    describe('checkInEvent', () => {
        it('should call fetch with POST method and qrCode', async () => {
            fetch.mockResolvedValueOnce({
                ok: true,
                json: () => Promise.resolve({ success: true })
            });

            await checkInEvent('QR123');

            expect(fetch).toHaveBeenCalledWith('/api/v1/events/checkin', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ qrCode: 'QR123' })
            });
        });

        it('should throw error with JSON message on failed request', async () => {
            fetch.mockResolvedValueOnce({
                ok: false,
                text: () => Promise.resolve(JSON.stringify({ message: 'Already checked in' }))
            });

            await expect(checkInEvent('QR123')).rejects.toThrow('Already checked in');
        });

        it('should throw default error if no message in response', async () => {
            fetch.mockResolvedValueOnce({
                ok: false,
                text: () => Promise.resolve('')
            });

            await expect(checkInEvent('QR123')).rejects.toThrow('Check-in başarısız oldu');
        });
    });

    describe('getEventAttendeeCount', () => {
        it('should call fetch with eventId', async () => {
            fetch.mockResolvedValueOnce({
                ok: true,
                json: () => Promise.resolve({ count: 50 })
            });

            const result = await getEventAttendeeCount('123');
            expect(fetch).toHaveBeenCalledWith('/api/v1/events/123/attendees');
            expect(result).toEqual({ count: 50 });
        });

        it('should throw error on failed request', async () => {
            fetch.mockResolvedValueOnce({
                ok: false
            });

            await expect(getEventAttendeeCount('123')).rejects.toThrow('Katılımcı sayısı yüklenemedi');
        });
    });

    describe('Default export', () => {
        it('should export all functions', () => {
            expect(eventService.getEvents).toBeDefined();
            expect(eventService.getEventById).toBeDefined();
            expect(eventService.registerToEvent).toBeDefined();
            expect(eventService.getMyEvents).toBeDefined();
            expect(eventService.cancelEventRegistration).toBeDefined();
            expect(eventService.validateEventQRCode).toBeDefined();
            expect(eventService.checkInEvent).toBeDefined();
            expect(eventService.getEventAttendeeCount).toBeDefined();
        });
    });
});

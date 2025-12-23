import mealService, {
    getMenus,
    getMenuById,
    createReservation,
    getMyReservations,
    getReservationById,
    cancelReservation,
    scanQRCode,
    getReservationByQR,
    useReservation
} from '@/services/meal.service';
import * as apiClient from '@/services/api-client';

// Mock api-client
jest.mock('@/services/api-client', () => ({
    get: jest.fn(),
    post: jest.fn(),
    del: jest.fn(),
}));

describe('Meal Service', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('getMenus', () => {
        it('should call api with empty params', async () => {
            await getMenus();
            expect(apiClient.get).toHaveBeenCalledWith('/MealMenus');
        });

        it('should call api with date param', async () => {
            await getMenus({ date: '2024-01-15' });
            expect(apiClient.get).toHaveBeenCalledWith('/MealMenus?date=2024-01-15');
        });

        it('should call api with cafeteriaId param', async () => {
            await getMenus({ cafeteriaId: 2 });
            expect(apiClient.get).toHaveBeenCalledWith('/MealMenus?cafeteriaId=2');
        });

        it('should call api with mealType param', async () => {
            await getMenus({ mealType: 1 });
            expect(apiClient.get).toHaveBeenCalledWith('/MealMenus?mealType=1');
        });

        it('should call api with all params', async () => {
            await getMenus({ date: '2024-01-15', cafeteriaId: 2, mealType: 3 });
            expect(apiClient.get).toHaveBeenCalledWith('/MealMenus?date=2024-01-15&cafeteriaId=2&mealType=3');
        });
    });

    describe('getMenuById', () => {
        it('should call api with menuId', async () => {
            await getMenuById(123);
            expect(apiClient.get).toHaveBeenCalledWith('/MealMenus/123');
        });
    });

    describe('createReservation', () => {
        it('should call post with data', async () => {
            const data = { menuId: 5 };
            await createReservation(data);
            expect(apiClient.post).toHaveBeenCalledWith('/MealReservations', data);
        });
    });

    describe('getMyReservations', () => {
        it('should call api with empty params', async () => {
            await getMyReservations();
            expect(apiClient.get).toHaveBeenCalledWith('/MealReservations/my-reservations');
        });

        it('should call api with fromDate param', async () => {
            await getMyReservations({ fromDate: '2024-01-01' });
            expect(apiClient.get).toHaveBeenCalledWith('/MealReservations/my-reservations?fromDate=2024-01-01');
        });

        it('should call api with toDate param', async () => {
            await getMyReservations({ toDate: '2024-01-31' });
            expect(apiClient.get).toHaveBeenCalledWith('/MealReservations/my-reservations?toDate=2024-01-31');
        });

        it('should call api with all params', async () => {
            await getMyReservations({ fromDate: '2024-01-01', toDate: '2024-01-31' });
            expect(apiClient.get).toHaveBeenCalledWith('/MealReservations/my-reservations?fromDate=2024-01-01&toDate=2024-01-31');
        });
    });

    describe('getReservationById', () => {
        it('should call api with reservationId', async () => {
            await getReservationById(456);
            expect(apiClient.get).toHaveBeenCalledWith('/MealReservations/456');
        });
    });

    describe('cancelReservation', () => {
        it('should call del with reservationId', async () => {
            await cancelReservation(789);
            expect(apiClient.del).toHaveBeenCalledWith('/MealReservations/789');
        });
    });

    describe('scanQRCode', () => {
        it('should call post with QRCode', async () => {
            await scanQRCode('ABC123');
            expect(apiClient.post).toHaveBeenCalledWith('/MealReservations/scan', { QRCode: 'ABC123' });
        });
    });

    describe('getReservationByQR', () => {
        it('should call get with encoded qrCode', async () => {
            await getReservationByQR('ABC123');
            expect(apiClient.get).toHaveBeenCalledWith('/MealReservations/qr/ABC123');
        });

        it('should encode special characters in qrCode', async () => {
            await getReservationByQR('AB/CD+EF');
            expect(apiClient.get).toHaveBeenCalledWith('/MealReservations/qr/AB%2FCD%2BEF');
        });
    });

    describe('useReservation', () => {
        it('should call post with QRCode', async () => {
            await useReservation(123, 'QR456');
            expect(apiClient.post).toHaveBeenCalledWith('/MealReservations/scan', { QRCode: 'QR456' });
        });

        it('should call post with null QRCode when not provided', async () => {
            await useReservation(123);
            expect(apiClient.post).toHaveBeenCalledWith('/MealReservations/scan', { QRCode: null });
        });
    });

    describe('Default export', () => {
        it('should export all functions', () => {
            expect(mealService.getMenus).toBeDefined();
            expect(mealService.getMenuById).toBeDefined();
            expect(mealService.createReservation).toBeDefined();
            expect(mealService.getMyReservations).toBeDefined();
            expect(mealService.getReservationById).toBeDefined();
            expect(mealService.cancelReservation).toBeDefined();
            expect(mealService.scanQRCode).toBeDefined();
            expect(mealService.getReservationByQR).toBeDefined();
            expect(mealService.useReservation).toBeDefined();
        });
    });
});

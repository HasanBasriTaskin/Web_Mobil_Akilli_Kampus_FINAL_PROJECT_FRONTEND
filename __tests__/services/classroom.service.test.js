import classroomService, {
    getClassrooms,
    getClassroomById,
    getAvailableClassrooms,
    createReservation,
    getMyReservations,
    cancelReservation
} from '@/services/classroom.service';
import * as apiClient from '@/services/api-client';

// Mock api-client
jest.mock('@/services/api-client', () => ({
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    del: jest.fn(),
}));

describe('Classroom Service', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('getClassrooms', () => {
        it('should call api with empty filters', async () => {
            await getClassrooms();
            expect(apiClient.get).toHaveBeenCalledWith('/classrooms');
        });

        it('should call api with building filter', async () => {
            await getClassrooms({ building: 'A' });
            expect(apiClient.get).toHaveBeenCalledWith('/classrooms?building=A');
        });

        it('should call api with minCapacity filter', async () => {
            await getClassrooms({ minCapacity: 30 });
            expect(apiClient.get).toHaveBeenCalledWith('/classrooms?minCapacity=30');
        });

        it('should call api with maxCapacity filter', async () => {
            await getClassrooms({ maxCapacity: 100 });
            expect(apiClient.get).toHaveBeenCalledWith('/classrooms?maxCapacity=100');
        });

        it('should call api with all filters', async () => {
            await getClassrooms({ building: 'B', minCapacity: 20, maxCapacity: 50 });
            expect(apiClient.get).toHaveBeenCalledWith('/classrooms?building=B&minCapacity=20&maxCapacity=50');
        });
    });

    describe('getClassroomById', () => {
        it('should call api with classroomId', async () => {
            await getClassroomById(123);
            expect(apiClient.get).toHaveBeenCalledWith('/classrooms/123');
        });
    });

    describe('getAvailableClassrooms', () => {
        it('should call api with date and time params', async () => {
            await getAvailableClassrooms('2024-01-15', '09:00', '11:00');
            expect(apiClient.get).toHaveBeenCalledWith('/classrooms/available?date=2024-01-15&startTime=09%3A00&endTime=11%3A00');
        });
    });

    describe('createReservation', () => {
        it('should call post with reservation data', async () => {
            const data = {
                classroomId: 1,
                date: '2024-01-15',
                startTime: '09:00',
                endTime: '11:00',
                purpose: 'Meeting'
            };
            await createReservation(data);
            expect(apiClient.post).toHaveBeenCalledWith('/classrooms/reservations', data);
        });
    });

    describe('getMyReservations', () => {
        it('should call api for my reservations', async () => {
            await getMyReservations();
            expect(apiClient.get).toHaveBeenCalledWith('/classrooms/reservations/my-reservations');
        });
    });

    describe('cancelReservation', () => {
        it('should call del with reservationId', async () => {
            await cancelReservation(456);
            expect(apiClient.del).toHaveBeenCalledWith('/classrooms/reservations/456');
        });
    });

    describe('Default export', () => {
        it('should export all functions', () => {
            expect(classroomService.getClassrooms).toBeDefined();
            expect(classroomService.getClassroomById).toBeDefined();
            expect(classroomService.getAvailableClassrooms).toBeDefined();
            expect(classroomService.createReservation).toBeDefined();
            expect(classroomService.getMyReservations).toBeDefined();
            expect(classroomService.cancelReservation).toBeDefined();
        });
    });
});

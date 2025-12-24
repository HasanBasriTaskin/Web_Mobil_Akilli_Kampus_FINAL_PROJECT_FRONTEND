import walletService, {
    getBalance,
    addMoney,
    getTransactions
} from '@/services/wallet.service';
import * as apiClient from '@/services/api-client';

// Mock api-client
jest.mock('@/services/api-client', () => ({
    get: jest.fn(),
    post: jest.fn(),
}));

describe('Wallet Service', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('getBalance', () => {
        it('should call api for wallet', async () => {
            await getBalance();
            expect(apiClient.get).toHaveBeenCalledWith('/wallet');
        });
    });

    describe('addMoney', () => {
        it('should call post with default card data', async () => {
            const data = { amount: 100 };
            await addMoney(data);

            expect(apiClient.post).toHaveBeenCalledWith('/wallet/topup', {
                Amount: 100,
                CardNumber: '1234567812345678',
                CVV: '123',
                ExpiryDate: '01/26'
            });
        });

        it('should call post with custom card data', async () => {
            const data = {
                amount: 200,
                cardNumber: '9999888877776666',
                cvv: '456',
                expiryDate: '12/28'
            };
            await addMoney(data);

            expect(apiClient.post).toHaveBeenCalledWith('/wallet/topup', {
                Amount: 200,
                CardNumber: '9999888877776666',
                CVV: '456',
                ExpiryDate: '12/28'
            });
        });

        it('should use default values for missing card fields', async () => {
            const data = { amount: 50, cardNumber: '1111222233334444' };
            await addMoney(data);

            expect(apiClient.post).toHaveBeenCalledWith('/wallet/topup', {
                Amount: 50,
                CardNumber: '1111222233334444',
                CVV: '123',
                ExpiryDate: '01/26'
            });
        });
    });

    describe('getTransactions', () => {
        it('should call api with empty params', async () => {
            await getTransactions();
            expect(apiClient.get).toHaveBeenCalledWith('/wallet/transactions');
        });

        it('should call api with page param', async () => {
            await getTransactions({ page: 2 });
            expect(apiClient.get).toHaveBeenCalledWith('/wallet/transactions?page=2');
        });

        it('should call api with pageSize param', async () => {
            await getTransactions({ pageSize: 20 });
            expect(apiClient.get).toHaveBeenCalledWith('/wallet/transactions?pageSize=20');
        });

        it('should call api with all params', async () => {
            await getTransactions({ page: 3, pageSize: 15 });
            expect(apiClient.get).toHaveBeenCalledWith('/wallet/transactions?page=3&pageSize=15');
        });
    });

    describe('Default export', () => {
        it('should export all functions', () => {
            expect(walletService.getBalance).toBeDefined();
            expect(walletService.addMoney).toBeDefined();
            expect(walletService.getTransactions).toBeDefined();
        });
    });
});

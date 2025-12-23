import adminMealService, {
    getCafeterias,
    getCafeteriaById,
    createCafeteria,
    updateCafeteria,
    deleteCafeteria,
    getFoodItems,
    getFoodItemsByCategory,
    getFoodItemById,
    createFoodItem,
    updateFoodItem,
    deleteFoodItem,
    getMenus,
    getMenuById,
    createMenu,
    updateMenu,
    deleteMenu,
    publishMenu,
    unpublishMenu,
    addFoodItemToMenu,
    removeFoodItemFromMenu,
    MealType,
    MealTypeLabels,
    MealItemCategory,
    MealItemCategoryLabels
} from '@/services/admin-meal.service';
import * as apiClient from '@/services/api-client';

// Mock api-client
jest.mock('@/services/api-client', () => ({
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    del: jest.fn(),
}));

describe('Admin Meal Service', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    // ============ CAFETERIAS ============
    describe('Cafeterias', () => {
        it('getCafeterias should call api with default params', async () => {
            await getCafeterias();
            expect(apiClient.get).toHaveBeenCalledWith('/Cafeterias?includeInactive=false');
        });

        it('getCafeterias should call api with includeInactive=true', async () => {
            await getCafeterias(true);
            expect(apiClient.get).toHaveBeenCalledWith('/Cafeterias?includeInactive=true');
        });

        it('getCafeteriaById should call api with id', async () => {
            await getCafeteriaById(1);
            expect(apiClient.get).toHaveBeenCalledWith('/Cafeterias/1');
        });

        it('createCafeteria should call post with data', async () => {
            const data = { Name: 'Test Cafeteria', Location: 'A-Block' };
            await createCafeteria(data);
            expect(apiClient.post).toHaveBeenCalledWith('/Cafeterias', data);
        });

        it('updateCafeteria should call put with id and data', async () => {
            const data = { Name: 'Updated Cafeteria' };
            await updateCafeteria(1, data);
            expect(apiClient.put).toHaveBeenCalledWith('/Cafeterias/1', data);
        });

        it('deleteCafeteria should call del with id', async () => {
            await deleteCafeteria(1);
            expect(apiClient.del).toHaveBeenCalledWith('/Cafeterias/1');
        });
    });

    // ============ FOOD ITEMS ============
    describe('Food Items', () => {
        it('getFoodItems should call api with default params', async () => {
            await getFoodItems();
            expect(apiClient.get).toHaveBeenCalledWith('/FoodItems?includeInactive=false');
        });

        it('getFoodItems should call api with includeInactive=true', async () => {
            await getFoodItems(true);
            expect(apiClient.get).toHaveBeenCalledWith('/FoodItems?includeInactive=true');
        });

        it('getFoodItemsByCategory should call api with category', async () => {
            await getFoodItemsByCategory('Soup');
            expect(apiClient.get).toHaveBeenCalledWith('/FoodItems/category/Soup');
        });

        it('getFoodItemById should call api with id', async () => {
            await getFoodItemById(1);
            expect(apiClient.get).toHaveBeenCalledWith('/FoodItems/1');
        });

        it('createFoodItem should call post with data', async () => {
            const data = { Name: 'Test Item', Category: 1, Calories: 200 };
            await createFoodItem(data);
            expect(apiClient.post).toHaveBeenCalledWith('/FoodItems', data);
        });

        it('updateFoodItem should call put with id and data', async () => {
            const data = { Name: 'Updated Item' };
            await updateFoodItem(1, data);
            expect(apiClient.put).toHaveBeenCalledWith('/FoodItems/1', data);
        });

        it('deleteFoodItem should call del with id', async () => {
            await deleteFoodItem(1);
            expect(apiClient.del).toHaveBeenCalledWith('/FoodItems/1');
        });
    });

    // ============ MENUS ============
    describe('Menus', () => {
        it('getMenus should call api with empty params', async () => {
            await getMenus();
            expect(apiClient.get).toHaveBeenCalledWith('/MealMenus');
        });

        it('getMenus should call api with date param', async () => {
            await getMenus({ date: '2024-01-01' });
            expect(apiClient.get).toHaveBeenCalledWith('/MealMenus?date=2024-01-01');
        });

        it('getMenus should call api with cafeteriaId param', async () => {
            await getMenus({ cafeteriaId: 5 });
            expect(apiClient.get).toHaveBeenCalledWith('/MealMenus?cafeteriaId=5');
        });

        it('getMenus should call api with mealType param', async () => {
            await getMenus({ mealType: 1 });
            expect(apiClient.get).toHaveBeenCalledWith('/MealMenus?mealType=1');
        });

        it('getMenus should call api with all params', async () => {
            await getMenus({ date: '2024-01-01', cafeteriaId: 5, mealType: 2 });
            expect(apiClient.get).toHaveBeenCalledWith('/MealMenus?date=2024-01-01&cafeteriaId=5&mealType=2');
        });

        it('getMenuById should call api with id', async () => {
            await getMenuById(1);
            expect(apiClient.get).toHaveBeenCalledWith('/MealMenus/1');
        });

        it('createMenu should call post with data', async () => {
            const data = { CafeteriaId: 1, Date: '2024-01-01', MealType: 2, Price: 50 };
            await createMenu(data);
            expect(apiClient.post).toHaveBeenCalledWith('/MealMenus', data);
        });

        it('updateMenu should call put with id and data', async () => {
            const data = { Price: 60 };
            await updateMenu(1, data);
            expect(apiClient.put).toHaveBeenCalledWith('/MealMenus/1', data);
        });

        it('deleteMenu should call del with id and default force', async () => {
            await deleteMenu(1);
            expect(apiClient.del).toHaveBeenCalledWith('/MealMenus/1?force=false');
        });

        it('deleteMenu should call del with id and force=true', async () => {
            await deleteMenu(1, true);
            expect(apiClient.del).toHaveBeenCalledWith('/MealMenus/1?force=true');
        });

        it('publishMenu should call put', async () => {
            await publishMenu(1);
            expect(apiClient.put).toHaveBeenCalledWith('/MealMenus/1/publish');
        });

        it('unpublishMenu should call put', async () => {
            await unpublishMenu(1);
            expect(apiClient.put).toHaveBeenCalledWith('/MealMenus/1/unpublish');
        });

        it('addFoodItemToMenu should call post', async () => {
            await addFoodItemToMenu(1, 5);
            expect(apiClient.post).toHaveBeenCalledWith('/MealMenus/1/items/5');
        });

        it('removeFoodItemFromMenu should call del', async () => {
            await removeFoodItemFromMenu(1, 5);
            expect(apiClient.del).toHaveBeenCalledWith('/MealMenus/1/items/5');
        });
    });

    // ============ ENUM VALUES ============
    describe('Enum Values', () => {
        it('MealType should have correct values', () => {
            expect(MealType.Breakfast).toBe(1);
            expect(MealType.Lunch).toBe(2);
            expect(MealType.Dinner).toBe(3);
        });

        it('MealTypeLabels should have correct labels', () => {
            expect(MealTypeLabels[1]).toBe('Kahvaltı');
            expect(MealTypeLabels[2]).toBe('Öğle Yemeği');
            expect(MealTypeLabels[3]).toBe('Akşam Yemeği');
        });

        it('MealItemCategory should have correct values', () => {
            expect(MealItemCategory.Soup).toBe(1);
            expect(MealItemCategory.MainCourse).toBe(2);
            expect(MealItemCategory.SideDish).toBe(3);
            expect(MealItemCategory.Salad).toBe(4);
            expect(MealItemCategory.Beverage).toBe(5);
            expect(MealItemCategory.Dessert).toBe(6);
            expect(MealItemCategory.Appetizer).toBe(7);
        });

        it('MealItemCategoryLabels should have correct labels', () => {
            expect(MealItemCategoryLabels[1]).toBe('Çorba');
            expect(MealItemCategoryLabels[2]).toBe('Ana Yemek');
            expect(MealItemCategoryLabels[3]).toBe('Yan Yemek');
            expect(MealItemCategoryLabels[4]).toBe('Salata');
            expect(MealItemCategoryLabels[5]).toBe('İçecek');
            expect(MealItemCategoryLabels[6]).toBe('Tatlı');
            expect(MealItemCategoryLabels[7]).toBe('Meze');
        });
    });

    describe('Default export', () => {
        it('should export all functions', () => {
            expect(adminMealService.getCafeterias).toBeDefined();
            expect(adminMealService.getFoodItems).toBeDefined();
            expect(adminMealService.getMenus).toBeDefined();
            expect(adminMealService.publishMenu).toBeDefined();
            expect(adminMealService.MealType).toBeDefined();
        });
    });
});

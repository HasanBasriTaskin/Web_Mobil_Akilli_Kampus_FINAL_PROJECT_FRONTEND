'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, UtensilsCrossed, Clock, Leaf, Wheat, Flame, Apple, X, CheckCircle2 } from 'lucide-react';
import { getMenus, createReservation } from '@/services/meal.service';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';

/**
 * Meal Menu Page
 * Takvim görünümü ile menü seçimi ve rezervasyon
 */
export default function MealMenuPage() {
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [menus, setMenus] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedMeal, setSelectedMeal] = useState(null);
    const [reserving, setReserving] = useState(false);

    useEffect(() => {
        loadMenus();
    }, [selectedDate]);

    async function loadMenus() {
        try {
            setLoading(true);
            const dateStr = selectedDate.toISOString().split('T')[0];
            const response = await getMenus({ date: dateStr });
            setMenus(response.data || []);
        } catch (error) {
            toast.error('Menüler yüklenemedi');
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

    async function handleReserve(menu) {
        setSelectedMeal(menu);
    }

    async function confirmReservation() {
        if (!selectedMeal) return;

        try {
            setReserving(true);
            await createReservation({
                menuId: selectedMeal.id,
                mealType: selectedMeal.mealType,
                date: selectedDate.toISOString().split('T')[0]
            });
            toast.success('Rezervasyon başarıyla oluşturuldu!');
            setSelectedMeal(null);
            loadMenus();
        } catch (error) {
            toast.error(error.message || 'Rezervasyon yapılamadı');
        } finally {
            setReserving(false);
        }
    }

    // Takvim için tarih seçimi
    const today = new Date();
    const dates = Array.from({ length: 7 }, (_, i) => {
        const date = new Date(today);
        date.setDate(today.getDate() + i);
        return date;
    });

    const lunchMenus = menus.filter(m => m.mealType === 'lunch');
    const dinnerMenus = menus.filter(m => m.mealType === 'dinner');

    return (
        <div className="space-y-6">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4"
            >
                <div>
                    <h1 className="text-2xl lg:text-3xl font-bold">Yemek Menüsü</h1>
                </div>
            </motion.div>

            {/* Calendar Selector - Day Card View */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="rounded-xl bg-white dark:bg-slate-800/50 border border-border p-4"
            >
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3">
                    {dates.map((date, index) => {
                        const isSelected = date.toDateString() === selectedDate.toDateString();
                        const isToday = date.toDateString() === today.toDateString();
                        return (
                            <motion.button
                                key={index}
                                onClick={() => setSelectedDate(date)}
                                whileHover={{ scale: 1.05, y: -2 }}
                                whileTap={{ scale: 0.95 }}
                                className={`
                                    rounded-xl border-2 transition-all p-4 text-center
                                    ${isSelected
                                        ? 'border-blue-500 bg-gradient-to-br from-blue-500 via-blue-600 to-blue-700 text-white shadow-lg shadow-blue-500/40'
                                        : 'border-border hover:border-blue-500/50 hover:bg-blue-50 dark:hover:bg-blue-950/20 bg-white dark:bg-slate-800'
                                    }
                                    ${isToday && !isSelected ? 'ring-2 ring-blue-500/30 bg-blue-50/50 dark:bg-blue-950/10' : ''}
                                `}
                            >
                                <div className={`text-sm font-medium mb-2 ${isSelected ? 'text-white/90' : 'text-muted-foreground'}`}>
                                    {date.toLocaleDateString('tr-TR', { weekday: 'long' })}
                                </div>
                                <div className={`text-3xl font-bold mb-1 ${isSelected ? 'text-white' : 'text-foreground'}`}>
                                    {date.getDate()}
                                </div>
                                <div className={`text-sm ${isSelected ? 'text-white/80' : 'text-muted-foreground'}`}>
                                    {date.toLocaleDateString('tr-TR', { month: 'long' })}
                                </div>
                                {isToday && (
                                    <div className={`mt-2 text-xs font-medium ${isSelected ? 'text-white/90' : 'text-blue-600 dark:text-blue-400'}`}>
                                        Bugün
                                    </div>
                                )}
                            </motion.button>
                        );
                    })}
                </div>
            </motion.div>

            {/* Menus */}
            {loading ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {[...Array(2)].map((_, i) => (
                        <div key={i} className="h-64 bg-muted animate-pulse rounded-xl" />
                    ))}
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Lunch Menu */}
                    <MealCard
                        type="lunch"
                        menus={lunchMenus}
                        onReserve={handleReserve}
                        date={selectedDate}
                    />

                    {/* Dinner Menu */}
                    <MealCard
                        type="dinner"
                        menus={dinnerMenus}
                        onReserve={handleReserve}
                        date={selectedDate}
                    />
                </div>
            )}

            {/* Reservation Modal */}
            <AnimatePresence>
                {selectedMeal && (
                    <ReservationModal
                        meal={selectedMeal}
                        date={selectedDate}
                        onClose={() => setSelectedMeal(null)}
                        onConfirm={confirmReservation}
                        loading={reserving}
                    />
                )}
            </AnimatePresence>
        </div>
    );
}

/**
 * Meal Card Component
 */
function MealCard({ type, menus, onReserve, date }) {
    const menu = menus[0];
    const isLunch = type === 'lunch';

    if (!menu) {
        return (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-xl bg-white dark:bg-slate-800/50 border border-border p-6"
            >
                <div className="flex items-center gap-3 mb-4">
                    <div className={`p-2 rounded-lg ${isLunch ? 'bg-blue-100 dark:bg-blue-900/30' : 'bg-indigo-100 dark:bg-indigo-900/30'}`}>
                        <UtensilsCrossed className={`size-5 ${isLunch ? 'text-blue-600 dark:text-blue-400' : 'text-indigo-600 dark:text-indigo-400'}`} />
                    </div>
                    <h2 className="text-lg font-semibold">
                        {isLunch ? 'Öğle Yemeği' : 'Akşam Yemeği'}
                    </h2>
                </div>
                <p className="text-muted-foreground text-center py-8">
                    Bu tarih için menü bulunmuyor
                </p>
            </motion.div>
        );
    }

    const items = typeof menu.items === 'string' ? JSON.parse(menu.items) : menu.items;
    const nutrition = typeof menu.nutrition === 'string' ? JSON.parse(menu.nutrition) : menu.nutrition;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -4 }}
            transition={{ duration: 0.2 }}
            className={`
                rounded-xl border-2 overflow-hidden
                bg-gradient-to-br from-white to-slate-50
                dark:from-slate-800/50 dark:to-slate-900/50
                ${isLunch
                    ? 'border-blue-200 dark:border-blue-900/50 shadow-lg shadow-blue-500/10'
                    : 'border-indigo-200 dark:border-indigo-900/50 shadow-lg shadow-indigo-500/10'
                }
            `}
        >
            {/* Header */}
            <div className={`
                p-6 border-b-2
                ${isLunch
                    ? 'bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 dark:from-blue-600 dark:via-blue-700 dark:to-blue-800 border-blue-300 dark:border-blue-800'
                    : 'bg-gradient-to-r from-indigo-500 to-indigo-600 dark:from-indigo-600 dark:to-indigo-700 border-indigo-300 dark:border-indigo-800'
                }
            `}>
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <UtensilsCrossed className="size-6 text-white" />
                        <h2 className="text-xl font-bold text-white">
                            {isLunch ? 'Öğle Yemeği' : 'Akşam Yemeği'}
                        </h2>
                    </div>
                    <Clock className="size-5 text-white/80" />
                </div>
            </div>

            {/* Content */}
            <div className="p-6 space-y-4">
                {/* Items */}
                <div className="space-y-2">
                    <h3 className="font-semibold text-sm text-muted-foreground">Menü İçeriği</h3>
                    <ul className="space-y-2">
                        {items.map((item, index) => (
                            <motion.li
                                key={index}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.05 }}
                                className="flex items-center gap-3 text-sm"
                            >
                                <CheckCircle2 className="size-5 text-blue-500 dark:text-blue-400 flex-shrink-0" />
                                <span className="flex-1">{item}</span>
                                {item.toLowerCase().includes('vegan') && (
                                    <Leaf className="size-4 text-green-600 dark:text-green-400 flex-shrink-0" />
                                )}
                                {item.toLowerCase().includes('vejetaryen') && (
                                    <Wheat className="size-4 text-amber-600 dark:text-amber-400 flex-shrink-0" />
                                )}
                            </motion.li>
                        ))}
                    </ul>
                </div>

                {/* Nutrition Info */}
                {nutrition && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="grid grid-cols-3 gap-3 pt-4 border-t border-border"
                    >
                        <div className="text-center p-3 rounded-lg bg-muted/50">
                            <Flame className="size-5 mx-auto mb-1 text-orange-500" />
                            <div className="text-xs text-muted-foreground">Kalori</div>
                            <div className="font-bold">{nutrition.calories || 'N/A'}</div>
                        </div>
                        <div className="text-center p-3 rounded-lg bg-muted/50">
                            <Apple className="size-5 mx-auto mb-1 text-green-500" />
                            <div className="text-xs text-muted-foreground">Protein</div>
                            <div className="font-bold">{nutrition.protein || 'N/A'}g</div>
                        </div>
                        <div className="text-center p-3 rounded-lg bg-muted/50">
                            <div className="size-5 mx-auto mb-1 rounded-full bg-blue-500" />
                            <div className="text-xs text-muted-foreground">Karbonhidrat</div>
                            <div className="font-bold">{nutrition.carbs || 'N/A'}g</div>
                        </div>
                    </motion.div>
                )}

                {/* Reserve Button */}
                <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                >
                    <Button
                        onClick={() => onReserve(menu)}
                        className={`
                            w-full h-11 font-medium
                            ${isLunch
                                ? 'bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:from-blue-600 hover:via-blue-700 hover:to-blue-800 text-white shadow-lg shadow-blue-500/30'
                                : 'bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white shadow-lg shadow-indigo-500/30'
                            }
                        `}
                    >
                        Rezervasyon Yap
                    </Button>
                </motion.div>
            </div>
        </motion.div>
    );
}

/**
 * Reservation Modal Component
 */
function ReservationModal({ meal, date, onClose, onConfirm, loading }) {
    const items = typeof meal.items === 'string' ? JSON.parse(meal.items) : meal.items;
    const isLunch = meal.mealType === 'lunch';

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
            onClick={onClose}
        >
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className={`
                    w-full max-w-md rounded-2xl border-2 overflow-hidden
                    bg-white dark:bg-slate-900
                    ${isLunch
                        ? 'border-blue-200 dark:border-blue-900/50 shadow-2xl shadow-blue-500/20'
                        : 'border-indigo-200 dark:border-indigo-900/50 shadow-2xl shadow-indigo-500/20'
                    }
                `}
            >
                {/* Header */}
                <div className={`
                    p-6 border-b-2
                    ${isLunch
                        ? 'bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 dark:from-blue-600 dark:via-blue-700 dark:to-blue-800'
                        : 'bg-gradient-to-r from-indigo-500 to-indigo-600 dark:from-indigo-600 dark:to-indigo-700'
                    }
                `}>
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-bold text-white">Rezervasyon Onayı</h2>
                        <button
                            onClick={onClose}
                            className="p-1 rounded-lg hover:bg-white/20 transition-colors"
                        >
                            <X className="size-5 text-white" />
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="p-6 space-y-4">
                    <div className="space-y-2">
                        <div className="text-sm text-muted-foreground">Tarih</div>
                        <div className="font-semibold">
                            {date.toLocaleDateString('tr-TR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                        </div>
                    </div>
                    <div className="space-y-2">
                        <div className="text-sm text-muted-foreground">Öğün</div>
                        <div className="font-semibold">
                            {isLunch ? 'Öğle Yemeği' : 'Akşam Yemeği'}
                        </div>
                    </div>
                    <div className="space-y-2">
                        <div className="text-sm text-muted-foreground">Menü</div>
                        <ul className="space-y-2">
                            {items.map((item, index) => (
                                <li key={index} className="text-sm flex items-center gap-3">
                                    <CheckCircle2 className="size-5 text-blue-500 dark:text-blue-400 flex-shrink-0" />
                                    <span>{item}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Actions */}
                <div className="p-6 border-t border-border flex gap-3">
                    <Button
                        variant="outline"
                        onClick={onClose}
                        className="flex-1"
                        disabled={loading}
                    >
                        İptal
                    </Button>
                    <Button
                        onClick={onConfirm}
                        disabled={loading}
                        className={`
                            flex-1
                            ${isLunch
                                ? 'bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:from-blue-600 hover:via-blue-700 hover:to-blue-800'
                                : 'bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700'
                            }
                        `}
                    >
                        {loading ? 'Rezervasyon yapılıyor...' : 'Onayla'}
                    </Button>
                </div>
            </motion.div>
        </motion.div>
    );
}


// Класс для фильтрации меню по категориям
class FilterService {
    filterByCategory(items, category) {
        if (category === 'all') {
            return items;  // Возвращаем все блюда
        }
        // Возвращаем только те блюда, у которых категория совпадает
        return items.filter(item => item.category === category);
    }
}
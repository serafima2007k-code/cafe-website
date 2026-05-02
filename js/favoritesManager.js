// Класс для работы с избранным (сохранение в localStorage)
class FavoritesManager {
    constructor() {
        this.storageKey = 'cafeFavorites';  // Ключ для хранения
        this.items = [];                     // Массив ID избранных блюд
        this.load();                         // Загружаем сохранённые данные
    }
    
    // Загрузить избранное из памяти браузера
    load() {
        const saved = localStorage.getItem(this.storageKey);
        if (saved) {
            this.items = JSON.parse(saved);
        } else {
            this.items = [];
        }
    }
    
    // Сохранить избранное в память браузера
    save() {
        localStorage.setItem(this.storageKey, JSON.stringify(this.items));
    }
    
    // Добавить блюдо в избранное
    add(id) {
        if (!this.items.includes(id)) {
            this.items.push(id);
            this.save();
        }
    }
    
    // Удалить блюдо из избранного
    remove(id) {
        this.items = this.items.filter(itemId => itemId !== id);
        this.save();
    }
    
    // Проверить, есть ли блюдо в избранном
    isFavorite(id) {
        return this.items.includes(id);
    }
    
    // Получить список избранных блюд (полные данные из menuItems)
    getFavoritesData(fullMenu) {
        return fullMenu.filter(item => this.isFavorite(item.id));
    }
    
    // Получить количество избранных блюд
    getCount() {
        return this.items.length;
    }
}
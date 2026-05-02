// Запуск при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    
    // Создаем объекты классов
    const favoritesManager = new FavoritesManager();
    const filterService = new FilterService();
    const uiManager = new UIManager();
    const formValidator = new FormValidator();
    
    let currentFilter = 'all';
    
    
    //Функция обновления меню
    function updateMenu() {
        const filteredItems = filterService.filterByCategory(menuItems, currentFilter);
        uiManager.renderMenuItems('menu-container', filteredItems, favoritesManager);
        uiManager.updateFavoritesCounter('favorites-count', favoritesManager.getCount());
    }
    
    //Функция обновления избранного
    function updateFavorites() {
        const favoriteItems = favoritesManager.getFavoritesData(menuItems);
        uiManager.renderMenuItems('favorites-container', favoriteItems, favoritesManager);
        uiManager.updateFavoritesCounter('favorites-count', favoritesManager.getCount());
    }
    
    //Функция обновления всего
    function updateAll() {
        updateMenu();
        updateFavorites();
    }
    
    
    //Кнопки фильтрации
    const filterButtons = document.querySelectorAll('.filter-btn');
    for (let i = 0; i < filterButtons.length; i++) {
        const button = filterButtons[i];
        button.addEventListener('click', function() {
            currentFilter = button.getAttribute('data-category');
            
            // Меняем внешний вид кнопок
            for (let j = 0; j < filterButtons.length; j++) {
                filterButtons[j].classList.remove('active');
            }
            button.classList.add('active');
            
            updateMenu();
        });
    }
    
    
    //Добавление/удаление из избранного
    document.addEventListener('click', function(event) {
        const favButton = event.target.closest('.card__favorite-btn');
        if (!favButton) return;
        
        const itemId = parseInt(favButton.getAttribute('data-id'));
        
        if (favoritesManager.isFavorite(itemId)) {
            favoritesManager.remove(itemId);
        } else {
            favoritesManager.add(itemId);
        }
        
        updateAll();
    });
    
    
    //Форма бронирования
    const bookingForm = document.getElementById('booking-form');
    if (bookingForm) {
        bookingForm.addEventListener('submit', function(event) {
            event.preventDefault();
            
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const date = document.getElementById('date').value;
            
            const result = formValidator.validateForm(name, email, date);
            
            if (result.isValid) {
                formValidator.showMessage('form-message', 'Спасибо! Ваша заявка отправлена.', true);
                bookingForm.reset();
            } else {
                formValidator.showMessage('form-message', result.error, false);
            }
        });
    }
    
// плавная прокрутка с отступом
const links = document.querySelectorAll('.nav__link');
const header = document.querySelector('.header');

for (let i = 0; i < links.length; i++) {
    links[i].addEventListener('click', function(event) {
        event.preventDefault();
        
        const target = document.querySelector(this.getAttribute('href'));
        
        if (target) {
            const headerHeight = header.offsetHeight;
            const targetPosition = target.offsetTop - headerHeight;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
}
    
    //Запускаем отображение
    updateAll();
});
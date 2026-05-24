// Запуск при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    
    // Создаем объекты классов
    const favoritesManager = new FavoritesManager();
    const filterService = new FilterService();
    const uiManager = new UIManager();
    const formValidator = new FormValidator();
    
    let currentFilter = 'all';
    
    
    // ===== ФУНКЦИИ ОБНОВЛЕНИЯ ИНТЕРФЕЙСА =====
    
    // Функция обновления меню
    function updateMenu() {
        const filteredItems = filterService.filterByCategory(menuItems, currentFilter);
        uiManager.renderMenuItems('menu-container', filteredItems, favoritesManager);
        uiManager.updateFavoritesCounter('favorites-count', favoritesManager.getCount());
    }
    
    // Функция обновления избранного
    function updateFavorites() {
        const favoriteItems = favoritesManager.getFavoritesData(menuItems);
        uiManager.renderMenuItems('favorites-container', favoriteItems, favoritesManager);
        uiManager.updateFavoritesCounter('favorites-count', favoritesManager.getCount());
    }
    
    // Функция обновления всего
    function updateAll() {
        updateMenu();
        updateFavorites();
    }
    
    
    // ===== КНОПКИ ФИЛЬТРАЦИИ =====
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
    
    
    // ===== ДОБАВЛЕНИЕ/УДАЛЕНИЕ ИЗ ИЗБРАННОГО =====
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
    
    
    // ===== ФОРМА БРОНИРОВАНИЯ =====
    const bookingForm = document.getElementById('booking-form');
    if (bookingForm) {
        bookingForm.addEventListener('submit', function(event) {
            event.preventDefault();
            
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const date = document.getElementById('date').value;
            
            const result = formValidator.validateForm(name, email, date);
            
            if (result.isValid) {
                // СОХРАНЯЕМ ЗАЯВКУ ДЛЯ АДМИНА
                saveBookingToLocalStorage(name, email, date);
                
                formValidator.showMessage('form-message', 'Спасибо! Ваша заявка отправлена.', true);
                bookingForm.reset();
            } else {
                formValidator.showMessage('form-message', result.error, false);
            }
        });
    }
    
    
    // ===== ПЛАВНАЯ ПРОКРУТКА С ОТСТУПОМ =====
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
    
    
    // ===== АДМИН-ПАНЕЛЬ (ИМИТАЦИЯ ДЛЯ УЧЕБНЫХ ЦЕЛЕЙ) =====
    
    // Элементы админ-панели
    const adminLoginBtn = document.getElementById('adminLoginBtn');
    const adminPanel = document.getElementById('adminPanel');
    const adminOverlay = document.getElementById('adminOverlay');
    const adminPanelClose = document.getElementById('adminPanelClose');
    const adminShowBookings = document.getElementById('adminShowBookings');
    const adminBookingsList = document.getElementById('adminBookingsList');
    const adminShowFavoritesStats = document.getElementById('adminShowFavoritesStats');
    const adminFavoritesStats = document.getElementById('adminFavoritesStats');
    
    // Функция открытия админ-панели
    function openAdminPanel() {
        const password = prompt('Введите пароль администратора:');
        if (password === 'admin') {
            adminPanel.classList.add('active');
            adminOverlay.classList.add('active');
        } else if (password !== null) {
            alert('Неверный пароль!');
        }
    }
    
    // Функция закрытия админ-панели
    function closeAdminPanel() {
        adminPanel.classList.remove('active');
        adminOverlay.classList.remove('active');
    }
    
    // Обработчики кнопок админ-панели
    if (adminLoginBtn) {
        adminLoginBtn.addEventListener('click', openAdminPanel);
    }
    
    if (adminPanelClose) {
        adminPanelClose.addEventListener('click', closeAdminPanel);
    }
    
    if (adminOverlay) {
        adminOverlay.addEventListener('click', closeAdminPanel);
    }
    
    // Функция сохранения заявки в localStorage
    function saveBookingToLocalStorage(name, email, date) {
        const bookings = JSON.parse(localStorage.getItem('cafeBookings') || '[]');
        bookings.push({
            id: Date.now(),
            name: name,
            email: email,
            date: date,
            timestamp: new Date().toLocaleString()
        });
        localStorage.setItem('cafeBookings', JSON.stringify(bookings));
    }
    
    // Показать заявки на бронирование
    if (adminShowBookings) {
        adminShowBookings.addEventListener('click', function() {
            const bookings = JSON.parse(localStorage.getItem('cafeBookings') || '[]');
            
            if (bookings.length === 0) {
                adminBookingsList.innerHTML = '<div class="admin-panel__empty">📭 Нет заявок на бронирование</div>';
                return;
            }
            
            let html = '';
            for (let i = 0; i < bookings.length; i++) {
                const booking = bookings[i];
                html += `
                    <div class="admin-panel__list-item">
                        <p><strong>👤 ${booking.name}</strong></p>
                        <p>📧 ${booking.email}</p>
                        <p>📅 ${booking.date}</p>
                        <p style="font-size: 11px; color: #aaa;">🕐 ${booking.timestamp}</p>
                    </div>
                `;
            }
            adminBookingsList.innerHTML = html;
        });
    }
    
    // Показать статистику избранного
    if (adminShowFavoritesStats) {
        adminShowFavoritesStats.addEventListener('click', function() {
            const favorites = favoritesManager.items;
            const totalFavorites = favorites.length;
            
            // Подсчитываем, какие блюда чаще всего добавляют в избранное
            const favoriteCounts = {};
            for (let i = 0; i < favorites.length; i++) {
                const id = favorites[i];
                if (favoriteCounts[id]) {
                    favoriteCounts[id]++;
                } else {
                    favoriteCounts[id] = 1;
                }
            }
            
            // Получаем названия блюд
            const popularItems = [];
            for (const id in favoriteCounts) {
                for (let j = 0; j < menuItems.length; j++) {
                    if (menuItems[j].id == id) {
                        popularItems.push({
                            name: menuItems[j].name,
                            count: favoriteCounts[id]
                        });
                        break;
                    }
                }
            }
            
            if (totalFavorites === 0) {
                adminFavoritesStats.innerHTML = '<div class="admin-panel__empty">⭐ Нет добавленных в избранное блюд</div>';
                return;
            }
            
            let html = `
                <div class="admin-panel__list-item">
                    <p><strong>📊 Всего в избранном:</strong> ${totalFavorites} позиций</p>
                </div>
            `;
            
            if (popularItems.length > 0) {
                html += `<div class="admin-panel__list-item"><p><strong>🍽️ Популярные блюда:</strong></p>`;
                const topItems = popularItems.slice(0, 5);
                for (let i = 0; i < topItems.length; i++) {
                    html += `<p style="margin-left: 15px;">• ${topItems[i].name} (добавлено ${topItems[i].count} раз)</p>`;
                }
                html += `</div>`;
            }
            
            adminFavoritesStats.innerHTML = html;
        });
    }
    
    // ===== ЗАПУСКАЕМ ОТОБРАЖЕНИЕ =====
    updateAll();
});
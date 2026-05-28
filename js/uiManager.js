// Класс для отображения карточек и обновления интерфейса
class UIManager {
    
    // Показать карточки блюд в контейнере
    renderMenuItems(containerId, items, favoritesManager) {
        const container = document.getElementById(containerId);
        if (!container) return;
        
        // Очищаем контейнер
        container.innerHTML = '';
        
        // Если нет блюд — показываем сообщение
        if (items.length === 0) {
            container.innerHTML = '<p class="empty-message">Ничего не найдено</p>';
            return;
        }
        
        // Для каждого блюда создаём карточку и добавляем в контейнер
        for (let i = 0; i < items.length; i++) {
            const item = items[i];
            const isFavorite = favoritesManager.isFavorite(item.id);
            const card = this.createCard(item, isFavorite);
            container.appendChild(card);
        }
    }
    
    // Создать одну карточку блюда
    createCard(item, isFavorite) {
        const card = document.createElement('div');
        card.className = 'card';
        card.setAttribute('data-id', item.id); 
        
        // Создаём HTML карточки
        card.innerHTML = `
            <img src="${item.image}" alt="${item.name}" class="card__image" loading="lazy" onerror="this.src='data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22300%22%20height%3D%22200%22%20viewBox%3D%220%200%20300%20200%22%3E%3Crect%20width%3D%22300%22%20height%3D%22200%22%20fill%3D%22%23F5E6D3%22%2F%3E%3Ctext%20x%3D%2250%25%22%20y%3D%2250%25%22%20text-anchor%3D%22middle%22%20fill%3D%22%238D6E63%22%3E${item.name}%3C%2Ftext%3E%3C%2Fsvg%3E'">
            <div class="card__content">
                <h3 class="card__title">${item.name}</h3>
                <p class="card__description">${item.description}</p>
                <p class="card__price">${item.price} ₽</p>
                <button class="card__favorite-btn ${isFavorite ? 'active' : ''}" data-id="${item.id}">
                    ${isFavorite ? '❤️ В избранном' : '♡ В избранное'}
                </button>
            </div>
        `;
        
        return card;
    }
    
    // Обновить счётчик избранного
    updateFavoritesCounter(counterElementId, count) {
        const counter = document.getElementById(counterElementId);
        if (counter) {
            counter.textContent = count;
        }
    }
}

// Класс для проверки формы бронирования
class FormValidator {
    validateForm(name, email, date) {
        // Проверяем имя
        if (!name || name.trim() === '') {
            return { isValid: false, error: 'Пожалуйста, укажите ваше имя' };
        }
       
        if (!email || email.trim() === '') {
            return { isValid: false, error: 'Пожалуйста, укажите email' };
        }
        
        if (!email.includes('@') || !email.includes('.')) {
            return { isValid: false, error: 'Введите корректный email (например, name@mail.ru)' };
        }
     
        if (!date) {
            return { isValid: false, error: 'Пожалуйста, выберите дату' };
        }
    
        return { isValid: true, error: '' };
    }
    
    // Показать сообщение пользователю
    showMessage(elementId, message, isSuccess) {
        const messageDiv = document.getElementById(elementId);
        if (messageDiv) {
            messageDiv.textContent = message;
            messageDiv.className = `form-message ${isSuccess ? 'success' : 'error'}`;
            
            // Скрыть сообщение через 3 секунды
            setTimeout(() => {
                messageDiv.textContent = '';
                messageDiv.className = 'form-message';
            }, 3000);
        }
    }
}
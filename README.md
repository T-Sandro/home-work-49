# my-react-app — UserProfile + tests

Короткий опис
---
Невеликий React-проєкт (Vite) з компонентом `UserProfile`, який робить асинхронний GET-запит до зовнішнього API і показує стан завантаження, дані користувача або помилку. Для тестування використано Vitest + @testing-library/react з мокуванням `fetch`.

Як запустити
---
```bash
1. npm install
2. npm run dev
---
Запустити тести:

npm test
# або щоб виконати один раз без watch:
npx vitest run
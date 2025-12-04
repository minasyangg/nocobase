# 🎓 Система отслеживания учебного процесса

> Полнофункциональная платформа для управления образованием, созданная на базе NocoBase

## 📚 Полная документация в папке `docs/`

Вся документация находится в папке **`docs/`**:

```
docs/
├── START_HERE.txt                 👈 **НАЧНИТЕ ОТСЮДА** - быстрая навигация
├── QUICK_START.md                 ⚡ Быстрый старт за 5 минут
├── SYSTEM_OVERVIEW.md             📋 Краткий обзор системы
├── TEACHER_SYSTEM_SETUP.md        📖 Подробная инструкция
├── MCP_INTEGRATION_GUIDE.md       🔧 Интеграция с VS Code
├── ARCHITECTURE.md                📐 Техническая архитектура
├── INDEX.md                       🗺️ Полный навигатор
└── SUMMARY.txt                    📝 Итоговое резюме
```

## 🚀 Быстрый старт (3 шага)

### 1. Запустить NocoBase
```bash
NODE_OPTIONS="--max_old_space_size=6144" npm run dev
```
→ Откройте: http://localhost:13000

### 2. Создать таблицы
Следуйте `docs/QUICK_START.md` или запустите скрипт

### 3. Перезагрузить VS Code
`Ctrl+Shift+P` → `Developer: Reload Window` → Используйте `@mcp nocobase`

## ✨ Основные возможности

✅ Управление учениками и классами  
✅ Планирование и отслеживание занятий  
✅ Выдача и контроль домашних заданий  
✅ Ведение оценок и результатов  
✅ Анализ прогресса учеников  
✅ Отчёты для родителей  
✅ MCP интеграция в VS Code  

## 📝 Структура таблиц

- **SUBJECTS** - Предметы
- **CLASSES** - Классы
- **STUDENTS** - Учащиеся
- **LESSONS** - Занятия
- **HOMEWORKS** - Домашние задания
- **HOMEWORK_SUBMISSIONS** - Выполнение ДЗ
- **ASSESSMENTS** - Контрольные работы
- **ASSESSMENT_RESULTS** - Результаты оценок
- **ATTENDANCE** - Посещаемость
- **REPORTS** - Отчёты

## 📖 Где найти нужную информацию?

| Ищу | Файл |
|-----|------|
| 👈 Быстрая навигация | `docs/START_HERE.txt` |
| ⚡ Быстрый старт | `docs/QUICK_START.md` |
| 📚 Как создать таблицы | `docs/TEACHER_SYSTEM_SETUP.md` |
| 🤖 MCP примеры | `docs/MCP_INTEGRATION_GUIDE.md` |
| 📐 Архитектура | `docs/ARCHITECTURE.md` |
| 🗺️ Полная информация | `docs/INDEX.md` |

---

**👉 Начните с файла: `docs/START_HERE.txt`**

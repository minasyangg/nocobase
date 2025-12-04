# 🎓 MCP Integration Guide - Интеграция с VS Code через MCP сервер

Это руководство показывает как использовать MCP сервер NocoBase для работы с системой отслеживания из VS Code.

## 📋 Оглавление

1. [Активация MCP сервера](#активация-mcp-сервера)
2. [Доступные операции](#доступные-операции)
3. [Примеры использования](#примеры-использования)
4. [API Reference](#api-reference)

---

## 🚀 Активация MCP сервера

### Шаг 1: Убедитесь, что NocoBase запущен

```bash
# В первом терминале
cd d:/www/nocobase
NODE_OPTIONS="--max_old_space_size=6144" npm run dev
```

Проверьте: http://localhost:13000 должен быть доступен

### Шаг 2: Перезагрузите VS Code

После того как `.vscode/mcp.json` был создан, перезагрузите VS Code:
- `Ctrl+Shift+P` → `Developer: Reload Window`
- Или просто перезапустите приложение

### Шаг 3: Проверьте подключение

Откройте **"Copilot Chat"** (`Ctrl+Shift+I` или Command Palette → "Copilot: Open Chat"):

```
@mcp nocobase
```

Если подключение успешно, вы увидите список доступных инструментов.

---

## 🔧 Доступные операции

Через MCP сервер вы можете выполнить любую операцию, доступную в REST API NocoBase:

### Основные операции с таблицами

- **Получить список записей**: `GET /api/v1/{table}`
- **Создать запись**: `POST /api/v1/{table}`
- **Обновить запись**: `PATCH /api/v1/{table}/{id}`
- **Удалить запись**: `DELETE /api/v1/{table}/{id}`
- **Фильтрация и поиск**: `GET /api/v1/{table}?filter[field]=value`
- **Сортировка**: `GET /api/v1/{table}?sort=field`

---

## 💡 Примеры использования

### Пример 1: Создание ученика

**В MCP/Copilot Chat:**
```
@mcp nocobase create_student

Создай нового ученика:
- Имя: Петр
- Фамилия: Смирнов
- Тип: Школьник 8 класса
- Email: petr.smirnov@example.com
```

**Эквивалент REST API:**
```bash
curl -X POST http://localhost:13000/api/v1/students \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Петр",
    "lastName": "Смирнов",
    "studentType": "school_8",
    "email": "petr.smirnov@example.com"
  }'
```

### Пример 2: Выдача домашнего задания

**В MCP/Copilot Chat:**
```
@mcp nocobase create_homework

Создай домашнее задание:
- Название: "Задачи на системы уравнений"
- Описание: "Решить задачи 2.1-2.5 из параграфа 2.3 учебника"
- Предмет: Математика
- Дата выдачи: сегодня
- Срок сдачи: через 3 дня
- Сложность: Среднее
- Макс. баллов: 10
```

### Пример 3: Запись оценки

**В MCP/Copilot Chat:**
```
@mcp nocobase create_assessment_result

Добавь результат контрольной:
- Контрольная: "Контрольная по физике - Динамика"
- Ученик: Иван Сидоров
- Баллы: 85
- Оценка: 4
- Комментарий: "Хорошо решил основные задачи, но ошибка в 3-й задаче"
```

### Пример 4: Создание занятия

**В MCP/Copilot Chat:**
```
@mcp nocobase create_lesson

Создай занятие:
- Дата: 2024-12-04
- Время начала: 15:00
- Время окончания: 16:30
- Предмет: Математика
- Ученик: Мария Петрова
- Тип: Обычный урок
- Тема: "Решение квадратных уравнений"
- Описание: "Повторили формулу дискриминанта, решили примеры из учебника"
```

### Пример 5: Получение отчёта о ученике

**В MCP/Copilot Chat:**
```
@mcp nocobase get_student_report

Получи информацию о ученике "Мария Петрова":
- Все его занятия
- Все домашние задания и статус выполнения
- Все полученные оценки
- Среднюю оценку по каждому предмету
```

---

## 📊 Функции для анализа данных

### Функция 1: Анализ успеваемости ученика

```
@mcp nocobase analyze_student_performance

Проанализируй успеваемость ученика "Иван Сидоров":
1. Найди все его оценки за последний месяц
2. Вычисли среднюю оценку
3. Определи предметы, в которых нужна помощь
4. Предложи рекомендации
```

### Функция 2: Контроль выполнения ДЗ

```
@mcp nocobase homework_status_report

Что со статусом домашних заданий?
1. Сколько ДЗ просрочено?
2. Какие ученики не выполнили ДЗ?
3. Какие предметы отстают?
```

### Функция 3: Отчёт о посещаемости

```
@mcp nocobase attendance_report

Составь отчёт о посещаемости:
- За период: последний месяц
- Класс: 8А
- Кто пропускал уроки?
- Сколько занятий посетил каждый ученик?
```

---

## 🔌 Подробный API Reference

### Таблица: `subjects` (Предметы)

**Структура записи:**
```json
{
  "id": "rec123...",
  "name": "Математика",
  "description": "Курс математики для 7-8 классов",
  "color": "#FF6B6B",
  "icon": "📚"
}
```

**Доступные методы:**
```
GET    /api/v1/subjects                    - Получить все предметы
GET    /api/v1/subjects/{id}               - Получить предмет по ID
POST   /api/v1/subjects                    - Создать предмет
PATCH  /api/v1/subjects/{id}               - Обновить предмет
DELETE /api/v1/subjects/{id}               - Удалить предмет
```

### Таблица: `students` (Учащиеся)

**Структура записи:**
```json
{
  "id": "rec456...",
  "firstName": "Иван",
  "lastName": "Сидоров",
  "middleName": "Петрович",
  "email": "ivan@example.com",
  "phone": "+7-900-123-45-67",
  "studentType": "school_8",
  "notes": "Активный участник",
  "classId": "rec789..."
}
```

**Доступные методы:**
```
GET    /api/v1/students                    - Получить всех учеников
GET    /api/v1/students?filter[studentType]=school_8  - Фильтр по типу
GET    /api/v1/students/{id}               - Получить ученика
POST   /api/v1/students                    - Создать ученика
PATCH  /api/v1/students/{id}               - Обновить ученика
DELETE /api/v1/students/{id}               - Удалить ученика
```

### Таблица: `lessons` (Занятия)

**Структура записи:**
```json
{
  "id": "rec...",
  "date": "2024-12-04",
  "startTime": "15:00",
  "endTime": "16:30",
  "subject": "Математика",
  "student": "Иван Сидоров",
  "lessonType": "regular",
  "status": "completed",
  "topic": "Квадратные уравнения",
  "description": "Теория и практика",
  "notes": "Ученик хорошо понял тему"
}
```

**Фильтры:**
```
GET /api/v1/lessons?filter[status]=completed        - Только проведённые
GET /api/v1/lessons?filter[subject]=Математика     - По предмету
GET /api/v1/lessons?filter[student]=Иван Сидоров   - По ученику
GET /api/v1/lessons?sort=-date                       - Сортировка по дате
```

### Таблица: `homeworks` (Домашние задания)

**Структура записи:**
```json
{
  "id": "rec...",
  "title": "Задачи на движение",
  "description": "Решить задачи 1.1-1.5",
  "subject": "Математика",
  "givenDate": "2024-12-04",
  "dueDate": "2024-12-07",
  "difficulty": "medium",
  "maxPoints": 10,
  "notes": ""
}
```

**Фильтры:**
```
GET /api/v1/homeworks?filter[subject]=Физика       - По предмету
GET /api/v1/homeworks?filter[dueDate]>=2024-12-04  - По сроку
```

### Таблица: `homework_submissions` (Выполнение ДЗ)

**Структура записи:**
```json
{
  "id": "rec...",
  "homework": "Задачи на движение",
  "student": "Иван Сидоров",
  "status": "submitted",
  "submittedDate": "2024-12-06",
  "points": 9,
  "grade": "4",
  "feedback": "Хорошо выполнено, небольшие ошибки в 2-й задаче",
  "teacherNotes": "Нужно повторить методику"
}
```

### Таблица: `assessments` (Контрольные работы)

**Структура записи:**
```json
{
  "id": "rec...",
  "date": "2024-12-03",
  "subject": "Физика",
  "assessmentType": "control_work",
  "topic": "Динамика",
  "maxPoints": 100,
  "description": "Контрольная на тему 'Законы Ньютона'"
}
```

### Таблица: `assessment_results` (Результаты оценок)

**Структура записи:**
```json
{
  "id": "rec...",
  "assessment": "Контрольная по физике",
  "student": "Мария Петрова",
  "points": 85,
  "percentage": 85,
  "grade": "4",
  "feedback": "Отличная работа, только небольшие замечания"
}
```

### Таблица: `reports` (Отчёты для родителей)

**Структура записи:**
```json
{
  "id": "rec...",
  "period": "Декабрь 2024",
  "student": "Иван Сидоров",
  "subject": "Математика",
  "averageGrade": 4.3,
  "lessonsAttended": 8,
  "lessonsTotal": 8,
  "homeworkCompleted": 7,
  "homeworkTotal": 8,
  "strengths": "Хорошо решает примеры, активен на уроках",
  "areas_for_improvement": "Нужно лучше разбирать теорию",
  "recommendations": "Решать больше задач дома, повторять теорию",
  "generatedDate": "2024-12-04"
}
```

---

## 🎯 Практические сценарии

### Сценарий 1: Еженедельный контроль

**Задача:** Каждый понедельник отправлять отчёт о ДЗ родителям

**Процесс:**
```
1. @mcp nocobase get_homework_status
   - Какие ДЗ не сданы?
   - Кто отстаёт?

2. @mcp nocobase send_parent_notification
   - Создать отчёт о выполнении
   - Отправить по email

3. @mcp nocobase update_reports
   - Обновить еженедельный отчёт
   - Добавить данные о посещаемости
```

### Сценарий 2: Анализ прогресса ученика

**Задача:** Определить, как развивается ученик

**Процесс:**
```
1. @mcp nocobase get_student_grades {student_name}
   - Получить все оценки за период

2. @mcp nocobase analyze_trends
   - Улучшается или снижается успеваемость?
   - По каким предметам есть проблемы?

3. @mcp nocobase generate_recommendations
   - Какую помощь нужно оказать?
   - Рекомендации для родителей
```

### Сценарий 3: Планирование занятий

**Задача:** Запланировать занятия на неделю

**Процесс:**
```
1. @mcp nocobase create_lesson_plan
   - Дата: 2024-12-09 - 2024-12-13
   - Классы: 7А, 7Б, 8А, 8Б
   - Предметы: все 4

2. @mcp nocobase schedule_lessons
   - Математика: пн, сб (2 часа)
   - Физика: вт, пт (1,5 часа)
   - Геометрия: ср, пт (1 час)
   - Вероятность: чт (1 час)

3. @mcp nocobase track_attendance
   - Отмечать посещаемость
   - Отслеживать пропуски
```

---

## 📚 Полезные SQL-подобные запросы

NocoBase поддерживает фильтры похожие на SQL. Примеры:

```bash
# Получить всех учеников 8 класса
GET /api/v1/students?filter[studentType]=school_8

# Получить ДЗ на неделю вперед
GET /api/v1/homeworks?filter[dueDate]>=2024-12-04&filter[dueDate]<=2024-12-11

# Получить оценки выше 4
GET /api/v1/assessment_results?filter[grade]=5&filter[grade]=4

# Получить просроченные ДЗ
GET /api/v1/homework_submissions?filter[status]=not_submitted&filter[submittedDate]<2024-12-04

# Получить занятия по математике в декабре
GET /api/v1/lessons?filter[subject]=Математика&filter[date]>=2024-12-01&filter[date]<=2024-12-31
```

---

## 🔐 Безопасность

### Токены

Ваш API токен хранится в `.vscode/mcp.json`:
```json
{
  "args": [
    "...",
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  ]
}
```

⚠️ **Никогда не делитесь этим токеном!**

### Сброс токена

Если токен был скомпрометирован:
1. Откройте http://localhost:13000
2. Перейдите в Settings → API Tokens
3. Удалите скомпрометированный токен
4. Создайте новый
5. Обновите `.vscode/mcp.json`

---

## ❓ Часто задаваемые вопросы

**Q: MCP сервер не подключается**
A: Проверьте:
- NocoBase запущен на localhost:13000
- Токен в `.vscode/mcp.json` актуален
- VS Code перезагружен

**Q: Как узнать ID ученика для запроса?**
A: Используйте GET /api/v1/students и найдите по имени

**Q: Можно ли автоматизировать отчёты?**
A: Да, через планировщик задач + curl + скрипты

**Q: Как импортировать данные из Excel?**
A: NocoBase имеет встроенный импортер (Ctrl+E в таблице)

---

## 📞 Поддержка

Если вам нужна помощь:
1. Используйте MCP через @mcp nocobase в Copilot Chat
2. Проверьте http://localhost:13000/admin логи
3. Посетите https://docs.nocbase.com

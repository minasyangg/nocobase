 Pipeline для AI-агента: Разработка образовательной платформы на NocoBase
📌 Цель проекта
Разработать AI-ориентированную образовательную платформу как кастомный плагин для NocoBase 2.0+, включающий полный цикл: создание курсов, управление уроками, сдачу и проверку заданий для ролей Учитель и Ученик.

🎯 Критерии успеха
Все данные хранятся в коллекциях NocoBase (не в UI Schema)

Полный цикл "Учитель создает → Ученик сдает → Учитель проверяет" работает

Интерфейс соответствует дизайну: левая панель навигации + основной контент

Используются только стандартные блоки NocoBase

Права доступа настроены корректно

📁 ШАГ 1: Подготовка окружения
1.2 Создание структуры плагина
bash
# Создаем папку плагина
mkdir -p plugins/education-platform/src/{server,collections,actions,client}

# Создаем package.json плагина
cat > plugins/education-platform/package.json << EOF
{
  "name": "@nocobase/plugin-education-platform",
  "version": "0.1.0",
  "main": "dist/server/index.js",
  "devDependencies": {
    "@nocobase/client": "2.x",
    "@nocobase/server": "2.x"
  },
  "peerDependencies": {
    "@nocobase/client": "2.x",
    "@nocobase/server": "2.x"
  }
}
EOF
📊 ШАГ 2: Создание коллекций (СУЩНОСТЕЙ)
2.1 Основные коллекции (создать в порядке зависимостей)
Файл: plugins/education-platform/src/server/collections/courses.ts

typescript
import { CollectionOptions } from '@nocobase/database';

export default {
  name: 'courses',
  title: 'Курсы',
  fields: [
    {
      type: 'string',
      name: 'title',
      title: 'Название курса',
      required: true
    },
    {
      type: 'text',
      name: 'description',
      title: 'Описание'
    },
    {
      type: 'belongsTo',
      name: 'teacher',
      target: 'users',
      foreignKey: 'teacherId',
      title: 'Преподаватель'
    },
    {
      type: 'hasMany',
      name: 'lessons',
      target: 'lessons',
      foreignKey: 'courseId',
      title: 'Уроки курса'
    }
  ]
} as CollectionOptions;
Файл: plugins/education-platform/src/server/collections/lessons.ts

typescript
import { CollectionOptions } from '@nocobase/database';

export default {
  name: 'lessons',
  title: 'Уроки',
  fields: [
    {
      type: 'string',
      name: 'title',
      title: 'Название урока',
      required: true
    },
    {
      type: 'text',
      name: 'description',
      title: 'Описание'
    },
    {
      type: 'integer',
      name: 'lessonNumber',
      title: 'Номер урока',
      required: true
    },
    {
      type: 'belongsTo',
      name: 'course',
      target: 'courses',
      foreignKey: 'courseId',
      title: 'Курс',
      required: true
    },
    {
      type: 'belongsToMany',
      name: 'assignedStudents',
      target: 'student_profiles',
      through: 'lessons_assigned_students',
      title: 'Прикрепленные студенты'
    },
    {
      type: 'hasMany',
      name: 'assignments',
      target: 'assignments',
      foreignKey: 'lessonId',
      title: 'Задания урока'
    },
    {
      type: 'attachment',
      name: 'attachments',
      title: 'Прикрепленные файлы',
      multiple: true
    }
  ]
} as CollectionOptions;
Файл: plugins/education-platform/src/server/collections/grades.ts (КЛЮЧЕВАЯ)

typescript
import { CollectionOptions } from '@nocobase/database';

export default {
  name: 'grades',
  title: 'Оценки',
  fields: [
    {
      type: 'float',
      name: 'score',
      title: 'Баллы'
    },
    {
      type: 'text',
      name: 'teacherComment',
      title: 'Комментарий преподавателя'
    },
    {
      type: 'attachment',
      name: 'submittedWork',
      title: 'Сданная работа',
      multiple: true
    },
    {
      type: 'datetime',
      name: 'submittedAt',
      title: 'Дата и время сдачи'
    },
    {
      type: 'datetime',
      name: 'gradedAt',
      title: 'Дата и время проверки'
    },
    // ⚠️ ВАЖНО: Формула для статуса
    {
      type: 'formula',
      name: 'status',
      title: 'Статус',
      dataType: 'string',
      expression: `
        if(this.score != null && this.score != '') {
          return 'checked';
        } else if(this.submittedWork != null && this.submittedWork.length > 0) {
          return 'submitted';
        } else if(this.assignment?.deadline < new Date()) {
          return 'overdue';
        } else {
          return 'pending';
        }
      `
    },
    // Связи
    {
      type: 'belongsTo',
      name: 'assignment',
      target: 'assignments',
      foreignKey: 'assignmentId',
      title: 'Задание',
      required: true
    },
    {
      type: 'belongsTo',
      name: 'student',
      target: 'student_profiles',
      foreignKey: 'studentId',
      title: 'Студент',
      required: true
    },
    {
      type: 'belongsTo',
      name: 'teacher',
      target: 'teacher_profiles',
      foreignKey: 'teacherId',
      title: 'Проверивший преподаватель'
    }
  ]
} as CollectionOptions;
2.2 Полный список коллекций для создания (в порядке приоритета):
courses.ts - Курсы

lessons.ts - Уроки

assignments.ts - Задания

grades.ts - Оценки (самая важная!)

student_profiles.ts - Профили учеников

teacher_profiles.ts - Профили учителей

parent_profiles.ts - Профили родителей

classes.ts - Классы

taxonomies.ts - Справочники

ai_agents.ts - AI-помощники (задел)

ai_agent_profiles.ts - Профили AI (задел)

statistics.ts - Статистика

notifications.ts - Уведомления

🧩 ШАГ 3: Регистрация плагина
Файл: plugins/education-platform/src/server/index.ts

typescript
import { Plugin } from '@nocobase/server';
import path from 'path';

// Импорты коллекций
import courses from './collections/courses';
import lessons from './collections/lessons';
import grades from './collections/grades';
import assignments from './collections/assignments';
import studentProfiles from './collections/student_profiles';
import teacherProfiles from './collections/teacher_profiles';

export class EducationPlatformPlugin extends Plugin {
  async load() {
    // Загружаем все коллекции
    this.db.collection(courses);
    this.db.col
не нужно писать здесь сделай мне файл
markdown:EDUCATION_PLATFORM_PIPELINE.md
# 🚀 Pipeline для AI-агента: Разработка плагина NocoBase

## 📌 ЦЕЛЬ ПРОЕКТА
Создать образовательную платформу как плагин для NocoBase 2.0+ с полным циклом: учитель создает курсы/уроки → ученик сдает задания → учитель проверяет.

## 🎯 КРИТЕРИИ УСПЕХА (чеклист)
- [ ] Все 15 коллекций созданы в правильном порядке зависимостей
- [ ] Формула `status` в `grades` работает корректно
- [ ] Страница учителя: `/courses/:id` с уроками в Sub-table
- [ ] Страница ученика: `/student/courses/:id` с левой навигацией
- [ ] Modal сдачи работы для ученика работает
- [ ] Modal проверки для учителя работает
- [ ] Права доступа настроены (teacher, student, parent)

## 📁 ШАГ 1: ПОДГОТОВКА ПЛАГИНА

### 1.1 Структура файлов
plugins/education-platform/
├── package.json
├── src/
│ ├── server/
│ │ ├── collections/ # 15 файлов .ts
│ │ │ ├── 01_courses.ts
│ │ │ ├── 02_lessons.ts
│ │ │ ├── 03_grades.ts # КЛЮЧЕВОЙ
│ │ │ ├── 04_assignments.ts
│ │ │ ├── 05_student_profiles.ts
│ │ │ ├── 06_teacher_profiles.ts
│ │ │ ├── 07_parent_profiles.ts
│ │ │ ├── 08_classes.ts
│ │ │ ├── 09_taxonomies.ts
│ │ │ ├── 10_ai_agents.ts
│ │ │ ├── 11_ai_agent_profiles.ts
│ │ │ ├── 12_ai_memories.ts
│ │ │ ├── 13_ai_reviews.ts
│ │ │ ├── 14_statistics.ts
│ │ │ └── 15_notifications.ts
│ │ ├── actions/ # Кастомные действия
│ │ │ ├── cascade-delete-course.ts
│ │ │ └── submit-assignment.ts
│ │ └── index.ts # Регистрация
│ └── client/
│ ├── teacher/ # UI Schema учителя
│ ├── student/ # UI Schema ученика
│ └── index.ts
└── .env.example

text

### 1.2 package.json плагина
```json
{
  "name": "@nocobase/plugin-education-platform",
  "version": "0.1.0",
  "main": "dist/server/index.js",
  "devDependencies": {
    "@nocobase/client": "2.x",
    "@nocobase/server": "2.x"
  },
  "peerDependencies": {
    "@nocobase/client": "2.x",
    "@nocobase/server": "2.x"
  }
}
📊 ШАГ 2: СОЗДАНИЕ КОЛЛЕКЦИЙ (ПОРЯДОК ВАЖЕН!)
2.1 Ключевые моменты для ВСЕХ коллекций
Имена полей точно как в архитектуре: assignedStudents, не attachedStudents

Типы связей: belongsTo, hasMany, belongsToMany

Обязательные поля: required: true где нужно

Формулы: Только в grades.status и statistics

2.2 grades.ts - САМЫЙ ВАЖНЫЙ ФАЙЛ
typescript
// plugins/education-platform/src/server/collections/03_grades.ts
import { CollectionOptions } from '@nocobase/database';

export default {
  name: 'grades',
  title: 'Оценки',
  fields: [
    // Поля данных
    { type: 'float', name: 'score', title: 'Баллы' },
    { type: 'text', name: 'teacherComment', title: 'Комментарий преподавателя' },
    { type: 'attachment', name: 'submittedWork', title: 'Сданная работа', multiple: true },
    { type: 'datetime', name: 'submittedAt', title: 'Дата сдачи' },
    { type: 'datetime', name: 'gradedAt', title: 'Дата проверки' },
    
    // ⚠️ КРИТИЧЕСКИ ВАЖНАЯ ФОРМУЛА
    {
      type: 'formula',
      name: 'status',
      title: 'Статус',
      dataType: 'string',
      expression: `
        if(this.score != null) {
          return 'checked';
        } else if(this.submittedWork && this.submittedWork.length > 0) {
          return 'submitted';
        } else if(this.assignment?.deadline < new Date()) {
          return 'overdue';
        } else {
          return 'pending';
        }
      `
    },
    
    // Связи (проверить имена!)
    { 
      type: 'belongsTo', 
      name: 'assignment', 
      target: 'assignments', 
      foreignKey: 'assignmentId',
      required: true 
    },
    { 
      type: 'belongsTo', 
      name: 'student', 
      target: 'student_profiles',  // не 'users'!
      foreignKey: 'studentId',
      required: true 
    },
    { 
      type: 'belongsTo', 
      name: 'teacher', 
      target: 'teacher_profiles',  // не 'users'!
      foreignKey: 'teacherId' 
    }
  ]
} as CollectionOptions;
2.3 Порядок создания коллекций (обязательно!)
taxonomies.ts - справочники (самостоятельная)

student_profiles.ts, teacher_profiles.ts, parent_profiles.ts - профили

courses.ts - курсы

lessons.ts - уроки (зависит от courses)

assignments.ts - задания (зависит от lessons)

grades.ts - оценки (зависит от assignments и student_profiles)

classes.ts - классы

Остальные коллекции

🔧 ШАГ 3: МИГРАЦИИ БАЗЫ ДАННЫХ
3.1 Команды (выполнять по порядку)
bash
# В папке nocobase
cd plugins/education-platform

# 1. Создать миграцию
yarn nocobase db:create --plugin education-platform

# 2. Применить миграцию
yarn nocobase db:migrate

# 3. Проверить таблицы
yarn nocobase db:check education-platform
3.2 Проверка создания
После миграции проверить:

bash
# API должен возвращать пустой массив
curl http://localhost:13000/api/courses:list
curl http://localhost:13000/api/grades:list
🎨 ШАГ 4: UI SCHEMA ДЛЯ УЧИТЕЛЯ
4.1 Страница создания курса с уроками
Требования:

Форма курса + Sub-table для уроков

Валидация: минимум 1 урок

Сохранение одной транзакцией

Файл: plugins/education-platform/src/client/teacher/CourseCreatePage.ts

4.2 Страница проверки работ
Требования:

Таблица grades с фильтром: status: 'submitted'

Кнопка "Проверить" → Modal с 2 колонками

Правая колонка: поля score, teacherComment

Файл: plugins/education-platform/src/client/teacher/GradingPage.ts

🎨 ШАГ 5: UI SCHEMA ДЛЯ УЧЕНИКА
5.1 Личный кабинет (главная)
Требования:

Карточки статистики: курсы, задания, средний балл

Таблица "Мои курсы" с переходом на курс

Файл: plugins/education-platform/src/client/student/DashboardPage.ts

5.2 Страница курса ученика
Требования:

Левая панель: Table с уроками (кликабельные строки)

Правая область: Tabs ("Урок", "Задания")

При клике на урок → загружается контент урока

При клике на задание → Modal сдачи/просмотра

Файл: plugins/education-platform/src/client/student/CourseDetailPage.ts

⚙️ ШАГ 6: КАСТОМНЫЕ ДЕЙСТВИЯ (ACTIONS)
6.1 Безопасное удаление курса
typescript
// cascade-delete-course.ts
export default {
  name: 'cascade-delete-course',
  async execute(ctx) {
    const courseId = ctx.action.params.values?.id;
    
    // 1. Проверить, есть ли уроки
    const lessonCount = await ctx.db.getRepository('lessons').count({
      filter: { courseId }
    });
    
    if (lessonCount > 0) {
      throw new Error('Нельзя удалить курс с уроками. Сначала удалите все уроки.');
    }
    
    // 2. Удалить курс
    await ctx.db.getRepository('courses').destroy(courseId);
    
    return { success: true };
  }
};
6.2 Автоматическое создание записей grades
При публикации задания создавать grades для всех прикрепленных студентов.

🔐 ШАГ 7: ПРАВА ДОСТУПА (ACL)
7.1 Роли и разрешения
typescript
// В server/index.ts после загрузки коллекций
app.acl.define({
  role: 'teacher',
  actions: {
    'courses:*': { own: true },    // Только свои курсы
    'lessons:*': { own: true },    // Только свои уроки
    'grades:update': true,         // Может проверять
    'student_profiles:view': true  // Видеть студентов
  }
});

app.acl.define({
  role: 'student',
  actions: {
    'courses:view': { filter: { 'lessons.assignedStudents.id': '$user.id' } },
    'grades:view': { own: true },     // Только свои
    'grades:update': { own: true },   // Только сдачу работы
    'grades:create': false            // Не может создавать
  }
});
🧪 ШАГ 8: ТЕСТИРОВАНИЕ
8.1 Тест-кейсы (проверить вручную)
Создание курса учителем

С уроками → успех

Без уроков → ошибка валидации

Сдача работы учеником

Статус меняется pending → submitted

Поле submittedAt заполняется

Проверка учителем

Таблица показывает работы со статусом submitted

После оценки статус submitted → checked

Поле gradedAt заполняется

Просмотр оценки учеником

Для checked видит кнопку "Посмотреть оценку"

Modal показывает score и teacherComment

Безопасное удаление

Курс с уроками → ошибка

Курс без уроков → успех

🚨 ЧАСТЫЕ ОШИБКИ И РЕШЕНИЯ
Ошибка 1: "Collection not found"
Причина: Неправильный порядок создания коллекций
Решение: Создавать в порядке зависимостей (см. п.2.3)

Ошибка 2: Формула status не работает
Причина: Неправильный синтаксис
Решение: Использовать точную формулу из п.2.2

Ошибка 3: Связи не отображаются
Причина: Ошибка в именах target
Решение: student_profiles а не users

Ошибка 4: Нет доступа к API
Причина: ACL не настроен
Решение: Настроить права как в п.7

📈 ШАГ 9: ЗАПУСК И ПРОВЕРКА
9.1 Запуск в development
bash
# В корневой папке nocobase
yarn dev

# Открыть в браузере
open http://localhost:13000
9.2 Проверка API (через curl или Postman)
bash
# 1. Создать пользователя-учителя
POST /api/users:create
{
  "username": "teacher1",
  "password": "123456",
  "roles": ["teacher"]
}

# 2. Создать курс
POST /api/courses:create
{
  "title": "Тестовый курс",
  "teacherId": 1,
  "lessons": [{
    "title": "Урок 1",
    "lessonNumber": 1
  }]
}

# 3. Проверить, что курс создан
GET /api/courses:list
📦 ШАГ 10: ПРОДАКШЕН
10.1 Сборка плагина
bash
yarn build

# Проверить dist/
ls -la dist/server/
10.2 Деплой
Скопировать папку plugins/education-platform на сервер

Включить плагин в настройках NocoBase

Запустить миграции на продакшен-БД

📞 КОНТАКТЫ И ЭСКАЛАЦИЯ
Если AI-агент не справляется:

Проверить логи: tail -f storage/logs/nocobase.log

Проверить миграции: yarn nocobase db:check

Открыть issue с описанием ошибки и логами

🎯 ФИНАЛЬНЫЙ ЧЕКЛИСТ ДЛЯ AI-АГЕНТА
ФАЗА 1: КОЛЛЕКЦИИ (3-4 часа)
15 файлов коллекций созданы в папке collections/

grades.ts содержит правильную формулу status

Все связи корректны (belongsTo, hasMany, belongsToMany)

Миграции применены без ошибок

API возвращает данные: /api/courses:list, /api/grades:list

ФАЗА 2: UI SCHEMA (4-5 часов)
Страница учителя: создание курса с Sub-table уроков

Страница учителя: проверка работ (таблица + Modal)

Страница ученика: Dashboard с карточками

Страница ученика: детали курса (левая навигация + Tabs)

Modal сдачи работы для ученика

Modal просмотра оценки для ученика

ФАЗА 3: ЛОГИКА (2-3 часа)
Кастомное действие: безопасное удаление курса

ACL: права для teacher, student, parent

Триггер: автоматическое заполнение submittedAt

Триггер: автоматическое заполнение gradedAt

ФАЗА 4: ТЕСТИРОВАНИЕ (1-2 часа)
Создание курса → успех

Сдача работы → статус меняется

Проверка работы → оценка сохраняется

Просмотр оценки → данные отображаются

Удаление курса с уроками → ошибка

Удаление пустого курса → успех

СТАТУС: READY_FOR_AI_AGENT
ПРИОРИТЕТ: Сначала коллекции, потом UI, потом логика
ОЖИДАЕМОЕ ВРЕМЯ: 10-14 часов разработки
СЛОЖНОСТЬ: Средняя (требует знания TypeScript и NocoBase API)
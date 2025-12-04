#!/usr/bin/env node
/**
 * Инициализация системы отслеживания учебного процесса в NocoBase
 * Создаёт все необходимые таблицы, поля и связи для управления:
 * - Учениками (разные классы и типы обучения)
 * - Предметами
 * - Занятиями/уроками
 * - Домашними заданиями
 * - Оценками и результатами
 */

import { APIClient } from '@nocobase/sdk';

// Инициализация клиента
const client = new APIClient({
  baseURL: process.env.NOCOBASE_URL || 'http://localhost:13000/api',
});

// Токен для аутентификации
const token = process.env.NOCOBASE_TOKEN || '';
if (token) {
  client.auth.token = token;
}

// Интерфейсы типов
interface FieldConfig {
  name: string;
  type: string;
  required?: boolean;
  unique?: boolean;
  defaultValue?: any;
  interface?: string;
  // Для связей
  target?: string;
  foreignKey?: string;
  // Для селектов
  options?: Array<{ label: string; value: string }>;
  // Для числовых полей
  min?: number;
  max?: number;
  precision?: number;
}

interface CollectionConfig {
  name: string;
  displayName: string;
  description?: string;
  fields: FieldConfig[];
}

// Конфигурация коллекций
const collections: CollectionConfig[] = [
  {
    name: 'subjects',
    displayName: 'Предметы',
    description: 'Список преподаваемых предметов',
    fields: [
      {
        name: 'name',
        type: 'string',
        required: true,
        unique: true,
        interface: 'input',
      },
      {
        name: 'description',
        type: 'text',
        interface: 'textarea',
      },
      {
        name: 'color',
        type: 'string',
        interface: 'color',
        defaultValue: '#1890ff',
      },
      {
        name: 'icon',
        type: 'string',
        interface: 'input',
        defaultValue: '📚',
      },
    ],
  },
  {
    name: 'classes',
    displayName: 'Классы',
    description: 'Школьные классы (7А, 8Б и т.д.)',
    fields: [
      {
        name: 'name',
        type: 'string',
        required: true,
        unique: true,
        interface: 'input',
      },
      {
        name: 'year',
        type: 'integer',
        interface: 'number',
        min: 1,
        max: 11,
      },
      {
        name: 'letter',
        type: 'string',
        interface: 'input',
      },
      {
        name: 'description',
        type: 'text',
        interface: 'textarea',
      },
    ],
  },
  {
    name: 'students',
    displayName: 'Учащиеся',
    description: 'Список всех учащихся (школьники и частные ученики)',
    fields: [
      {
        name: 'firstName',
        type: 'string',
        required: true,
        interface: 'input',
      },
      {
        name: 'lastName',
        type: 'string',
        required: true,
        interface: 'input',
      },
      {
        name: 'middleName',
        type: 'string',
        interface: 'input',
      },
      {
        name: 'email',
        type: 'string',
        interface: 'input',
      },
      {
        name: 'phone',
        type: 'string',
        interface: 'input',
      },
      {
        name: 'class',
        type: 'belongsTo',
        target: 'classes',
        interface: 'linkTo',
      },
      {
        name: 'studentType',
        type: 'string',
        interface: 'select',
        options: [
          { label: 'Школьник 7 класс', value: 'school_7' },
          { label: 'Школьник 8 класс', value: 'school_8' },
          { label: 'Частный ученик', value: 'private' },
        ],
      },
      {
        name: 'notes',
        type: 'text',
        interface: 'textarea',
      },
    ],
  },
  {
    name: 'lessons',
    displayName: 'Занятия / Уроки',
    description: 'Проведённые и планируемые уроки и занятия',
    fields: [
      {
        name: 'date',
        type: 'date',
        required: true,
        interface: 'date',
      },
      {
        name: 'startTime',
        type: 'time',
        required: true,
        interface: 'time',
      },
      {
        name: 'endTime',
        type: 'time',
        interface: 'time',
      },
      {
        name: 'subject',
        type: 'belongsTo',
        target: 'subjects',
        required: true,
        interface: 'linkTo',
      },
      {
        name: 'student',
        type: 'belongsTo',
        target: 'students',
        interface: 'linkTo',
      },
      {
        name: 'lessonType',
        type: 'string',
        interface: 'select',
        options: [
          { label: 'Обычный урок', value: 'regular' },
          { label: 'Консультация', value: 'consultation' },
          { label: 'Тестирование', value: 'test' },
          { label: 'Контрольная', value: 'control' },
        ],
      },
      {
        name: 'status',
        type: 'string',
        interface: 'select',
        defaultValue: 'planned',
        options: [
          { label: 'Запланировано', value: 'planned' },
          { label: 'Проведено', value: 'completed' },
          { label: 'Отменено', value: 'cancelled' },
          { label: 'Перенесено', value: 'postponed' },
        ],
      },
      {
        name: 'topic',
        type: 'string',
        interface: 'input',
      },
      {
        name: 'description',
        type: 'text',
        interface: 'textarea',
      },
      {
        name: 'notes',
        type: 'text',
        interface: 'textarea',
      },
    ],
  },
  {
    name: 'homeworks',
    displayName: 'Домашние задания (ДЗ)',
    description: 'Выданные домашние задания',
    fields: [
      {
        name: 'title',
        type: 'string',
        required: true,
        interface: 'input',
      },
      {
        name: 'description',
        type: 'text',
        required: true,
        interface: 'textarea',
      },
      {
        name: 'subject',
        type: 'belongsTo',
        target: 'subjects',
        required: true,
        interface: 'linkTo',
      },
      {
        name: 'givenDate',
        type: 'date',
        required: true,
        interface: 'date',
      },
      {
        name: 'dueDate',
        type: 'date',
        required: true,
        interface: 'date',
      },
      {
        name: 'difficulty',
        type: 'string',
        interface: 'select',
        options: [
          { label: 'Лёгкое', value: 'easy' },
          { label: 'Среднее', value: 'medium' },
          { label: 'Сложное', value: 'hard' },
        ],
      },
      {
        name: 'maxPoints',
        type: 'integer',
        interface: 'number',
        defaultValue: 10,
      },
      {
        name: 'notes',
        type: 'text',
        interface: 'textarea',
      },
    ],
  },
  {
    name: 'homework_submissions',
    displayName: 'Выполнение ДЗ',
    description: 'Отслеживание выполнения домашних заданий учащимися',
    fields: [
      {
        name: 'homework',
        type: 'belongsTo',
        target: 'homeworks',
        required: true,
        interface: 'linkTo',
      },
      {
        name: 'student',
        type: 'belongsTo',
        target: 'students',
        required: true,
        interface: 'linkTo',
      },
      {
        name: 'status',
        type: 'string',
        interface: 'select',
        defaultValue: 'not_started',
        options: [
          { label: 'Не начато', value: 'not_started' },
          { label: 'В процессе', value: 'in_progress' },
          { label: 'Сдано', value: 'submitted' },
          { label: 'Проверено', value: 'reviewed' },
          { label: 'Не сдано', value: 'not_submitted' },
        ],
      },
      {
        name: 'submittedDate',
        type: 'date',
        interface: 'date',
      },
      {
        name: 'points',
        type: 'integer',
        interface: 'number',
        min: 0,
      },
      {
        name: 'grade',
        type: 'string',
        interface: 'select',
        options: [
          { label: '5 (отлично)', value: '5' },
          { label: '4 (хорошо)', value: '4' },
          { label: '3 (удовлетворительно)', value: '3' },
          { label: '2 (неудовлетворительно)', value: '2' },
        ],
      },
      {
        name: 'feedback',
        type: 'text',
        interface: 'textarea',
      },
      {
        name: 'teacherNotes',
        type: 'text',
        interface: 'textarea',
      },
    ],
  },
  {
    name: 'assessments',
    displayName: 'Оценки и контрольные',
    description: 'Результаты тестов, контрольных работ и других оценивающих мероприятий',
    fields: [
      {
        name: 'date',
        type: 'date',
        required: true,
        interface: 'date',
      },
      {
        name: 'subject',
        type: 'belongsTo',
        target: 'subjects',
        required: true,
        interface: 'linkTo',
      },
      {
        name: 'assessmentType',
        type: 'string',
        interface: 'select',
        options: [
          { label: 'Тест', value: 'test' },
          { label: 'Контрольная работа', value: 'control_work' },
          { label: 'Самостоятельная работа', value: 'independent_work' },
          { label: 'Диктант', value: 'dictation' },
          { label: 'Практическая работа', value: 'practical_work' },
          { label: 'Промежуточный', value: 'interim' },
        ],
      },
      {
        name: 'topic',
        type: 'string',
        interface: 'input',
      },
      {
        name: 'maxPoints',
        type: 'integer',
        required: true,
        interface: 'number',
        defaultValue: 100,
      },
      {
        name: 'description',
        type: 'text',
        interface: 'textarea',
      },
    ],
  },
  {
    name: 'assessment_results',
    displayName: 'Результаты оценок',
    description: 'Оценки студентов за контрольные работы и тесты',
    fields: [
      {
        name: 'assessment',
        type: 'belongsTo',
        target: 'assessments',
        required: true,
        interface: 'linkTo',
      },
      {
        name: 'student',
        type: 'belongsTo',
        target: 'students',
        required: true,
        interface: 'linkTo',
      },
      {
        name: 'points',
        type: 'integer',
        required: true,
        interface: 'number',
        min: 0,
      },
      {
        name: 'percentage',
        type: 'integer',
        interface: 'number',
        min: 0,
        max: 100,
      },
      {
        name: 'grade',
        type: 'string',
        interface: 'select',
        options: [
          { label: '5 (отлично)', value: '5' },
          { label: '4 (хорошо)', value: '4' },
          { label: '3 (удовлетворительно)', value: '3' },
          { label: '2 (неудовлетворительно)', value: '2' },
        ],
      },
      {
        name: 'feedback',
        type: 'text',
        interface: 'textarea',
      },
    ],
  },
  {
    name: 'attendance',
    displayName: 'Посещаемость',
    description: 'Отслеживание посещаемости занятий',
    fields: [
      {
        name: 'lesson',
        type: 'belongsTo',
        target: 'lessons',
        required: true,
        interface: 'linkTo',
      },
      {
        name: 'student',
        type: 'belongsTo',
        target: 'students',
        required: true,
        interface: 'linkTo',
      },
      {
        name: 'status',
        type: 'string',
        interface: 'select',
        defaultValue: 'present',
        options: [
          { label: 'Присутствовал', value: 'present' },
          { label: 'Отсутствовал по уважительной причине', value: 'absent_justified' },
          { label: 'Отсутствовал без причины', value: 'absent_unjustified' },
          { label: 'Опоздал', value: 'late' },
        ],
      },
      {
        name: 'notes',
        type: 'text',
        interface: 'textarea',
      },
    ],
  },
  {
    name: 'reports',
    displayName: 'Отчёты для родителей',
    description: 'Периодические отчёты по успеваемости',
    fields: [
      {
        name: 'period',
        type: 'string',
        required: true,
        interface: 'input',
      },
      {
        name: 'student',
        type: 'belongsTo',
        target: 'students',
        required: true,
        interface: 'linkTo',
      },
      {
        name: 'subject',
        type: 'belongsTo',
        target: 'subjects',
        interface: 'linkTo',
      },
      {
        name: 'averageGrade',
        type: 'decimal',
        interface: 'number',
        precision: 2,
      },
      {
        name: 'lessonsAttended',
        type: 'integer',
        interface: 'number',
      },
      {
        name: 'lessonsTotal',
        type: 'integer',
        interface: 'number',
      },
      {
        name: 'homeworkCompleted',
        type: 'integer',
        interface: 'number',
      },
      {
        name: 'homeworkTotal',
        type: 'integer',
        interface: 'number',
      },
      {
        name: 'strengths',
        type: 'text',
        interface: 'textarea',
      },
      {
        name: 'areas_for_improvement',
        type: 'text',
        interface: 'textarea',
      },
      {
        name: 'recommendations',
        type: 'text',
        interface: 'textarea',
      },
      {
        name: 'generatedDate',
        type: 'date',
        interface: 'date',
      },
    ],
  },
];

/**
 * Создание коллекций и полей
 */
async function initializeDatabase() {
  console.log('🚀 Начинаем инициализацию системы отслеживания учебного процесса...\n');

  try {
    // Создаём коллекции
    for (const collectionConfig of collections) {
      console.log(`📋 Создание коллекции: "${collectionConfig.displayName}" (${collectionConfig.name})...`);

      try {
        // Проверяем, существует ли коллекция
        const existing = await client.resource('collections').list({
          filter: {
            name: collectionConfig.name,
          },
        });

        if (existing.data && existing.data.length > 0) {
          console.log(`   ⏭️  Коллекция уже существует, пропускаем...`);
          continue;
        }

        // Создаём коллекцию
        const collection = await client.resource('collections').create({
          values: {
            name: collectionConfig.name,
            title: collectionConfig.displayName,
            description: collectionConfig.description || '',
          },
        });

        console.log(`   ✅ Коллекция создана (ID: ${collection.data.id})`);

        // Создаём поля для коллекции
        console.log(`   📌 Создание полей...`);
        for (const field of collectionConfig.fields) {
          const fieldData: any = {
            name: field.name,
            type: field.type,
            title: field.name,
            interface: field.interface || 'input',
          };

          // Добавляем опциональные поля
          if (field.required) fieldData.required = true;
          if (field.unique) fieldData.unique = true;
          if (field.defaultValue !== undefined) fieldData.defaultValue = field.defaultValue;
          if (field.target) fieldData.target = field.target;
          if (field.options) fieldData.options = field.options;
          if (field.min !== undefined) fieldData.min = field.min;
          if (field.max !== undefined) fieldData.max = field.max;
          if (field.precision !== undefined) fieldData.precision = field.precision;

          try {
            await client.resource('fields').create({
              values: {
                ...fieldData,
                collectionName: collectionConfig.name,
              },
            });
            console.log(`      ✓ Поле "${field.name}" создано`);
          } catch (err: any) {
            if (err.response?.status === 400 && err.response?.data?.message?.includes('already exists')) {
              console.log(`      ⏭️  Поле "${field.name}" уже существует`);
            } else {
              console.log(`      ❌ Ошибка создания поля "${field.name}":`, err.message);
            }
          }
        }

        console.log(`   🎉 Коллекция готова!\n`);
      } catch (err: any) {
        console.error(`   ❌ Ошибка при создании коллекции:`, err.message);
        console.error(err.response?.data);
      }
    }

    console.log('\n✨ Инициализация завершена!\n');
    console.log('📊 Созданные таблицы:');
    collections.forEach((c) => {
      console.log(`  • ${c.displayName} (${c.name})`);
    });

    console.log('\n💡 Дальше вы можете начать добавлять данные в эти таблицы через NocoBase интерфейс или API!');
  } catch (err) {
    console.error('❌ Критическая ошибка:', err);
    process.exit(1);
  }
}

// Запуск
initializeDatabase();

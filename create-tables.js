#!/usr/bin/env node
/**
 * Скрипт для создания таблиц системы отслеживания через REST API NocoBase
 *
 * Использование:
 * node create-tables.js <URL> <TOKEN>
 *
 * Пример:
 * node create-tables.js http://localhost:13000 "eyJhbGci..."
 */

const http = require('http');
const https = require('https');
const url = require('url');

const baseURL = process.argv[2] || 'http://localhost:13000';
const token = process.argv[3];

if (!token) {
  console.error('❌ Ошибка: требуется токен авторизации');
  console.error('Использование: node create-tables.js <URL> <TOKEN>');
  process.exit(1);
}

function makeRequest(method, path, data = null) {
  return new Promise((resolve, reject) => {
    const urlObj = new url.URL(path, baseURL);
    const protocol = urlObj.protocol === 'https:' ? https : http;

    const options = {
      hostname: urlObj.hostname,
      port: urlObj.port,
      path: urlObj.pathname + urlObj.search,
      method: method,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    };

    const req = protocol.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => {
        body += chunk;
      });
      res.on('end', () => {
        try {
          const response = {
            status: res.statusCode,
            data: body ? JSON.parse(body) : null,
          };
          resolve(response);
        } catch (e) {
          resolve({
            status: res.statusCode,
            data: body,
          });
        }
      });
    });

    req.on('error', reject);
    if (data) {
      req.write(JSON.stringify(data));
    }
    req.end();
  });
}

const tablesConfig = [
  {
    name: 'subjects',
    title: 'Предметы',
    fields: [
      { name: 'name', type: 'string', title: 'Название', required: true },
      { name: 'description', type: 'text', title: 'Описание' },
      { name: 'color', type: 'string', title: 'Цвет' },
      { name: 'icon', type: 'string', title: 'Иконка' },
    ],
  },
  {
    name: 'classes',
    title: 'Классы',
    fields: [
      { name: 'name', type: 'string', title: 'Название', required: true },
      { name: 'year', type: 'integer', title: 'Год обучения' },
      { name: 'letter', type: 'string', title: 'Буква' },
      { name: 'description', type: 'text', title: 'Описание' },
    ],
  },
  {
    name: 'students',
    title: 'Учащиеся',
    fields: [
      { name: 'firstName', type: 'string', title: 'Имя', required: true },
      { name: 'lastName', type: 'string', title: 'Фамилия', required: true },
      { name: 'middleName', type: 'string', title: 'Отчество' },
      { name: 'email', type: 'string', title: 'Email' },
      { name: 'phone', type: 'string', title: 'Телефон' },
      { name: 'studentType', type: 'string', title: 'Тип ученика' },
      { name: 'notes', type: 'text', title: 'Заметки' },
    ],
  },
  {
    name: 'lessons',
    title: 'Занятия / Уроки',
    fields: [
      { name: 'date', type: 'date', title: 'Дата', required: true },
      { name: 'startTime', type: 'time', title: 'Время начала', required: true },
      { name: 'endTime', type: 'time', title: 'Время окончания' },
      { name: 'lessonType', type: 'string', title: 'Тип занятия' },
      { name: 'status', type: 'string', title: 'Статус' },
      { name: 'topic', type: 'string', title: 'Тема' },
      { name: 'description', type: 'text', title: 'Описание' },
      { name: 'notes', type: 'text', title: 'Заметки' },
    ],
  },
  {
    name: 'homeworks',
    title: 'Домашние задания',
    fields: [
      { name: 'title', type: 'string', title: 'Название', required: true },
      { name: 'description', type: 'text', title: 'Описание', required: true },
      { name: 'givenDate', type: 'date', title: 'Дата выдачи', required: true },
      { name: 'dueDate', type: 'date', title: 'Срок сдачи', required: true },
      { name: 'difficulty', type: 'string', title: 'Сложность' },
      { name: 'maxPoints', type: 'integer', title: 'Макс. баллов' },
      { name: 'notes', type: 'text', title: 'Заметки' },
    ],
  },
  {
    name: 'homework_submissions',
    title: 'Выполнение ДЗ',
    fields: [
      { name: 'status', type: 'string', title: 'Статус' },
      { name: 'submittedDate', type: 'date', title: 'Дата сдачи' },
      { name: 'points', type: 'integer', title: 'Баллы' },
      { name: 'grade', type: 'string', title: 'Оценка' },
      { name: 'feedback', type: 'text', title: 'Комментарии' },
      { name: 'teacherNotes', type: 'text', title: 'Заметки преподавателя' },
    ],
  },
  {
    name: 'assessments',
    title: 'Контрольные и тесты',
    fields: [
      { name: 'date', type: 'date', title: 'Дата', required: true },
      { name: 'assessmentType', type: 'string', title: 'Тип', required: true },
      { name: 'topic', type: 'string', title: 'Тема' },
      { name: 'maxPoints', type: 'integer', title: 'Макс. баллов', required: true },
      { name: 'description', type: 'text', title: 'Описание' },
    ],
  },
  {
    name: 'assessment_results',
    title: 'Результаты оценок',
    fields: [
      { name: 'points', type: 'integer', title: 'Баллы', required: true },
      { name: 'percentage', type: 'integer', title: 'Процент' },
      { name: 'grade', type: 'string', title: 'Оценка' },
      { name: 'feedback', type: 'text', title: 'Комментарии' },
    ],
  },
  {
    name: 'attendance',
    title: 'Посещаемость',
    fields: [
      { name: 'status', type: 'string', title: 'Статус', required: true },
      { name: 'notes', type: 'text', title: 'Заметки' },
    ],
  },
  {
    name: 'reports',
    title: 'Отчёты для родителей',
    fields: [
      { name: 'period', type: 'string', title: 'Период', required: true },
      { name: 'averageGrade', type: 'decimal', title: 'Средняя оценка' },
      { name: 'lessonsAttended', type: 'integer', title: 'Посещено занятий' },
      { name: 'lessonsTotal', type: 'integer', title: 'Всего занятий' },
      { name: 'homeworkCompleted', type: 'integer', title: 'Выполнено ДЗ' },
      { name: 'homeworkTotal', type: 'integer', title: 'Всего ДЗ' },
      { name: 'strengths', type: 'text', title: 'Сильные стороны' },
      { name: 'areas_for_improvement', type: 'text', title: 'Области для улучшения' },
      { name: 'recommendations', type: 'text', title: 'Рекомендации' },
      { name: 'generatedDate', type: 'date', title: 'Дата создания' },
    ],
  },
];

async function createTables() {
  console.log('🚀 Начинаем создание таблиц...\n');

  for (const tableConfig of tablesConfig) {
    console.log(`📋 Создание таблицы: "${tableConfig.title}" (${tableConfig.name})...`);

    try {
      // Проверяем, существует ли уже таблица
      const listResponse = await makeRequest(
        'GET',
        `${baseURL}/api/v1/db/collections?${new URLSearchParams({ name: tableConfig.name })}`,
      );

      if (listResponse.status === 200 && listResponse.data?.list?.length > 0) {
        console.log(`   ⏭️  Таблица уже существует\n`);
        continue;
      }

      // Создаём таблицу
      const createResponse = await makeRequest('POST', `${baseURL}/api/v1/db/collections`, {
        name: tableConfig.name,
        title: tableConfig.title,
        fields: tableConfig.fields.map((field) => ({
          name: field.name,
          type: field.type,
          title: field.title || field.name,
          required: field.required || false,
        })),
      });

      if (createResponse.status >= 200 && createResponse.status < 300) {
        console.log(`   ✅ Таблица создана!\n`);
      } else {
        console.error(`   ❌ Ошибка (HTTP ${createResponse.status}):`, createResponse.data);
        console.log('');
      }
    } catch (err) {
      console.error(`   ❌ Ошибка:`, err.message);
      console.log('');
    }
  }

  console.log('✨ Готово!');
}

createTables().catch(console.error);

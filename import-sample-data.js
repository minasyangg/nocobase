#!/usr/bin/env node
/**
 * Скрипт для заполнения системы тестовыми данными
 *
 * Использование:
 * node import-sample-data.js
 */

const http = require('http');
const https = require('https');
const url = require('url');
const fs = require('fs');

const baseURL = 'http://localhost:13000';
const token = process.env.NOCOBASE_TOKEN || '';

// Цвета для визуализации
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

function log(msg, color = 'reset') {
  console.log(`${colors[color]}${msg}${colors.reset}`);
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
      },
    };

    if (token) {
      options.headers['Authorization'] = `Bearer ${token}`;
    }

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

async function importData() {
  log('\n🚀 Начинаем импорт тестовых данных...\n', 'bright');

  // Попытаемся получить существующие данные
  log('📋 Проверяем, есть ли уже данные...', 'cyan');

  try {
    // Получим список всех таблиц
    const collectionsResponse = await makeRequest('GET', `${baseURL}/api/v1/db/collections`);

    if (collectionsResponse.status !== 200) {
      log(`⚠️  Не удалось получить список таблиц. Убедитесь, что NocoBase запущен на ${baseURL}`, 'yellow');
      log('Попробуйте запустить: NODE_OPTIONS="--max_old_space_size=6144" npm run dev', 'yellow');
      process.exit(1);
    }

    const collections = collectionsResponse.data?.list || [];
    log(`✅ Найдено таблиц: ${collections.length}\n`, 'green');

    // Проверяем наличие основных таблиц
    const requiredTables = ['subjects', 'students', 'classes'];
    const missingTables = requiredTables.filter((table) => !collections.some((c) => c.name === table));

    if (missingTables.length > 0) {
      log(`⚠️  Отсутствуют таблицы: ${missingTables.join(', ')}`, 'yellow');
      log('Пожалуйста, сначала создайте таблицы используя TEACHER_SYSTEM_SETUP.md', 'yellow');
      process.exit(1);
    }

    // Импортируем данные
    log('📝 Импортируем данные...\n', 'cyan');

    // 1. Предметы
    log('  1. Предметы:', 'bright');
    const subjects = [
      {
        name: 'Математика',
        description: 'Курс математики для 7-8 классов',
        color: '#FF6B6B',
        icon: '📚',
      },
      {
        name: 'Физика',
        description: 'Курс физики для 7-8 классов',
        color: '#4ECDC4',
        icon: '🔬',
      },
      {
        name: 'Вероятность и статистика',
        description: 'Введение в вероятность и статистику',
        color: '#45B7D1',
        icon: '📊',
      },
      {
        name: 'Геометрия',
        description: 'Курс геометрии для 7-8 классов',
        color: '#96CEB4',
        icon: '📐',
      },
    ];

    const subjectIds = {};
    for (const subject of subjects) {
      const response = await makeRequest('POST', `${baseURL}/api/v1/subjects`, subject);
      if (response.status === 200) {
        subjectIds[subject.name] = response.data?.id;
        log(`     ✓ ${subject.name}`, 'green');
      } else {
        log(`     ✗ ${subject.name} (${response.status})`, 'red');
      }
    }

    // 2. Классы
    log('\n  2. Классы:', 'bright');
    const classes = [
      { name: '7А', year: 7, letter: 'А', description: 'Класс 7А' },
      { name: '7Б', year: 7, letter: 'Б', description: 'Класс 7Б' },
      { name: '8А', year: 8, letter: 'А', description: 'Класс 8А' },
      { name: '8Б', year: 8, letter: 'Б', description: 'Класс 8Б' },
    ];

    const classIds = {};
    for (const cls of classes) {
      const response = await makeRequest('POST', `${baseURL}/api/v1/classes`, cls);
      if (response.status === 200) {
        classIds[cls.name] = response.data?.id;
        log(`     ✓ ${cls.name}`, 'green');
      } else {
        log(`     ✗ ${cls.name} (${response.status})`, 'red');
      }
    }

    // 3. Учащиеся
    log('\n  3. Учащиеся:', 'bright');
    const students = [
      {
        firstName: 'Иван',
        lastName: 'Сидоров',
        middleName: 'Петрович',
        email: 'ivan.sidorov@example.com',
        phone: '+7-900-123-4567',
        studentType: 'school_8',
        notes: 'Активный участник',
        // classId: classIds['8А'],
      },
      {
        firstName: 'Мария',
        lastName: 'Петрова',
        middleName: 'Ивановна',
        email: 'maria.petrova@example.com',
        phone: '+7-900-234-5678',
        studentType: 'school_7',
        notes: 'Отличница',
        // classId: classIds['7А'],
      },
      {
        firstName: 'Алексей',
        lastName: 'Иванов',
        middleName: 'Сергеевич',
        email: 'alexey.ivanov@example.com',
        phone: '+7-900-345-6789',
        studentType: 'private',
        notes: 'Частный ученик, выучивает программирование',
      },
      {
        firstName: 'Виктор',
        lastName: 'Смирнов',
        middleName: 'Дмитриевич',
        email: 'viktor.smirnov@example.com',
        phone: '+7-900-456-7890',
        studentType: 'school_8',
        notes: 'Хорошо разбирается в математике',
        // classId: classIds['8Б'],
      },
      {
        firstName: 'Елена',
        lastName: 'Волкова',
        middleName: 'Александровна',
        email: 'elena.volkova@example.com',
        phone: '+7-900-567-8901',
        studentType: 'school_7',
        notes: 'Интересуется физикой',
        // classId: classIds['7Б'],
      },
    ];

    const studentIds = {};
    for (const student of students) {
      const response = await makeRequest('POST', `${baseURL}/api/v1/students`, student);
      if (response.status === 200) {
        studentIds[`${student.firstName} ${student.lastName}`] = response.data?.id;
        log(`     ✓ ${student.firstName} ${student.lastName}`, 'green');
      } else {
        log(`     ✗ ${student.firstName} ${student.lastName} (${response.status})`, 'red');
      }
    }

    // 4. Занятия
    log('\n  4. Занятия:', 'bright');
    const today = new Date();
    const lessons = [
      {
        date: today.toISOString().split('T')[0],
        startTime: '15:00',
        endTime: '16:30',
        subject: 'Математика',
        student: 'Иван Сидоров',
        lessonType: 'regular',
        status: 'completed',
        topic: 'Квадратные уравнения',
        description: 'Повторили формулу дискриминанта',
      },
      {
        date: today.toISOString().split('T')[0],
        startTime: '17:00',
        endTime: '18:00',
        subject: 'Физика',
        student: 'Елена Волкова',
        lessonType: 'regular',
        status: 'completed',
        topic: 'Динамика',
        description: 'Законы Ньютона',
      },
    ];

    for (const lesson of lessons) {
      const response = await makeRequest('POST', `${baseURL}/api/v1/lessons`, lesson);
      if (response.status === 200) {
        log(`     ✓ ${lesson.topic} - ${lesson.student}`, 'green');
      } else {
        log(`     ✗ ${lesson.topic} (${response.status})`, 'red');
      }
    }

    // 5. Домашние задания
    log('\n  5. Домашние задания:', 'bright');
    const tomorrowDate = new Date(today);
    tomorrowDate.setDate(tomorrowDate.getDate() + 1);
    const dueDate = new Date(today);
    dueDate.setDate(dueDate.getDate() + 3);

    const homeworks = [
      {
        title: 'Задачи на движение',
        description: 'Решить задачи 1.1-1.5 из параграфа 1.3',
        subject: 'Математика',
        givenDate: today.toISOString().split('T')[0],
        dueDate: dueDate.toISOString().split('T')[0],
        difficulty: 'medium',
        maxPoints: 10,
      },
      {
        title: 'Практическая работа по электричеству',
        description: 'Выполнить опыты 3.1-3.3 из практикума',
        subject: 'Физика',
        givenDate: today.toISOString().split('T')[0],
        dueDate: dueDate.toISOString().split('T')[0],
        difficulty: 'hard',
        maxPoints: 15,
      },
    ];

    for (const hw of homeworks) {
      const response = await makeRequest('POST', `${baseURL}/api/v1/homeworks`, hw);
      if (response.status === 200) {
        log(`     ✓ ${hw.title}`, 'green');
      } else {
        log(`     ✗ ${hw.title} (${response.status})`, 'red');
      }
    }

    log('\n✨ Импорт завершён!\n', 'bright');
    log('📊 Данные готовы. Откройте http://localhost:13000 чтобы увидеть результаты.', 'cyan');
    log('💡 Теперь вы можете перезагрузить VS Code и начать использовать MCP сервер!\n', 'cyan');
  } catch (err) {
    log(`\n❌ Ошибка: ${err.message}\n`, 'red');
    process.exit(1);
  }
}

importData();

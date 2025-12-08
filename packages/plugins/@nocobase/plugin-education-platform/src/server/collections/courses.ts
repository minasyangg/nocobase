/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */

/**
 * Коллекция курсов
 * Основная образовательная единица - курс включает уроки
 */

import { defineCollection } from '@nocobase/database';

export default defineCollection({
  name: 'courses',
  title: 'Курсы',
  fields: [
    // Основная информация
    {
      type: 'string',
      name: 'title',
      title: 'Название курса',
      required: true,
    },
    {
      type: 'text',
      name: 'description',
      title: 'Описание курса',
    },
    {
      type: 'string',
      name: 'subject',
      title: 'Предмет',
      required: true,
      // Математика, Физика, Геометрия, Вероятность и статистика
    },
    {
      type: 'string',
      name: 'courseCode',
      title: 'Код курса',
      unique: true,
    },

    // Временные рамки
    {
      type: 'date',
      name: 'startDate',
      title: 'Дата начала',
      required: true,
    },
    {
      type: 'date',
      name: 'endDate',
      title: 'Дата окончания',
      required: true,
    },
    {
      type: 'integer',
      name: 'duration',
      title: 'Длительность (недели)',
    },

    // Связи
    {
      type: 'belongsTo',
      name: 'teacher',
      target: 'teacher_profiles',
      foreignKey: 'teacherId',
      title: 'Преподаватель',
      required: true,
    },
    {
      type: 'belongsTo',
      name: 'class',
      target: 'classes',
      foreignKey: 'classId',
      title: 'Класс',
    },
    {
      type: 'hasMany',
      name: 'lessons',
      target: 'lessons',
      foreignKey: 'courseId',
      title: 'Уроки курса',
    },

    // Настройки
    {
      type: 'integer',
      name: 'maxStudents',
      title: 'Максимум студентов',
      defaultValue: 25,
    },
    {
      type: 'boolean',
      name: 'isPublished',
      title: 'Опубликован',
      defaultValue: false,
    },
    {
      type: 'boolean',
      name: 'isActive',
      title: 'Активен',
      defaultValue: true,
    },

    // Метаданные
    {
      type: 'json',
      name: 'tags',
      title: 'Теги',
    },
    // {
    //   type: 'attachment',
    //   name: 'materials',
    //   title: 'Материалы курса',
    //   multiple: true,
    // },
  ],
});

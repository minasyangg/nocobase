/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */

/**
 * Коллекция уроков
 * Каждый урок принадлежит курсу и может иметь задания
 */

import { defineCollection } from '@nocobase/database';

export default defineCollection({
  name: 'lessons',
  title: 'Уроки',
  fields: [
    // Основная информация
    {
      type: 'string',
      name: 'title',
      title: 'Название урока',
      required: true,
    },
    {
      type: 'text',
      name: 'description',
      title: 'Описание урока',
    },
    {
      type: 'integer',
      name: 'lessonNumber',
      title: 'Номер урока',
      required: true,
    },

    // Принадлежность к курсу
    {
      type: 'belongsTo',
      name: 'course',
      target: 'courses',
      foreignKey: 'courseId',
      title: 'Курс',
      required: true,
    },

    // Расписание
    {
      type: 'datetime',
      name: 'scheduledAt',
      title: 'Запланированная дата и время',
    },
    {
      type: 'integer',
      name: 'duration',
      title: 'Длительность (минуты)',
      defaultValue: 45,
    },

    // Содержание урока
    {
      type: 'text',
      name: 'content',
      title: 'Содержание урока',
    },
    {
      type: 'json',
      name: 'learningObjectives',
      title: 'Цели обучения',
    },
    // {
    //   type: 'attachment',
    //   name: 'attachments',
    //   title: 'Прикрепленные файлы',
    //   multiple: true,
    // },

    // Связи с студентами
    {
      type: 'belongsToMany',
      name: 'assignedStudents',
      target: 'student_profiles',
      through: 'lesson_student_assignments',
      title: 'Прикрепленные студенты',
    },

    // Задания урока
    {
      type: 'hasMany',
      name: 'assignments',
      target: 'assignments',
      foreignKey: 'lessonId',
      title: 'Задания урока',
    },

    // Статус и настройки
    {
      type: 'string',
      name: 'status',
      title: 'Статус',
      defaultValue: 'draft',
      // draft, published, completed, cancelled
    },
    {
      type: 'string',
      name: 'lessonType',
      title: 'Тип урока',
      defaultValue: 'regular',
      // regular, test, exam, practical, review
    },
    {
      type: 'boolean',
      name: 'isPublished',
      title: 'Опубликован',
      defaultValue: false,
    },

    // Заметки преподавателя
    {
      type: 'text',
      name: 'teacherNotes',
      title: 'Заметки преподавателя',
    },
  ],
});

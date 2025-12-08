/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */

/**
 * Коллекция заданий
 * Задания создаются к урокам и имеют дедлайны
 */

import { defineCollection } from '@nocobase/database';

export default defineCollection({
  name: 'assignments',
  title: 'Задания',
  fields: [
    // Основная информация
    {
      type: 'string',
      name: 'title',
      title: 'Название задания',
      required: true,
    },
    {
      type: 'text',
      name: 'description',
      title: 'Описание задания',
      required: true,
    },
    {
      type: 'text',
      name: 'instructions',
      title: 'Инструкции по выполнению',
    },

    // Принадлежность к уроку
    {
      type: 'belongsTo',
      name: 'lesson',
      target: 'lessons',
      foreignKey: 'lessonId',
      title: 'Урок',
      required: true,
    },

    // Временные рамки
    {
      type: 'datetime',
      name: 'createdAt',
      title: 'Дата создания',
    },
    {
      type: 'datetime',
      name: 'deadline',
      title: 'Срок сдачи',
      required: true,
    },

    // Оценочные параметры
    {
      type: 'float',
      name: 'maxPoints',
      title: 'Максимальные баллы',
      required: true,
      defaultValue: 100,
    },
    {
      type: 'string',
      name: 'difficultyLevel',
      title: 'Уровень сложности',
      defaultValue: 'medium',
      // easy, medium, hard
    },

    // Тип задания
    {
      type: 'string',
      name: 'assignmentType',
      title: 'Тип задания',
      defaultValue: 'homework',
      // homework, test, project, essay, presentation
    },

    // Файлы и материалы
    // {
    //   type: 'attachment',
    //   name: 'attachments',
    //   title: 'Прикрепленные файлы',
    //   multiple: true,
    // },
    {
      type: 'json',
      name: 'resources',
      title: 'Ресурсы и ссылки',
    },

    // Связи с оценками
    {
      type: 'hasMany',
      name: 'grades',
      target: 'grades',
      foreignKey: 'assignmentId',
      title: 'Оценки по заданию',
    },

    // Настройки
    {
      type: 'boolean',
      name: 'allowLateSubmission',
      title: 'Разрешить поздную сдачу',
      defaultValue: false,
    },
    {
      type: 'integer',
      name: 'maxAttempts',
      title: 'Максимум попыток',
      defaultValue: 1,
    },
    {
      type: 'boolean',
      name: 'isPublished',
      title: 'Опубликовано',
      defaultValue: false,
    },

    // Критерии оценки
    {
      type: 'json',
      name: 'gradingCriteria',
      title: 'Критерии оценивания',
    },
    {
      type: 'text',
      name: 'teacherNotes',
      title: 'Заметки преподавателя',
    },
  ],
});

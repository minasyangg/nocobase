/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */

/**
 * КЛЮЧЕВАЯ КОЛЛЕКЦИЯ: Оценки
 * Содержит критически важную формулу для статуса работы
 */

import { defineCollection } from '@nocobase/database';

export default defineCollection({
  name: 'grades',
  title: 'Оценки',
  fields: [
    // Оценочные данные
    {
      type: 'float',
      name: 'score',
      title: 'Баллы',
    },
    {
      type: 'string',
      name: 'letterGrade',
      title: 'Буквенная оценка',
      // A, B, C, D, F или 5, 4, 3, 2
    },
    {
      type: 'text',
      name: 'teacherComment',
      title: 'Комментарий преподавателя',
    },

    // Сданная работа
    // {
    //   type: 'attachment',
    //   name: 'submittedWork',
    //   title: 'Сданная работа',
    //   multiple: true,
    // },
    {
      type: 'text',
      name: 'submissionNotes',
      title: 'Заметки к сдаче',
    },

    // Временные метки
    {
      type: 'datetime',
      name: 'submittedAt',
      title: 'Дата и время сдачи',
    },
    {
      type: 'datetime',
      name: 'gradedAt',
      title: 'Дата и время проверки',
    },

    // Статус работы (упрощенная версия без формулы для совместимости)
    {
      type: 'string',
      name: 'status',
      title: 'Статус',
      defaultValue: 'pending',
    },

    // Связи (проверить имена согласно архитектуре!)
    {
      type: 'belongsTo',
      name: 'assignment',
      target: 'assignments',
      foreignKey: 'assignmentId',
      title: 'Задание',
      required: true,
    },
    {
      type: 'belongsTo',
      name: 'student',
      target: 'student_profiles', // НЕ 'users'!
      foreignKey: 'studentId',
      title: 'Студент',
      required: true,
    },
    {
      type: 'belongsTo',
      name: 'teacher',
      target: 'teacher_profiles', // НЕ 'users'!
      foreignKey: 'teacherId',
      title: 'Проверивший преподаватель',
    },

    // Дополнительные данные
    {
      type: 'integer',
      name: 'attemptNumber',
      title: 'Номер попытки',
      defaultValue: 1,
    },
    {
      type: 'boolean',
      name: 'isLate',
      title: 'Сдано с опозданием',
      defaultValue: false,
    },
    {
      type: 'json',
      name: 'gradingDetails',
      title: 'Детали оценивания',
    },
  ],
});

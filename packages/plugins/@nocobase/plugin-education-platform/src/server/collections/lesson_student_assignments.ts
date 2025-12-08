/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */

/**
 * Промежуточная таблица для связи уроков и студентов
 * Показывает какие студенты прикреплены к конкретному уроку
 */

import { defineCollection } from '@nocobase/database';

export default defineCollection({
  name: 'lesson_student_assignments',
  title: 'Прикрепление студентов к урокам',
  fields: [
    {
      type: 'belongsTo',
      name: 'lesson',
      target: 'lessons',
      foreignKey: 'lessonId',
      title: 'Урок',
      required: true,
    },
    {
      type: 'belongsTo',
      name: 'student',
      target: 'student_profiles',
      foreignKey: 'studentId',
      title: 'Студент',
      required: true,
    },
    {
      type: 'datetime',
      name: 'assignedAt',
      title: 'Дата прикрепления',
    },
    {
      type: 'string',
      name: 'attendanceStatus',
      title: 'Статус посещения',
      defaultValue: 'unknown',
      // present, absent, late, excused
    },
    {
      type: 'text',
      name: 'notes',
      title: 'Заметки',
    },
  ],
});

/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */

/**
 * Коллекция классов
 * Группировка студентов по классам
 */

import { defineCollection } from '@nocobase/database';

export default defineCollection({
  name: 'classes',
  title: 'Классы',
  fields: [
    {
      type: 'string',
      name: 'name',
      title: 'Название класса',
      required: true,
      // Примеры: "7А", "8Б", "Подготовительный"
    },
    {
      type: 'string',
      name: 'academicYear',
      title: 'Учебный год',
      required: true,
      // Пример: "2024-2025"
    },
    {
      type: 'integer',
      name: 'gradeLevel',
      title: 'Уровень класса',
      // Числовое значение: 7, 8, 9 и т.д.
    },
    {
      type: 'belongsTo',
      name: 'classTeacher',
      target: 'teacher_profiles',
      foreignKey: 'classTeacherId',
      title: 'Классный руководитель',
    },

    // Связи
    {
      type: 'hasMany',
      name: 'students',
      target: 'student_profiles',
      foreignKey: 'classId',
      title: 'Студенты класса',
    },
    {
      type: 'hasMany',
      name: 'courses',
      target: 'courses',
      foreignKey: 'classId',
      title: 'Курсы класса',
    },

    // Дополнительная информация
    {
      type: 'integer',
      name: 'maxStudents',
      title: 'Максимум студентов',
      defaultValue: 30,
    },
    {
      type: 'text',
      name: 'description',
      title: 'Описание',
    },
    {
      type: 'boolean',
      name: 'isActive',
      title: 'Активен',
      defaultValue: true,
    },
  ],
});

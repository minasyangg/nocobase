/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */

/**
 * Коллекция профилей студентов
 * Расширяет базовую таблицу users дополнительной информацией
 */

import { defineCollection } from '@nocobase/database';

export default defineCollection({
  name: 'student_profiles',
  title: 'Профили студентов',
  fields: [
    // Связь с пользователем
    {
      type: 'belongsTo',
      name: 'user',
      target: 'users',
      foreignKey: 'userId',
      title: 'Пользователь',
      required: true,
    },

    // Основная информация
    {
      type: 'string',
      name: 'studentId',
      title: 'ID студента',
      unique: true,
    },
    {
      type: 'date',
      name: 'birthDate',
      title: 'Дата рождения',
    },
    {
      type: 'string',
      name: 'grade',
      title: 'Класс',
    },
    {
      type: 'string',
      name: 'phoneNumber',
      title: 'Телефон',
    },
    {
      type: 'string',
      name: 'address',
      title: 'Адрес',
    },

    // Связи
    {
      type: 'belongsTo',
      name: 'class',
      target: 'classes',
      foreignKey: 'classId',
      title: 'Класс',
    },
    {
      type: 'belongsToMany',
      name: 'parents',
      target: 'parent_profiles',
      through: 'student_parent_relations',
      title: 'Родители',
    },
    {
      type: 'hasMany',
      name: 'grades',
      target: 'grades',
      foreignKey: 'studentId',
      title: 'Оценки студента',
    },

    // Дополнительная информация
    {
      type: 'text',
      name: 'notes',
      title: 'Заметки',
    },
    {
      type: 'boolean',
      name: 'isActive',
      title: 'Активен',
      defaultValue: true,
    },
  ],
});

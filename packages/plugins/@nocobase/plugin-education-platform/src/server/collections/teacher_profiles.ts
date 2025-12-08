/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */

/**
 * Коллекция профилей преподавателей
 * Расширяет базовую таблицу users дополнительной информацией
 */

import { defineCollection } from '@nocobase/database';

export default defineCollection({
  name: 'teacher_profiles',
  title: 'Профили преподавателей',
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
      name: 'employeeId',
      title: 'ID сотрудника',
      unique: true,
    },
    {
      type: 'string',
      name: 'department',
      title: 'Кафедра/Отделение',
    },
    {
      type: 'string',
      name: 'position',
      title: 'Должность',
    },
    {
      type: 'string',
      name: 'phoneNumber',
      title: 'Телефон',
    },
    {
      type: 'string',
      name: 'officeRoom',
      title: 'Кабинет',
    },

    // Специализация
    {
      type: 'json',
      name: 'subjects',
      title: 'Преподаваемые предметы',
    },
    {
      type: 'json',
      name: 'qualifications',
      title: 'Квалификации',
    },

    // Связи
    {
      type: 'hasMany',
      name: 'courses',
      target: 'courses',
      foreignKey: 'teacherId',
      title: 'Курсы преподавателя',
    },
    {
      type: 'hasMany',
      name: 'checkedGrades',
      target: 'grades',
      foreignKey: 'teacherId',
      title: 'Проверенные работы',
    },

    // Дополнительная информация
    {
      type: 'text',
      name: 'bio',
      title: 'Биография',
    },
    {
      type: 'boolean',
      name: 'isActive',
      title: 'Активен',
      defaultValue: true,
    },
  ],
});

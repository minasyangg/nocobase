/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */

/**
 * Коллекция профилей родителей
 * Расширяет базовую таблицу users дополнительной информацией
 */

import { defineCollection } from '@nocobase/database';

export default defineCollection({
  name: 'parent_profiles',
  title: 'Профили родителей',
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
      name: 'firstName',
      title: 'Имя',
      required: true,
    },
    {
      type: 'string',
      name: 'lastName',
      title: 'Фамилия',
      required: true,
    },
    {
      type: 'string',
      name: 'middleName',
      title: 'Отчество',
    },
    {
      type: 'string',
      name: 'phoneNumber',
      title: 'Телефон',
      required: true,
    },
    {
      type: 'string',
      name: 'email',
      title: 'Email',
    },
    {
      type: 'string',
      name: 'occupation',
      title: 'Профессия',
    },
    {
      type: 'string',
      name: 'workplace',
      title: 'Место работы',
    },

    // Связи
    {
      type: 'belongsToMany',
      name: 'children',
      target: 'student_profiles',
      through: 'student_parent_relations',
      title: 'Дети',
    },

    // Настройки уведомлений
    {
      type: 'boolean',
      name: 'notifyEmail',
      title: 'Уведомления по email',
      defaultValue: true,
    },
    {
      type: 'boolean',
      name: 'notifySms',
      title: 'SMS уведомления',
      defaultValue: false,
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

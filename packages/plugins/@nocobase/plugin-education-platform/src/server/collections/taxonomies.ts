/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */

/**
 * Коллекция справочников (taxonomies)
 * Самостоятельная коллекция без зависимостей - создаем первой
 */

import { defineCollection } from '@nocobase/database';

export default defineCollection({
  name: 'taxonomies',
  title: 'Справочники',
  fields: [
    {
      type: 'string',
      name: 'type',
      title: 'Тип справочника',
      required: true,
      // Типы: subject_category, difficulty_level, assignment_type, lesson_type
    },
    {
      type: 'string',
      name: 'value',
      title: 'Значение',
      required: true,
    },
    {
      type: 'string',
      name: 'label',
      title: 'Отображаемое название',
      required: true,
    },
    {
      type: 'string',
      name: 'color',
      title: 'Цвет (для UI)',
      defaultValue: '#1890FF',
    },
    {
      type: 'string',
      name: 'icon',
      title: 'Иконка',
    },
    {
      type: 'integer',
      name: 'sortOrder',
      title: 'Порядок сортировки',
      defaultValue: 0,
    },
    {
      type: 'boolean',
      name: 'isActive',
      title: 'Активен',
      defaultValue: true,
    },
    {
      type: 'text',
      name: 'description',
      title: 'Описание',
    },
  ],
});

/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */

/**
 * Промежуточная таблица для связи студентов и родителей
 * Связь многие-ко-многим: один студент может иметь несколько родителей
 */

import { defineCollection } from '@nocobase/database';

export default defineCollection({
  name: 'student_parent_relations',
  title: 'Связи студент-родитель',
  fields: [
    {
      type: 'belongsTo',
      name: 'student',
      target: 'student_profiles',
      foreignKey: 'studentId',
      title: 'Студент',
      required: true,
    },
    {
      type: 'belongsTo',
      name: 'parent',
      target: 'parent_profiles',
      foreignKey: 'parentId',
      title: 'Родитель',
      required: true,
    },
    {
      type: 'string',
      name: 'relationshipType',
      title: 'Тип родства',
      defaultValue: 'parent',
      // parent, guardian, relative
    },
    {
      type: 'boolean',
      name: 'isPrimary',
      title: 'Основной контакт',
      defaultValue: false,
    },
  ],
});

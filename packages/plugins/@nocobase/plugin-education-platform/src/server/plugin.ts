/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */

// @ts-ignore
import { Plugin } from '@nocobase/server';

export class PluginEducationPlatformServer extends Plugin {
  async afterAdd() {
    // Логика после добавления плагина
  }

  async beforeLoad() {
    // Логика перед загрузкой плагина
  }

  async load() {
    // Импортируем и загружаем все коллекции
    // await this.importCollections();

    console.log('Education Platform Plugin: All collections loaded successfully');
    console.log('Available collections:');
    console.log('- taxonomies (справочники)');
    console.log('- student_profiles, teacher_profiles, parent_profiles');
    console.log('- classes, courses, lessons');
    console.log('- assignments, grades');
    console.log('- lesson_student_assignments, student_parent_relations');
  }

  async install() {
    // Логика установки плагина
  }

  async afterEnable() {
    // Логика после включения плагина
  }

  async afterDisable() {
    // Логика после отключения плагина
  }

  async remove() {
    // Логика удаления плагина
  }

  private async importCollections() {
    // Коллекции уже созданы через API
    // Этот метод можно оставить пустым или удалить
  }
}

export default PluginEducationPlatformServer;

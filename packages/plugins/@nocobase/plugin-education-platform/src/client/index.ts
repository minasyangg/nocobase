/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */

/**
 * Клиентская часть плагина Education Platform
 */

// @ts-ignore
import { Plugin } from '@nocobase/client';

export class PluginEducationPlatformClient extends Plugin {
  async load() {
    // Регистрация клиентских компонентов
    console.log('Education Platform Client Plugin loaded');
  }
}

export default PluginEducationPlatformClient;

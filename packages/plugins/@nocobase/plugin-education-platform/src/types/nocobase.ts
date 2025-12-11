/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */

/**
 * Minimal ambient module declarations to unblock local builds when workspace packages don't ship type definitions.
 */
declare module '@nocobase/database' {
  export interface CollectionOptions {
    name: string;
    [key: string]: any;
  }

  export function defineCollection<TOptions extends CollectionOptions>(options: TOptions): TOptions;
}

declare module '@nocobase/server' {
  import type { CollectionOptions } from '@nocobase/database';

  export interface PluginDataSource {
    name: string;
    acl: {
      allow(resource: string, actions: string | string[], role: string): void;
    };
    collectionManager: {
      hasCollection(name: string): boolean;
      defineCollection(options: CollectionOptions): void;
    };
  }

  export interface PluginApp {
    acl: {
      registerSnippet(options: { name: string; actions: readonly string[] }): void;
      allow(resource: string, actions: string | string[], role: string): void;
    };
    dataSourceManager: {
      afterAddDataSource(handler: (dataSource: PluginDataSource) => void): void;
    };
  }

  export interface PluginLogger {
    info(message: string, ...args: any[]): void;
    debug(message: string, ...args: any[]): void;
    [method: string]: (...args: any[]) => void;
  }

  export class Plugin {
    readonly name: string;
    readonly app: PluginApp;
    readonly log: PluginLogger;
  }
}

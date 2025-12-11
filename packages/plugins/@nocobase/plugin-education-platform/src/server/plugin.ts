/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */

import { Plugin } from '@nocobase/server';
import educationCollections, { collectionNames } from './collections';

const DEFAULT_ACTIONS = ['list', 'get', 'create', 'update', 'destroy'] as const;
const COLLECTION_ACTIONS = collectionNames.flatMap((collectionName) =>
  DEFAULT_ACTIONS.map((action) => `${collectionName}:${action}`),
);

export class PluginEducationPlatformServer extends Plugin {
  async afterAdd() {}

  async beforeLoad() {}

  async load() {
    this.registerAclSnippet();

    this.app.dataSourceManager.afterAddDataSource((dataSource) => {
      this.registerCollections(dataSource);
      this.registerCollectionsAcl(dataSource);
    });

    this.log.info('Education Platform Plugin loaded with %d collections.', educationCollections.length);
  }

  async install() {}

  async afterEnable() {}

  async afterDisable() {}

  async remove() {}

  private registerCollections(dataSource) {
    const { collectionManager } = dataSource;
    type CollectionDefinition = Parameters<typeof collectionManager.defineCollection>[0];

    educationCollections.forEach((collection) => {
      if (collectionManager.hasCollection(collection.name)) {
        this.log.debug(
          'Collection "%s" is already registered for data source "%s", skipping.',
          collection.name,
          dataSource.name,
        );
        return;
      }

      collectionManager.defineCollection(collection as CollectionDefinition);
    });
  }

  private registerAclSnippet() {
    this.app.acl.registerSnippet({
      name: `pm.${this.name}`,
      actions: COLLECTION_ACTIONS,
    });
  }

  private registerCollectionsAcl(dataSource) {
    collectionNames.forEach((collectionName) => {
      dataSource.acl.allow(collectionName, ['list', 'get'], 'loggedIn');
    });
  }
}

export default PluginEducationPlatformServer;

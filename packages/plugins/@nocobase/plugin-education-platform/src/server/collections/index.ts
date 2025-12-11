/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */

import { CollectionOptions } from '@nocobase/database';

import assignments from './assignments';
import classes from './classes';
import courses from './courses';
import grades from './grades';
import lessons from './lessons';
import lessonStudentAssignments from './lesson_student_assignments';
import parentProfiles from './parent_profiles';
import studentParentRelations from './student_parent_relations';
import studentProfiles from './student_profiles';
import taxonomies from './taxonomies';
import teacherProfiles from './teacher_profiles';

export const educationCollections = Object.freeze([
  taxonomies,
  studentProfiles,
  teacherProfiles,
  parentProfiles,
  classes,
  courses,
  lessons,
  assignments,
  grades,
  lessonStudentAssignments,
  studentParentRelations,
] satisfies CollectionOptions[]);

export const collectionNames: ReadonlyArray<string> = Object.freeze(
  educationCollections.map((collection) => collection.name),
);

export default educationCollections;

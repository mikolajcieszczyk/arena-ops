import { Action } from './action.enum';
import { Resource } from './resource.enum';

export type Permission = `${Action}:${Resource}`;

export const createPermission = (
  action: Action,
  resource: Resource,
): Permission => {
  return `${action}:${resource}`;
};

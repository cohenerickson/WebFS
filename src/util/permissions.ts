import { Entry } from "../types";

export function getPermissions(entry: Entry, user: number, group: number) {
  const permissions = {
    read: false,
    write: false,
    execute: false
  };

  permissions.read = entry.permissions & 0b000000100 ? true : false;
  permissions.write = entry.permissions & 0b000000010 ? true : false;
  permissions.execute = entry.permissions & 0b000000001 ? true : false;

  if (user === entry.owner) {
    permissions.read =
      entry.permissions & 0b100000000 ? true : permissions.read;
    permissions.write =
      entry.permissions & 0b010000000 ? true : permissions.write;
    permissions.execute =
      entry.permissions & 0b001000000 ? true : permissions.execute;
  } else if (group === entry.group) {
    permissions.read =
      entry.permissions & 0b000100000 ? true : permissions.read;
    permissions.write =
      entry.permissions & 0b000010000 ? true : permissions.write;
    permissions.execute =
      entry.permissions & 0b000001000 ? true : permissions.execute;
  }

  return permissions;
}

import { FileSystem } from "../classes/FileSystem";
import { constants } from "../util/constants";
import { getPermissions } from "../util/permissions";
import path from "path";

export async function access(
  this: FileSystem,
  filePath: string,
  mode: number = constants.F_OK
): Promise<undefined> {
  const entry = await this.provider.findEntry(path.join(this.cwd, filePath));

  if (!entry)
    throw new Error(`ENOENT: no such file or directory, access '${filePath}'`);

  const permissions = getPermissions(entry, this.user, this.group);

  switch (mode) {
    case constants.F_OK:
      return;
    case constants.R_OK:
      if (permissions.read) return;
      else throw new Error(`EACCES: permission denied, access '${filePath}'`);
    case constants.W_OK:
      if (permissions.write) return;
      else throw new Error(`EACCES: permission denied, access '${filePath}'`);
    case constants.X_OK:
      if (permissions.execute) return;
      else throw new Error(`EACCES: permission denied, access '${filePath}'`);
    default:
      throw new Error(`EINVAL: invalid argument, access '${mode}'`);
  }
}

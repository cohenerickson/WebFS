import { FileSystem } from "../classes/FileSystem";
import { Directory } from "../types";
import { constants } from "../util/constants";
import path from "path";

export async function mkdir(
  this: FileSystem,
  filePath: string,
  options?: {
    recursive?: boolean;
    mode?: number;
  }
) {
  const entry = await this.provider.findEntry(path.join(this.cwd, filePath));

  if (!entry && !options?.recursive) {
    throw new Error(`ENOENT: directory already exists, mkdir '${filePath}'`);
  }

  const dir: Directory = {
    id: entry?.id ?? 0,
    name: path.basename(filePath),
    type: constants.S_IFDIR,
    nlinks: [],
    children: [],
    permissions: options?.mode ?? 0o777,
    uid: this.uid,
    gid: this.gid,
    created: new Date(),
    modified: new Date(),
    changed: new Date(),
    accessed: new Date()
  };

  const parent = (await this.provider.findEntry(
    path.dirname(path.join(this.cwd, filePath))
  )) as Directory;

  if (!parent) {
    throw new Error(`ENOENT: no such file or directory, mkdir '${filePath}'`);
  }

  if (!parent.children.includes(dir.id)) {
    parent.children.push(dir.id);
    parent.modified = new Date();

    await this.provider.setEntry(parent);
  }

  await this.provider.setEntry(dir);
}

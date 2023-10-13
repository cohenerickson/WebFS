import { FileSystem } from "../classes/FileSystem";

export async function chown(
  this: FileSystem,
  path: string,
  uid: number,
  gid: number
): Promise<undefined> {
  const file = await this.provider.findEntry(path);

  if (!file) {
    throw new Error(`ENOENT: no such file or directory, chown '${path}'`);
  }

  file.owner = uid;
  file.group = gid;

  await this.provider.setEntry(file);
}

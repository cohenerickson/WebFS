import { FileSystem } from "../classes/FileSystem";

export async function chmod(
  this: FileSystem,
  path: string,
  mode: number
): Promise<undefined> {
  const file = await this.provider.findEntry(path);

  if (!file) {
    throw new Error(`ENOENT: no such file or directory, chmod '${path}'`);
  }

  file.permissions = mode;

  await this.provider.setEntry(file);
}

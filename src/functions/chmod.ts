import { FileSystem } from "../classes/FileSystem";
import path from "path";

export async function chmod(
  this: FileSystem,
  filePath: string,
  mode: number
): Promise<undefined> {
  const file = await this.provider.findEntry(path.join(this.cwd, filePath));

  if (!file) {
    throw new Error(`ENOENT: no such file or directory, chmod '${filePath}'`);
  }

  file.permissions = mode;

  await this.provider.setEntry(file);
}

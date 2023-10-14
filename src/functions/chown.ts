import { FileSystem } from "../classes/FileSystem";
import path from "path";

export async function chown(
  this: FileSystem,
  filePath: string,
  uid: number,
  gid: number
): Promise<undefined> {
  const file = await this.provider.findEntry(path.join(this.cwd, filePath));

  if (!file) {
    throw new Error(`ENOENT: no such file or directory, chown '${filePath}'`);
  }

  file.uid = uid;
  file.gid = gid;

  await this.provider.setEntry(file);
}

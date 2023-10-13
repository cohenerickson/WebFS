import { FileSystem } from "../classes/FileSystem";

export async function utimes(
  this: FileSystem,
  path: string,
  atime: number | string | Date,
  mtime: number | string | Date
) {
  const file = await this.provider.findEntry(path);

  if (!file) {
    throw new Error(`ENOENT: no such file or directory, utimes '${path}'`);
  }

  if (typeof atime === "string" || typeof atime === "number") {
    atime = new Date(atime);
  }

  if (typeof mtime === "string" || typeof mtime === "number") {
    mtime = new Date(mtime);
  }

  file.accessed = atime;
  file.modified = mtime;

  await this.provider.setEntry(file);
}

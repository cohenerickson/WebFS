import { FileSystem } from "../classes/FileSystem";
import { Stats } from "../classes/Stats";

export async function stat(
  this: FileSystem,
  path: string,
  options?: {
    bigint?: boolean;
  }
) {
  const entry = await this.provider.findEntry(path);

  if (!entry) {
    throw new Error(`ENOENT: no such file or directory, stat '${path}'`);
  }

  if (entry.type === "file") {
    const content = await this.provider.getContent(entry);

    return new Stats(entry, content ?? null, options?.bigint ?? false);
  } else {
    return new Stats(entry, null, options?.bigint ?? false);
  }
}

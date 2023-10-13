import { FileSystem } from "../classes/FileSystem";

export async function appendFile(
  this: FileSystem,
  path: string,
  data: string | Uint8Array,
  options:
    | {
        encoding?: string | null;
        mode?: number;
        flag?: string;
      }
    | string = "utf8"
): Promise<undefined> {
  const file = await this.provider.findEntry(path);

  if (!file)
    throw new Error(`ENOENT: no such file or directory, open '${path}'`);

  if (file.type !== "file") {
    throw new Error(
      `EISDIR: illegal operation on a directory, appendFile '${path}'`
    );
  }

  if (typeof options === "string") {
    options = { encoding: options };
  }

  const contentBuffer = await this.provider.getContent(file);

  if (!contentBuffer) {
    throw new Error(`ENOENT: no such file or directory, appendFile '${path}'`);
  }

  const content = Array.from(contentBuffer);

  if (data instanceof Uint8Array) {
    content.push(...data);
  } else {
    content.push(...data.split("").map((c) => c.charCodeAt(0)));
  }

  await this.provider.setContent(file, new Uint8Array(content));
}

import { FileSystem } from "../classes/FileSystem";
import { constants } from "../util/constants";
import path from "path";

export async function appendFile(
  this: FileSystem,
  filePath: string,
  data: string | Uint8Array,
  options:
    | {
        encoding?: string | null;
        mode?: number;
        flag?: string;
      }
    | string = "utf8"
): Promise<undefined> {
  const file = await this.provider.findEntry(path.join(this.cwd, filePath));

  if (!file)
    throw new Error(`ENOENT: no such file or directory, open '${filePath}'`);

  if (file.type !== constants.S_IFREG) {
    throw new Error(
      `EISDIR: illegal operation on a directory, appendFile '${filePath}'`
    );
  }

  if (typeof options === "string") {
    options = { encoding: options };
  }

  const contentBuffer = await this.provider.getContent(file);

  if (!contentBuffer) {
    throw new Error(
      `ENOENT: no such file or directory, appendFile '${filePath}'`
    );
  }

  const content = Array.from(contentBuffer);

  if (data instanceof Uint8Array) {
    content.push(...data);
  } else {
    content.push(...data.split("").map((c) => c.charCodeAt(0)));
  }

  await this.provider.setContent(file, new Uint8Array(content));
}

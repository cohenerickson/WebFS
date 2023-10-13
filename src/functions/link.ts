import { FileSystem } from "../classes/FileSystem";
import path from "path";
import { v4 } from "uuid";

export async function link(
  this: FileSystem,
  existingPath: string,
  newPath: string
) {
  const entry = await this.provider.findEntry(existingPath);

  if (!entry || entry.type !== "file") {
    throw new Error(
      `ENOENT: no such file or directory, link '${existingPath}'`
    );
  }

  const newEntry = {
    ...entry,
    id: v4(),
    name: path.basename(newPath)
  };

  await this.provider.setEntry(newEntry);
}

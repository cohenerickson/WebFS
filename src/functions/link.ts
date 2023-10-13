import { FileSystem } from "../classes/FileSystem";
import { randomId } from "../util/randomId";
import path from "path";

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
    id: randomId(),
    name: path.basename(newPath)
  };

  entry.nlinks.push(newEntry.id);
  await this.provider.setEntry(entry);

  await this.provider.setEntry(newEntry);
}

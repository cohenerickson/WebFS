import { FileSystem } from "../classes/FileSystem";
import { Directory } from "../types";
import { constants } from "../util/constants";
import { randomId } from "../util/randomId";
import path from "path";

export async function copyFile(
  this: FileSystem,
  src: string,
  dest: string,
  mode: number = 0
): Promise<undefined> {
  const file = await this.provider.findEntry(path.join(this.cwd, src));

  if (!file || file.type !== constants.S_IFREG) {
    throw new Error(`ENOENT: no such file, copyFile '${src}' -> '${dest}'`);
  }

  const content = await this.provider.getContent(file);

  if (!content) {
    throw new Error(
      `ENOENT: no such file or directory, copyFile '${src}' -> '${dest}'`
    );
  }

  let destFile = await this.provider.findEntry(path.join(this.cwd, dest));

  switch (mode) {
    case constants.COPYFILE_EXCL:
      if (destFile) {
        throw new Error(
          `EEXIST: file already exists, copyFile '${src}' -> '${dest}'`
        );
      }
      break;
    case constants.COPYFILE_FICLONE_FORCE:
      throw new Error(
        `ENOSYS: function not implemented, copyFile '${src}' -> '${dest}'`
      );
  }

  const parentPath = path.dirname(dest);

  const parent = (await this.provider.findEntry(parentPath)) as Directory;

  if (!parent) {
    throw new Error(
      `ENOENT: no such file or directory, copyFile '${src}' -> '${dest}'`
    );
  }

  destFile = {
    ...file,
    id: destFile?.id ?? randomId(),
    data: randomId(),
    name: destFile?.name ?? path.basename(dest),
    created: destFile?.created ?? new Date(),
    modified: new Date(),
    changed: new Date(),
    accessed: destFile?.accessed ?? new Date()
  };

  parent.children.push(destFile.id);
  parent.modified = new Date();
  parent.changed = new Date();

  await this.provider.setEntry(parent);
  await this.provider.setEntry(destFile);
  await this.provider.setContent(destFile, content);
}

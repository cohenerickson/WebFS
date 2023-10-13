import { FileSystem } from "../classes/FileSystem";
import { constants } from "../util/constants";
import { randomId } from "../util/randomId";
import path from "path";

export async function copyFile(
  this: FileSystem,
  src: string,
  dest: string,
  mode: number = 0
): Promise<undefined> {
  const file = await this.provider.findEntry(src);

  if (!file || file.type !== "file") {
    throw new Error(`ENOENT: no such file, copyFile '${src}' -> '${dest}'`);
  }

  const content = await this.provider.getContent(file);

  if (!content) {
    throw new Error(
      `ENOENT: no such file or directory, copyFile '${src}' -> '${dest}'`
    );
  }

  let destFile = await this.provider.findEntry(dest);

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

  destFile = {
    ...file,
    id: destFile?.id ?? randomId(),
    name: destFile?.name ?? path.basename(dest),
    created: destFile?.created ?? new Date(),
    modified: destFile?.modified ?? new Date(),
    accessed: destFile?.accessed ?? new Date()
  };

  await this.provider.setEntry(destFile);
  await this.provider.setContent(destFile, content);
}

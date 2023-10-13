import { FileSystem } from "../classes/FileSystem";
import { constants } from "../util/constants";
import path from "path";
import { v4 } from "uuid";

export async function cp(
  this: FileSystem,
  src: string,
  dest: string,
  options?: {
    dereference?: boolean;
    errorOnExist?: boolean;
    filter?: (src: string, dest: string) => boolean | Promise<boolean>;
    force?: boolean;
    mode?: number;
    preserveTimestamps?: boolean;
    recursive?: boolean;
    verbatimSymlinks?: boolean;
  }
): Promise<undefined> {
  const entry = await this.provider.findEntry(this.cwd);

  if (!entry) {
    throw new Error(
      `ENOENT: no such file or directory, cp '${src}' -> '${dest}'`
    );
  }

  const tree = await this.provider.getSubTree(entry.id);

  const destination = await this.provider.findEntry(dest);

  if (!options?.force && options?.errorOnExist && destination) {
    throw new Error(`EEXIST: file already exists, cp '${src}' -> '${dest}'`);
  } else if (!options?.force && destination) {
    return;
  }

  switch (options?.mode) {
    case constants.COPYFILE_EXCL:
      if (destination) {
        throw new Error(
          `EEXIST: file or directory already exists, cp '${src}' -> '${dest}'`
        );
      }
      break;
    case constants.COPYFILE_FICLONE_FORCE:
      throw new Error(
        `ENOSYS: function not implemented, copyFile '${src}' -> '${dest}'`
      );
  }

  if (tree.type !== "directory") {
    const filter = await options?.filter?.(
      path.join(this.cwd, src, tree.name),
      path.join(this.cwd, dest, tree.name)
    );

    if (filter) {
      if (tree.type === "symlink" && !options?.verbatimSymlinks) {
        let copy = {
          ...tree,
          id: v4()
        };

        if (!options?.preserveTimestamps) {
          copy = {
            ...copy,
            created: new Date(),
            modified: new Date(),
            accessed: new Date()
          };
        }

        this.provider.setEntry(copy);
      } else if (tree.type === "file") {
        let copy = {
          ...tree,
          id: v4(),
          data: v4()
        };

        if (!options?.preserveTimestamps) {
          copy = {
            ...copy,
            created: new Date(),
            modified: new Date(),
            accessed: new Date()
          };
        }

        const content = await this.provider.getContent(tree);

        if (content) {
          this.provider.setEntry(copy);
          this.provider.setContent(copy, content);
        } else {
          throw new Error(
            `ENOENT: no such file or directory, cp '${src}' -> '${dest}'`
          );
        }
      }
    }
  } else if (options?.recursive) {
    for (const child of tree.children) {
      await this.cp(
        path.join(this.cwd, src, tree.name, child.name),
        path.join(this.cwd, dest, tree.name, child.name),
        options
      );
    }
  }
}

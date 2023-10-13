import { FileSystem } from "../classes/FileSystem";
import { Directory } from "../types";
import { constants } from "../util/constants";
import { randomId } from "../util/randomId";
import path from "path";

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

  if (tree.type !== constants.S_IFDIR) {
    const filter = await options?.filter?.(
      path.join(this.cwd, src, tree.name),
      path.join(this.cwd, dest, tree.name)
    );

    if (filter) {
      if (tree.type === constants.S_IFLNK && !options?.verbatimSymlinks) {
        let copy = {
          ...tree,
          id: randomId()
        };

        if (!options?.preserveTimestamps) {
          copy = {
            ...copy,
            created: new Date(),
            modified: new Date(),
            changed: new Date(),
            accessed: new Date()
          };
        }

        const parent = (await this.provider.findEntry(
          path.dirname(path.join(this.cwd, dest, tree.name))
        )) as Directory;

        if (!parent) {
          throw new Error(
            `ENOENT: no such file or directory, cp '${src}' -> '${dest}'`
          );
        }

        parent.children.push(copy.id);
        parent.modified = new Date();

        await this.provider.setEntry(parent);
        await this.provider.setEntry(copy);
      } else if (tree.type === constants.S_IFREG) {
        let copy = {
          ...tree,
          id: randomId(),
          data: randomId()
        };

        if (!options?.preserveTimestamps) {
          copy = {
            ...copy,
            created: new Date(),
            modified: new Date(),
            changed: new Date(),
            accessed: new Date()
          };
        }

        const content = await this.provider.getContent(tree);

        const parent = (await this.provider.findEntry(
          path.dirname(path.join(this.cwd, dest, tree.name))
        )) as Directory;

        if (!parent) {
          throw new Error(
            `ENOENT: no such file or directory, cp '${src}' -> '${dest}'`
          );
        }

        parent.children.push(copy.id);
        parent.modified = new Date();

        if (content) {
          await this.provider.setEntry(parent);
          await this.provider.setEntry(copy);
          await this.provider.setContent(copy, content);
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

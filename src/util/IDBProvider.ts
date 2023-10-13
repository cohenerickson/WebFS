import { FSProvider } from "../classes/FSProvider";
import { Directory, Entry, File } from "../types";
import { IDBPDatabase, openDB, DBSchema } from "idb";

interface Schema extends DBSchema {
  files: {
    key: string;
    value: Uint8Array | Entry;
  };
}

export class IDBProvider extends FSProvider {
  private db?: Promise<IDBPDatabase<Schema>>;

  constructor(name: string) {
    super(name);

    this.db = openDB<Schema>(name, 1, {
      upgrade: async (db) => {
        db.createObjectStore("files");

        db.put(
          "files",
          {
            id: "00000000-0000-0000-0000-000000000000",
            name: "/",
            type: "directory",
            children: [],
            permissions: 0o777,
            created: new Date(),
            modified: new Date(),
            accessed: new Date(),
            owner: 0,
            group: 0
          },
          "00000000-0000-0000-0000-000000000000"
        );
      }
    });

    this.db.then(() => {
      this.emit("ready");
    });
  }

  async getTree(): Promise<Directory<true>> {
    return (await this.getSubTree(
      "00000000-0000-0000-0000-000000000000"
    )) as Directory<true>;
  }

  async getSubTree(id: string): Promise<Entry<true>> {
    const db = await this.db!;

    const meta = (await db.get("files", id)) as Entry;

    if (meta.type !== "directory") {
      return meta;
    }

    const children = await Promise.all(
      meta.children.map(async (id) => {
        const meta = (await db.get("files", id)) as Entry;

        if (meta.type === "directory") {
          return await this.getSubTree(id);
        } else {
          return meta;
        }
      })
    );

    return Object.assign(meta, { children });
  }

  async getEntry(id: string): Promise<Entry | undefined> {
    const db = await this.db!;

    const entry = await db.get("files", id);

    if (entry instanceof Uint8Array) {
      return undefined;
    } else {
      return entry;
    }
  }

  async findEntry(path: string): Promise<Entry | undefined> {
    const parts = path.split("/");

    let current = await this.getEntry("00000000-0000-0000-0000-000000000000");

    if (!current) return undefined;

    for (const part of parts) {
      if (part === "") {
        continue;
      }

      if (current.type === "symlink") {
        current = await this.getEntry(current.target);

        if (!current) return undefined;

        continue;
      }

      if (current.type !== "directory") {
        return undefined;
      }

      const childId = current.children.find(async (id) => {
        const entry = await this.getEntry(id);

        if (!entry) return false;

        return entry.name === part;
      });

      if (!childId) return undefined;

      current = await this.getEntry(childId!);

      if (!current) return undefined;
    }

    return current;
  }

  async setEntry(entry: Entry): Promise<void> {
    const db = await this.db!;

    entry.modified = new Date();
    await db.put("files", entry, entry.id);

    this.emit("entry.set", entry);
  }

  async getContent(file: File): Promise<Uint8Array | undefined> {
    const db = await this.db!;

    const content = await db.get("files", file.id);

    if (content instanceof Uint8Array) {
      file.accessed = new Date();
      await db.put("files", file, file.id);

      this.emit("content.get", file);
      return content;
    } else {
      return undefined;
    }
  }

  async setContent(file: File, content: Uint8Array): Promise<void> {
    const db = await this.db!;

    file.modified = new Date();

    await db.put("files", file, file.id);
    await db.put("files", content, file.data);

    this.emit("content.set", file, content);
  }
}

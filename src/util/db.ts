import { File, Group, User } from "../types";
import EventEmitter from "events";
import { IDBPDatabase, openDB, DBSchema } from "idb";

interface Schema extends DBSchema {
  users: {
    key: string;
    value: User;
  };
  groups: {
    key: string;
    value: Group;
  };
  sda1: {
    key: string;
    value: File | Uint8Array | string;
  };
}

export class DB extends EventEmitter {
  db: Promise<IDBPDatabase<Schema>>;

  constructor(name: string) {
    super();

    this.db = openDB<Schema>(name, 1, {
      upgrade(db) {
        db.createObjectStore("users", {
          keyPath: "id"
        });
        db.createObjectStore("groups", {
          keyPath: "id"
        });
        db.createObjectStore("sda1", {
          keyPath: "id"
        });
      }
    });

    this.db.then(() => {
      this.emit("ready");
    });
  }

  async addUser(user: User): Promise<void> {
    const db = await this.db;
    await db.put("users", user, user.id);
    this.emit("user.add", user);
  }

  async getUser(id: string): Promise<User | undefined> {
    const db = await this.db;
    return await db.get("users", id);
  }

  async removeUser(id: string): Promise<void> {
    const db = await this.db;
    await db.delete("users", id);
    this.emit("user.remove", id);
  }

  async addGroup(group: Group): Promise<void> {
    const db = await this.db;
    await db.put("groups", group, group.id);
    this.emit("group.add", group);
  }

  async getGroup(id: string): Promise<Group | undefined> {
    const db = await this.db;
    return await db.get("groups", id);
  }

  async removeGroup(id: string): Promise<void> {
    const db = await this.db;
    await db.delete("groups", id);
    this.emit("group.remove", id);
  }

  async getMeta(id: string): Promise<File | undefined> {
    const db = await this.db;
    const meta = await db.get("sda1", id);
    if (meta instanceof Uint8Array || typeof meta === "string") {
      return undefined;
    } else {
      return meta;
    }
  }

  async putMeta(meta: File): Promise<void> {
    const db = await this.db;
    await db.put("sda1", meta, meta.id);
    this.emit("meta.put", meta);
  }

  async getContent(
    meta: File & { type: "file" | "symlink" }
  ): Promise<Uint8Array | undefined> {
    const db = await this.db;

    if (meta.type === "file") {
      const content = await db.get("sda1", meta.target);

      if (content instanceof Uint8Array) {
        return content;
      } else {
        return undefined;
      }
    } else if (meta.type === "symlink") {
      const symMeta = await this.getMeta(meta.target);

      if (symMeta) {
        return await this.getContent(symMeta);
      } else {
        return undefined;
      }
    }
  }

  async putContent(
    meta: File & { type: "file" | "symlink" },
    content: Uint8Array | string
  ): Promise<void> {
    const db = await this.db;
    if (meta.type === "file") {
      await db.put("sda1", content, meta.target);
      this.emit("content.put", meta, content);
    } else if (meta.type === "symlink") {
      const symMeta = await this.getMeta(meta.target);
      if (symMeta) {
        await this.putContent(symMeta, content);
      }
    }
  }
}

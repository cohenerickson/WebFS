import { Entry } from "../types";

export class Stats {
  private entry: Entry;
  public readonly dev: bigint | number = 0;
  public readonly ino: bigint | number;
  public readonly mode: bigint | number = 0;
  public readonly nlink: bigint | number;
  public readonly uid: bigint | number;
  public readonly gid: bigint | number;
  public readonly rdev: bigint | number = 0;
  public readonly size: bigint | number;
  public readonly blksize: bigint | number = 0;
  public readonly blocks: bigint | number = 0;
  public readonly atimeMs: bigint | number;
  public readonly mtimeMs: bigint | number;
  public readonly ctimeMs: bigint | number;
  public readonly birthtimeMs: bigint | number;
  public readonly atimeNs: bigint | undefined;
  public readonly mtimeNs: bigint | undefined;
  public readonly ctimeNs: bigint | undefined;
  public readonly birthtimeNs: bigint | undefined;
  public readonly atime: Date;
  public readonly mtime: Date;
  public readonly ctime: Date;
  public readonly birthtime: Date;

  constructor(entry: Entry, content: Uint8Array | null, bigint: boolean) {
    this.entry = entry;
    this.ino = bigint ? BigInt(entry.id) : entry.id;
    this.uid = bigint ? BigInt(entry.uid) : entry.uid;
    this.gid = bigint ? BigInt(entry.gid) : entry.gid;
    this.nlink = bigint ? BigInt(entry.nlinks.length) : entry.nlinks.length;
    this.size = content
      ? bigint
        ? BigInt(content.length)
        : content.length
      : bigint
      ? BigInt(0)
      : 0;
    this.atimeMs = entry.accessed.getTime();
    this.mtimeMs = entry.modified.getTime();
    this.ctimeMs = entry.changed.getTime();
    this.birthtimeMs = entry.created.getTime();
    if (bigint) {
      this.atimeNs = BigInt(entry.accessed.getTime() * 1e6);
      this.mtimeNs = BigInt(entry.modified.getTime() * 1e6);
      this.ctimeNs = BigInt(entry.changed.getTime() * 1e6);
      this.birthtimeNs = BigInt(entry.created.getTime() * 1e6);
    }
    this.atime = entry.accessed;
    this.mtime = entry.modified;
    this.ctime = entry.changed;
    this.birthtime = entry.created;
  }

  public isBlockDevice(): boolean {
    return false;
  }

  public isCharacterDevice(): boolean {
    return false;
  }

  public isDirectory(): boolean {
    return this.entry.type === "directory";
  }

  public isFIFO(): boolean {
    return false;
  }

  public isFile(): boolean {
    return this.entry.type === "file";
  }

  public isSocket(): boolean {
    return false;
  }

  public isSymbolicLink(): boolean {
    return this.entry.type === "symlink";
  }
}

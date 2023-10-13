import { Entry } from "../types";
import { constants } from "../util/constants";

export class Stats {
  public readonly dev: bigint | number = 0;
  public readonly ino: bigint | number;
  public readonly mode: bigint | number;
  public readonly nlink: bigint | number;
  public readonly uid: bigint | number;
  public readonly gid: bigint | number;
  public readonly rdev: bigint | number = 0;
  public readonly size: bigint | number;
  public readonly blksize: bigint | number;
  public readonly blocks: bigint | number = 1;
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
    this.ino = bigint ? BigInt(entry.id) : entry.id;
    this.mode = bigint
      ? BigInt(entry.type | entry.permissions)
      : entry.type | entry.permissions;
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
    this.blksize = this.size;
    this.atimeMs = entry.accessed.getTime();
    this.mtimeMs = entry.modified.getTime();
    this.ctimeMs = entry.changed.getTime();
    this.birthtimeMs = entry.created.getTime();
    if (bigint) {
      this.atimeNs = BigInt(entry.accessed.getTime()) * 1000000n;
      this.mtimeNs = BigInt(entry.modified.getTime()) * 1000000n;
      this.ctimeNs = BigInt(entry.changed.getTime()) * 1000000n;
      this.birthtimeNs = BigInt(entry.created.getTime()) * 1000000n;
    }
    this.atime = entry.accessed;
    this.mtime = entry.modified;
    this.ctime = entry.changed;
    this.birthtime = entry.created;
  }

  public isBlockDevice(): boolean {
    return Number(this.mode) & constants.S_IFBLK ? true : false;
  }

  public isCharacterDevice(): boolean {
    return Number(this.mode) & constants.S_IFCHR ? true : false;
  }

  public isDirectory(): boolean {
    return Number(this.mode) & constants.S_IFDIR ? true : false;
  }

  public isFIFO(): boolean {
    return Number(this.mode) & constants.S_IFIFO ? true : false;
  }

  public isFile(): boolean {
    return Number(this.mode) & constants.S_IFREG ? true : false;
  }

  public isSocket(): boolean {
    return Number(this.mode) & constants.S_IFSOCK ? true : false;
  }

  public isSymbolicLink(): boolean {
    return Number(this.mode) & constants.S_IFLNK ? true : false;
  }
}

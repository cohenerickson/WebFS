import { DB } from "../util/db";
import { Dir } from "./Dir";
import { Dirent } from "./Dirent";
import { FileHandle } from "./FileHandle";
import { StatFs } from "./StatFs";
import { Stats } from "./Stats";

type Path = string | URL;
type Mode = string | number;

export class FileSystem {
  private db: DB;
  public readonly constants = {
    // File access constants
    F_OK: 0b000,
    R_OK: 0b100,
    W_OK: 0b010,
    X_OK: 0b001,

    // File copy constants
    COPYFILE_EXCL: 0b001,
    COPYFILE_FICLONE: 0b010,
    COPYFILE_FICLONE_FORCE: 0b100,

    // File open constants
    O_RDONLY: 0,
    O_WRONLY: 1,
    O_RDWR: 2,
    O_CREAT: 64,
    O_EXCL: 128,
    O_NOCTTY: 256,
    O_TRUNC: 512,
    O_APPEND: 1024,
    O_DIRECTORY: 65536,
    O_NOATIME: 262144,
    O_NOFOLLOW: 131072,
    O_SYNC: 1052672,
    O_DSYNC: 4096,
    O_SYMLINK: undefined,
    O_DIRECT: 16384,
    O_NONBLOCK: 2048,
    UV_FS_O_FILEMAP: 0
  } as const;

  public readonly Dir = Dir;
  public readonly Dirent = Dirent;
  public readonly FileHandle = FileHandle;
  public readonly StatFs = StatFs;
  public readonly Stats = Stats;

  constructor(name: string) {
    this.db = new DB(name);
  }

  async access(
    path: Path,
    mode: Mode = this.constants.F_OK
  ): Promise<undefined> {}

  async appendFile(
    path: Path,
    data: string | Buffer,
    options:
      | {
          encoding?: string | null;
          mode?: Mode;
          flag?: string;
        }
      | string = "utf8"
  ): Promise<undefined> {}

  async chmod(path: Path, mode: Mode): Promise<undefined> {}

  async chown(path: Path, uid: number, gid: number): Promise<undefined> {}

  async copyFile(src: Path, dest: Path, mode: Mode = 0): Promise<undefined> {}

  /**
   * @experimental
   */
  async cp(): Promise<undefined> {}

  async lchmod(path: Path, mode: Mode): Promise<undefined> {}

  async lchown(path: Path, uid: number, gid: number): Promise<undefined> {}

  async lutimes(
    path: Path,
    atime: number | string | Date,
    mtime: number | string | Date
  ): Promise<undefined> {}

  async link(existingPath: Path, newPath: Path): Promise<undefined> {}

  async lstat(
    path: Path,
    options: {
      bigint?: boolean;
    }
  ): Promise<undefined> {}

  async mkdir(
    path: Path,
    options: {
      recursive?: boolean;
      mode?: number;
    }
  ): Promise<undefined> {}

  async mkdtemp(
    prefix: string,
    options:
      | string
      | {
          encoding?: string;
        }
  ): Promise<undefined> {}

  async open(path: Path, flags: string = "r", mode: Mode): Promise<FileHandle> {
    return new FileHandle();
  }

  async opendir(
    path: Path,
    options: {
      encoding?: string;
      bufferSize?: number;
      recursive?: boolean;
    }
  ): Promise<Dir | AsyncIterable<Dir | FileHandle>> {
    return new Dir();
  }

  async readdir(
    path: Path,
    options:
      | string
      | {
          encoding?: string;
          withFileTypes?: boolean;
          recursive?: boolean;
        }
  ): Promise<string[] | Dirent> {
    return [];
  }

  async readFile(
    path: Path,
    options:
      | string
      | {
          encoding?: string;
          flag?: string;
          signal?: AbortSignal;
        }
  ): Promise<string | Buffer> {
    return "";
  }

  async readlink(
    path: Path,
    options:
      | string
      | {
          encoding?: string;
        }
  ): Promise<string | Buffer> {
    return "";
  }

  async realpath(
    path: Path,
    options:
      | string
      | {
          encoding?: string;
        }
  ): Promise<string | Buffer> {
    return "";
  }

  async rename(oldPath: Path, newPath: Path): Promise<undefined> {}

  async rmdir(
    path: Path,
    options: {
      maxRetries?: number;
      recursive?: boolean;
      retryDelay?: number;
    }
  ): Promise<undefined> {}

  async rm(
    path: Path,
    options: {
      force?: boolean;
      maxRetries?: number;
      recursive?: boolean;
      retryDelay?: number;
    }
  ): Promise<undefined> {}

  async stat(
    path: Path,
    options: {
      bigint?: boolean;
    }
  ): Promise<Stats> {
    return new Stats();
  }

  async statfs(
    path: Path,
    options: {
      bigint?: boolean;
    }
  ): Promise<StatFs> {
    return new StatFs();
  }

  async symlink(
    target: Path,
    path: Path,
    type: string | null = null
  ): Promise<undefined> {}

  async truncate(path: Path, len: number = 0): Promise<undefined> {}

  async unlink(path: Path): Promise<undefined> {}

  async utimes(
    path: Path,
    atime: number | string | Date,
    mtime: number | string | Date
  ): Promise<undefined> {}

  async watch(
    filename: Path,
    options?:
      | string
      | {
          persistent?: boolean;
          recursive?: boolean;
          encoding?: string;
          signal?: AbortSignal;
        }
  ): Promise<
    AsyncIterator<{
      eventType: string;
      filename: string | Buffer;
    }>
  > {
    return {} as any;
  }

  async writeFile(
    path: Path,
    data: string | Buffer,
    options:
      | string
      | {
          encoding?: string;
          mode?: Mode;
          flag?: string;
          signal?: AbortSignal;
        }
  ): Promise<undefined> {}
}

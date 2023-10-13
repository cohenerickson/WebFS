import { access } from "../functions/access";
import { appendFile } from "../functions/appendFile";
import { chmod } from "../functions/chmod";
import { chown } from "../functions/chown";
import { copyFile } from "../functions/copyFile";
import { cp } from "../functions/cp";
import { stat } from "../functions/stat";
import { utimes } from "../functions/utimes";
import { IDBProvider } from "../util/IDBProvider";
import { constants } from "../util/constants";
import { Dir } from "./Dir";
import { Dirent } from "./Dirent";
import { FSProvider } from "./FSProvider";
import { FileHandle } from "./FileHandle";
import { StatFs } from "./StatFs";
import { Stats } from "./Stats";

export class FileSystem {
  // Internal
  public readonly provider: FSProvider;
  public readonly user: number;
  public readonly group: number;
  public readonly cwd: string;

  // fs API
  public readonly constants = constants;
  public static readonly Dir = Dir;
  public static readonly Dirent = Dirent;
  public static readonly FileHandle = FileHandle;
  public static readonly StatFs = StatFs;
  public static readonly Stats = Stats;

  constructor(options?: {
    provider?: FSProvider;
    user?: number;
    group?: number;
    cwd?: string;
  }) {
    options = options ?? {};

    this.provider = options.provider ?? new IDBProvider("sda1");

    this.user = options.user ?? 0;
    this.group = options.group ?? 0;
    this.cwd = options.cwd ?? "/";
  }

  /**
   * Tests a user's permissions for the file or directory specified by `filePath`.
   * The `mode` argument is an optional integer that specifies the accessibility checks to be performed.
   * `mode` should be either the value `fs.constants.F_OK` or a mask consisting of the bitwise OR of any of `fs.constants.R_OK`, `fs.constants.W_OK`, and `fs.constants.X_OK` (e.g. `fs.constants.W_OK | fs.constants.R_OK`).
   * Check [File access constants](https://nodejs.org/api/fs.html#file-access-constants) for possible values of mode.
   *
   * @param filePath
   * @param mode **Default:** `fs.constants.F_OK`
   *
   * @returns Fulfills with `undefined` upon success.
   */
  public access = access.bind(this);

  public appendFile = appendFile.bind(this);

  public chmod = chmod.bind(this);

  public chown = chown.bind(this);

  public copyFile = copyFile.bind(this);

  /**
   * @experimental
   */
  public cp = cp.bind(this);

  public lchmod = chmod.bind(this);

  public lchown = chown.bind(this);

  public lutimes = utimes.bind(this);

  async link(existingpath: string, newpath: string): Promise<undefined> {}

  public lstat = stat.bind(this);

  async mkdir(
    path: string,
    options?: {
      recursive?: boolean;
      mode?: number;
    }
  ): Promise<undefined> {}

  async mkdtemp(
    prefix: string,
    options?:
      | string
      | {
          encoding?: string;
        }
  ): Promise<undefined> {}

  async open(
    path: string,
    flags: string = "r",
    mode: number
  ): Promise<FileHandle> {
    return new FileHandle();
  }

  async opendir(
    path: string,
    options?: {
      encoding?: string;
      bufferSize?: number;
      recursive?: boolean;
    }
  ): Promise<Dir | AsyncIterable<Dir | FileHandle>> {
    return new Dir();
  }

  async readdir(
    path: string,
    options?:
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
    path: string,
    options?:
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
    path: string,
    options?:
      | string
      | {
          encoding?: string;
        }
  ): Promise<string | Buffer> {
    return "";
  }

  async realpath(
    path: string,
    options?:
      | string
      | {
          encoding?: string;
        }
  ): Promise<string | Buffer> {
    return "";
  }

  async rename(oldpath: string, newpath: string): Promise<undefined> {}

  async rmdir(
    path: string,
    options?: {
      maxRetries?: number;
      recursive?: boolean;
      retryDelay?: number;
    }
  ): Promise<undefined> {}

  async rm(
    path: string,
    options?: {
      force?: boolean;
      maxRetries?: number;
      recursive?: boolean;
      retryDelay?: number;
    }
  ): Promise<undefined> {}

  public stat = stat.bind(this);

  async statfs(
    path: string,
    options?: {
      bigint?: boolean;
    }
  ): Promise<StatFs> {
    return {} as StatFs;
  }

  async symlink(
    target: string,
    path: string,
    type: string | null = null
  ): Promise<undefined> {}

  async truncate(path: string, len: number = 0): Promise<undefined> {}

  async unlink(path: string): Promise<undefined> {}

  public utimes = utimes.bind(this);

  async watch(
    filename: string,
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
    path: string,
    data: string | Buffer,
    options?:
      | string
      | {
          encoding?: string;
          mode?: number;
          flag?: string;
          signal?: AbortSignal;
        }
  ): Promise<undefined> {}
}

import { access } from "../functions/access";
import { appendFile } from "../functions/appendFile";
import { chmod } from "../functions/chmod";
import { chown } from "../functions/chown";
import { copyFile } from "../functions/copyFile";
import { cp } from "../functions/cp";
import { link } from "../functions/link";
import { mkdir } from "../functions/mkdir";
import { stat } from "../functions/stat";
import { utimes } from "../functions/utimes";
import { IDBProvider } from "../util/IDBProvider";
import { constants } from "../util/constants";
import { randomSuffix } from "../util/random";
import { FSProvider } from "./FSProvider";
import { StatFs } from "./StatFs";
import { Stats } from "./Stats";

export class FileSystem {
  // Internal
  public readonly provider: FSProvider;
  public readonly uid: number;
  public readonly gid: number;
  public readonly cwd: string;

  // fs API
  public readonly constants = constants;
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

    this.uid = options.user ?? 0;
    this.gid = options.group ?? 0;
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

  public link = link.bind(this);

  public lstat = stat.bind(this);

  public mkdir = mkdir.bind(this);

  async mkdtemp(
    prefix: string,
    options?:
      | string
      | {
          encoding?: string;
        }
  ): Promise<undefined> {
    await mkdir.call(
      this,
      `/tmp/${prefix
        .replace(/[/\/]/g, "")
        .replace(/-?$/, "-")}${randomSuffix()}`,
      {
        recursive: true
      }
    );
  }

  async open(path: string, flags: string = "r", mode: number): Promise<void> {
    throw new Error("Not implemented.");
  }

  async opendir(
    path: string,
    options?: {
      encoding?: string;
      bufferSize?: number;
      recursive?: boolean;
    }
  ): Promise<void | AsyncIterable<void | void>> {
    throw new Error("Not implemented.");
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
  ): Promise<string[] | void> {
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
  ): Promise<string | Uint8Array> {
    return "";
  }

  async readlink(
    path: string,
    options?:
      | string
      | {
          encoding?: string;
        }
  ): Promise<string | Uint8Array> {
    return "";
  }

  async realpath(
    path: string,
    options?:
      | string
      | {
          encoding?: string;
        }
  ): Promise<string | Uint8Array> {
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
      filename: string | Uint8Array;
    }>
  > {
    return {} as any;
  }

  async writeFile(
    path: string,
    data: string | Uint8Array,
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

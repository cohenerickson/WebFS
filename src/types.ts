import { constants } from "./util/constants";

type BaseMeta = {
  id: number;
  name: string;
  type: number;
  permissions: number;
  nlinks: number[];
  created: Date;
  modified: Date;
  changed: Date;
  accessed: Date;
  uid: number;
  gid: number;
};

export type Directory<IsTree extends boolean = false> = BaseMeta & {
  type: typeof constants.S_IFDIR;
  children: IsTree extends true ? Entry<true>[] : number[];
};

export type Symlink = BaseMeta & {
  type: typeof constants.S_IFLNK;
  target: number;
};

export type File = BaseMeta & {
  type: typeof constants.S_IFREG;
  data: number;
};

export type Entry<IsTree extends boolean = false> =
  | Directory<IsTree>
  | Symlink
  | File;

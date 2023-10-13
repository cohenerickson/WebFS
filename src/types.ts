type BaseMeta = {
  id: number;
  name: string;
  type: string;
  permissions: number;
  created: Date;
  modified: Date;
  accessed: Date;
  owner: number;
  group: number;
};

export type Directory<IsTree extends boolean = false> = BaseMeta & {
  type: "directory";
  children: IsTree extends true ? Entry<true>[] : number[];
};

export type Symlink = BaseMeta & {
  type: "symlink";
  target: number;
};

export type File = BaseMeta & {
  type: "file";
  data: number;
};

export type Entry<IsTree extends boolean = false> =
  | Directory<IsTree>
  | Symlink
  | File;

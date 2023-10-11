export type File = {
  id: string;
  path: string;
  type: "file" | "directory" | "symlink";
  permissions: number;
  created: Date;
  modified: Date;
  accessed: Date;
  owner: string;
  group: string;
} & {
  type: "file" | "symlink";
  target: string;
};

export type User = {
  id: string;
  name: string;
  password: string | null;
  groups: string[];
  created: Date;
  lastLogin: Date;
};

export type Group = {
  id: string;
  name: string;
  created: Date;
};

import { Directory, Entry, File } from "../types";
import { EventEmitter } from "events";
import TypedEmitter from "typed-emitter";

type Events = {
  "entry.set": (entry: Entry) => void;
  "content.get": (file: File) => void;
  "content.set": (file: File, content: Uint8Array) => void;
  ready: () => void;
};

export abstract class FSProvider extends (EventEmitter as new () => TypedEmitter<Events>) {
  /**
   * The name of the file system
   */
  readonly name: string;

  /**
   * Creates a new file system provider
   *
   * @param name The name of the file system
   */
  constructor(name: string) {
    super();

    this.name = name;
  }

  /**
   * Gets the full tree of the file system from the root
   *
   * @returns The root tree directory
   */
  abstract getTree(): Promise<Directory<true>>;

  /**
   * Gets a subtree of the file system from the given id
   *
   * @param id The id of a directory
   * @returns The subtree directory
   */
  abstract getSubTree(id: number): Promise<Entry<true>>;

  /**
   * Gets an entry from the file system
   * <p>
   * This should also resolve any symlinks
   *
   * @param id The id of the entry
   * @returns The entry or undefined if it doesn't exist
   */
  abstract getEntry(id: number): Promise<Entry | undefined>;

  /**
   * Finds an entry in the file system
   *
   * @param path The path of the entry
   * @returns The entry or undefined if it doesn't exist
   */
  abstract findEntry(path: string): Promise<Entry | undefined>;

  /**
   * Sets an entry in the file system
   * <p>
   * This should also update the modified date of the entry and emit the "entry.set" event
   *
   * @param entry The entry to set
   */
  abstract setEntry(entry: Entry): Promise<void>;

  /**
   * Gets the content of a file
   * <p>
   * This should also update the accessed date of the file and emit the "content.get" event
   *
   * @param file The file to get the content of
   * @returns The content of the file or undefined if it doesn't exist
   */
  abstract getContent(file: File): Promise<Uint8Array | undefined>;

  /**
   * Sets the content of a file
   * <p>
   * This should also update the modified date of the file and emit the "content.set" event
   *
   * @param file The file to set the content of
   * @param content The content to set
   */
  abstract setContent(file: File, content: Uint8Array): Promise<void>;
}

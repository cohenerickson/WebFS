import { FileSystem, IDBProvider } from "../src/index";

// Name is passed to the DBProvider
const provider = new IDBProvider("mydb");

const fs = new FileSystem({
  provider
});

await fs.mkdir("/test");
await fs.writeFile("/test/test.txt", "Hello World!");

console.log(await fs.readFile("/test/test.txt", "utf8"));
// "Hello World!"

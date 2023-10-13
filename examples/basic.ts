import { FileSystem } from "../src/index";

const fs = new FileSystem();

await fs.mkdir("/test");
await fs.writeFile("/test/test.txt", "Hello World!");

console.log(await fs.readFile("/test/test.txt", "utf8"));
// "Hello World!"

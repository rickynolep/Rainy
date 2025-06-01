import fs from "fs";
import path from "path";
import archiver from "archiver";

const now = new Date();
const minutes = now.getMinutes().toString().padStart(2, "0");
const hour = now.getHours().toString().padStart(2, "0");
const date = now.getDate();
const month = now.getMonth() + 1;
const year = now.getFullYear();

const version = "2";
const zipName = `Rainy v${version}.${year % 100}.${month}.${date} (${hour}.${minutes}).zip`;
const outputDir = "export";
const outputPath = path.join(outputDir, zipName);
if (!fs.existsSync(outputDir)) {fs.mkdirSync(outputDir);}

const output = fs.createWriteStream(outputPath);
// @ts-ignore <-- bener kok harusnya engga pake vending
const archive = archiver("zip", { zlib: { level: 9 } });

output.on("close", () => {console.log(`Finished compressing ${zipName}. Total size: ${archive.pointer()} bytes`)});
archive.on("error", (err) => {throw err});

archive.pipe(output);
archive.directory("dist/", "dist"); 
archive.file("package.json", { name: "package.json" });
archive.file(".env", { name: ".env" });
archive.finalize();
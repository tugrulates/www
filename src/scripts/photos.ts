import fs from "fs";
import { ExifDateTime, ExifTool, exiftool } from "exiftool-vendored";

const DIR = "src/content/photos";

const files = fs.readdirSync(DIR);

interface PhotoData {
  image: string;
  title: string;
  description: string;
}

async function extractMetadata(file: string) {
  const tags = await exiftool.read(`${DIR}/${file}`);
  const data: PhotoData = {
    image: `./${tags.FileName ?? ""}`,
    title: tags.Title ?? "",
    description: tags.Description ?? "",
  };
  const json = JSON.stringify(data, null, 2);
  fs.writeFileSync(`${DIR}/${file.replace(".jpg", ".json")}`, json);
  console.log(data);
  console.log(tags);
}

Promise.all(
  files.map((file) => {
    if (file.endsWith(".jpg")) {
      return extractMetadata(file);
    }
  }),
).finally(() => {
  exiftool.end();
});

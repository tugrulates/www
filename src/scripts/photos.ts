import path from "path";
import fs from "fs";
import { glob } from "glob";
import { ExifDateTime, exiftool } from "exiftool-vendored";

const DIR = "src/content/photos";

interface PhotoData {
  cover: string;
  square: string;
  title: string;
  description: string;
  date: string;
  location: string;
  city: string;
  state: string;
  country: string;
}

async function extractMetadata(photo: string) {
  const cover = `${DIR}/${photo}/cover.jpg`;
  const tags = await exiftool.read(cover);
  const file = `./${photo}/${tags.FileName ?? ""}`;
  const data: PhotoData = {
    cover: file,
    square: file.replace("/cover.jpg", "/square.jpg"),
    title: tags.Headline ?? "",
    description: tags.ImageDescription ?? "",
    date:
      (tags.CreateDate instanceof ExifDateTime
        ? tags.CreateDate.toDate().toISOString()
        : tags.CreateDate) ?? "",
    location: tags.Location ?? "",
    city: tags.City ?? "",
    state: tags.State ?? "",
    country: tags.Country ?? "",
  };
  const json = JSON.stringify(data, null, 2);
  console.log(tags);
  console.log(json);
  fs.writeFileSync(`${DIR}/${photo}.json`, json);
}

const covers = glob.sync(`${DIR}/*/cover.jpg`);
const photos = covers.map((cover) => {
  const photo = path.dirname(cover).split("/").pop();
  return photo;
});
Promise.all(
  photos.map((photo) => {
    if (photo) {
      return extractMetadata(photo);
    }
  }),
).finally(() => {
  exiftool.end();
});

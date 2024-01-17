import path from "path";
import fs from "fs/promises";
import { glob } from "glob";
import { ExifDateTime, exiftool, type Tags } from "exiftool-vendored";

const IMAGES_DIR = "src/photos";
const CONTENT_DIR = "src/content/photos";

export interface PhotoTags extends Tags {
  License?: string;
  AttributionName?: string;
  AttributionURL?: string;
}

interface PhotoData {
  cover: string;
  square: string;
  title: string;
  description: string;
  keywords: string[];
  date: string;
  location: string;
  city: string;
  state: string;
  country: string;
  camera: string;
  lens: string;
  editing: string;
  license_name: string;
  license_url: string;
  attribution_name: string;
  attribution_url: string;
}

async function extractMetadata(photo: string) {
  const cover = `${IMAGES_DIR}/${photo}/cover.jpg`;
  return exiftool.read<PhotoTags>(cover).then((tags) => {
    const data: PhotoData = {
      cover: `../../photos/${photo}/cover.jpg`,
      square: `../../photos/${photo}/square.jpg`,
      title: tags.Headline ?? "",
      description: tags.ImageDescription ?? "",
      keywords: Array.isArray(tags.Keywords)
        ? tags.Keywords
        : [tags.Keywords ?? ""],
      date:
        (tags.CreateDate instanceof ExifDateTime
          ? tags.CreateDate.toDate().toISOString()
          : tags.CreateDate) ?? "",
      location: tags.Location ?? "",
      city: tags.City ?? "",
      state: tags.State ?? "",
      country: tags.Country ?? "",
      camera: `${tags.Make ?? ""} ${tags.Model ?? ""}`.replace(/\s+/g, " "),
      lens: tags.LensModel ?? tags.Lens ?? "",
      editing: "Affinity Photo 2",
      license_name: "CC BY 4.0",
      license_url: tags.License ?? "",
      attribution_name: tags.AttributionName ?? "",
      attribution_url: tags.AttributionURL ?? "",
    };
    const json = JSON.stringify(data, null, 2);
    fs.writeFile(`${CONTENT_DIR}/${photo}.json`, json);
  });
}

const covers = glob.sync(`${IMAGES_DIR}/*/cover.jpg`);
const photos = covers.map((cover) => {
  const photo = path.dirname(cover).split("/").pop();
  return photo;
});

await fs
  .stat(CONTENT_DIR)
  .catch((error) => {
    if (error.code === "ENOENT") {
      fs.mkdir(CONTENT_DIR);
      return;
    }
    throw error;
  })
  .then(() =>
    Promise.all(
      photos.map((photo) => {
        if (photo) {
          return extractMetadata(photo);
        }
      }),
    ),
  )
  .finally(() => {
    exiftool.end();
  });

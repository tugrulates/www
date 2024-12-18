import { ExifDateTime, exiftool, type Tags } from "exiftool-vendored";
import fs from "fs/promises";
import { glob } from "glob";
import path from "path";

const IMAGES_DIR = "src/photos";
const CONTENT_DIR = "src/content/photos";

export interface PhotoTags extends Tags {
  State?: string;
  License?: string;
}

interface PhotoData {
  wide: string;
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
  license: string;
}

async function extractMetadata(photo: string): Promise<void> {
  const cover = `${IMAGES_DIR}/${photo}/wide.jpg`;
  await exiftool.read<PhotoTags>(cover).then(async (tags) => {
    const data: PhotoData = {
      wide: `../../photos/${photo}/wide.jpg`,
      square: `../../photos/${photo}/square.jpg`,
      title: tags.Headline ?? "",
      description: tags.ImageDescription ?? "",
      keywords: Array.isArray(tags.Keywords)
        ? tags.Keywords
        : [tags.Keywords ?? ""],
      date:
        (tags.DateTimeOriginal instanceof ExifDateTime
          ? tags.DateTimeOriginal.toDate().toISOString()
          : tags.DateTimeOriginal) ?? "",
      location: tags.Location ?? "",
      city: tags.City ?? "",
      state: tags.State ?? "",
      country: tags.Country ?? "",
      camera: `${tags.Make ?? ""} ${tags.Model ?? ""}`.replace(/\s+/g, " "),
      lens: tags.LensModel ?? tags.Lens ?? "",
      editing: Array.isArray(tags.History)
        ? (tags.History.filter((item) => item.Action === "produced")[0]
            .SoftwareAgent ?? "")
        : "",
      license: tags.License ?? "",
    };
    const json = JSON.stringify(data, null, 2);
    await fs.writeFile(`${CONTENT_DIR}/${photo}.json`, json);
  });
}

const covers = glob.sync(`${IMAGES_DIR}/*/wide.jpg`);
const photos = covers.map((cover) => {
  const photo = path.dirname(cover).split("/").pop();
  if (photo == null) {
    throw new Error("Could not get photo name");
  }
  return photo;
});

await fs
  .stat(CONTENT_DIR)
  .catch(async (error) => {
    if (error.code === "ENOENT") {
      await fs.mkdir(CONTENT_DIR);
      return;
    }
    throw error;
  })
  .then(
    async () =>
      await Promise.all(
        photos.map(async (photo) => {
          await extractMetadata(photo);
        }),
      ),
  )
  .then(async () => {
    await exiftool.end();
  });

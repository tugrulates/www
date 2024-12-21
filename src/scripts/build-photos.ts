import { expandGlob } from "jsr:@std/fs";
import { dirname } from "jsr:@std/path";
import { ExifDateTime, exiftool, type Tags } from "npm:exiftool-vendored";

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
    await Deno.writeTextFile(`${CONTENT_DIR}/${photo}.json`, json);
  });
}

try {
  Deno.mkdir(CONTENT_DIR, { recursive: true });
  for await (const cover of expandGlob(`${IMAGES_DIR}/*/wide.jpg`)) {
    const photo = dirname(cover.path).split("/").pop();
    if (!photo) throw new Error("Could not get photo name");
    await extractMetadata(photo);
  }
} finally {
  await exiftool.end();
}

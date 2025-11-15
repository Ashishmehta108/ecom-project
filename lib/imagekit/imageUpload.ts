import fs from "fs";
import Imagekit from "imagekit";
import path from "path";

export const client = new Imagekit({
  privateKey: process.env.IMAGE_KIT_PRIVATE_KEY!,
  publicKey: process.env.IMAGE_KIT_PUBLIC_KEY!,
  urlEndpoint: process.env.IMAGE_KIT_BASE_URL!,
});

export async function UploadImage(filePath: string, fileName: string) {
  try {
    const filePath = process.cwd() + "/public/menu.svg";
    const result = await client.upload({
      file: fs.createReadStream(filePath),
      fileName: "menu.svg",
      tags: ["tag1", "tag2"],
    });
    console.log(result);
    return result;
  } catch (error) {
    console.log(error);
    return error;
  }
}

const uploadFolder = path.join(process.cwd(), "/Techbar/hoco");

export async function uploadHocoImages() {
  try {
    const resp = [];
    const files = fs.readdirSync(uploadFolder);

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const fullPath = path.join(uploadFolder, file);

      if (!fs.statSync(fullPath).isFile()) continue;

      const fileStream = fs.createReadStream(fullPath);
      const fileName = `hoco_${i}${path.extname(file)}`;

      console.log(`Uploading → ${fileName}`);

      const result = await client.upload({
        file: fileStream,
        fileName,
        tags: ["hoco", "techbar"],
      });
      resp.push(result);
      console.log("Uploaded:", result.fileId, result.url);
    }
return resp
    console.log("All files uploaded successfully!");
  } catch (error) {
    console.error("Upload failed:", error);
  }
}

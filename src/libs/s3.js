import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
  GetObjectCommand
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import multer from "multer";
import { v4 as uuidv4 } from "uuid";

// Configure Cloudflare R2 client
const s3Client = new S3Client({
  endpoint: process.env.R2_ENDPOINT,
  region: "auto",
  forcePathStyle: true,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.R2_SECRET_KEY,
  },
});

const BUCKET_NAME = process.env.R2_BUCKET_NAME;

export const upload = multer({ storage: multer.memoryStorage() });

// Upload to R2
// Upload to R2
export async function uploadToR2(fileBuffer, originalFilename, contentType) {
  if (!isValidImageType(contentType)) {
    throw new Error("Invalid image type");
  }

  const ext = originalFilename.split(".").pop();
  const key = `projects/${uuidv4()}.${ext}`;

  try {
    await s3Client.send(
      new PutObjectCommand({
        Bucket: BUCKET_NAME,
        Key: key,
        Body: fileBuffer,
        ContentType: contentType,
      })
    );

    const command = new GetObjectCommand({ Bucket: BUCKET_NAME, Key: key });
    const signedUrl = await getSignedUrl(s3Client, command, { expiresIn: 3600 });

    return { key, url: signedUrl };
  } catch (error) {
    console.error("R2 upload error:", error);
    throw new Error("Failed to upload image");
  }
}

// Delete from R2
export async function deleteFromR2(imageKeyOrUrl) {
  try {
    let key = imageKeyOrUrl;

    // If it's a full URL, try to extract the key
    if (imageKeyOrUrl.startsWith("http")) {
      try {
        const url = new URL(imageKeyOrUrl);
        // Remove leading slash
        let path = url.pathname.replace(/^\/+/, "");

        // If the path starts with the bucket name (common with forcePathStyle and some R2 endpoints), remove it
        if (path.startsWith(`${BUCKET_NAME}/`)) {
          path = path.replace(`${BUCKET_NAME}/`, "");
        }

        key = path;
      } catch (e) {
        // If URL parsing fails, assume it might be a key or just proceed with what we have
        console.warn("Could not parse URL, using as key:", imageKeyOrUrl);
      }
    }

    const command = new DeleteObjectCommand({
      Bucket: process.env.R2_BUCKET_NAME,
      Key: key,
    });

    await s3Client.send(command);
    console.log(`Deleted ${key} from R2`);

  } catch (error) {
    console.error("R2 delete error:", error);
    throw new Error("Failed to delete image");
  }
}

// Generate signed URL from R2
export async function getSignedUrlFromR2(key, expiresIn = 3600) {
  const command = new GetObjectCommand({ Bucket: BUCKET_NAME, Key: key });
  return await getSignedUrl(s3Client, command, { expiresIn });
}

// //working 16/02/2026
export async function updateUserImage(
  objectKey,
  fileBuffer,
  originalFilename,
  contentType
) {
  if (!isValidImageType(contentType)) {
    throw new Error("Invalid image type");
  }

  try {
    await s3Client.send(
      new PutObjectCommand({
        Bucket: process.env.R2_BUCKET_NAME,
        Key: objectKey, // e.g. "aimock/projects/07ac03ea-d274-436c-bc56-e17868086e62.png"
        Body: fileBuffer,
        ContentType: contentType,
      })
    );

    console.log(`Updated ${objectKey} in R2`);
    return { success: true, key: objectKey };

  } catch (error) {
    console.error("R2 update error:", error);
    throw new Error("Failed to update user image");
  }
}
// Validate image types
export function isValidImageType(contentType) {
  return ["image/jpeg", "image/jpg", "image/png", "image/webp", "image/gif"]
    .includes(contentType.toLowerCase());
}
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

 
    return signedUrl;
  } catch (error) {
    console.error("R2 upload error:", error);
    throw new Error("Failed to upload image");
  }
}


// Delete from R2
export async function deleteFromR2(imageUrl) {
  try {
    const url = new URL(imageUrl);
    const key = url.pathname.slice(1);

    await s3Client.send(
      new DeleteObjectCommand({
        Bucket: BUCKET_NAME,
        Key: key,
      })
    );
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


// Validate image types
export function isValidImageType(contentType) {
  return ["image/jpeg", "image/jpg", "image/png", "image/webp", "image/gif"]
    .includes(contentType.toLowerCase());
}
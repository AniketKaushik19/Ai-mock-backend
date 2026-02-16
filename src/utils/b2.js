// import {
//   S3Client,
//   PutObjectCommand,
//   GetObjectCommand,
//   DeleteObjectCommand,
// } from "@aws-sdk/client-s3";
// import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
// import multer from "multer";

// const s3 = new S3Client({
//   region: "us-east-001", // dummy region (B2 ignores this)
//   endpoint: "https://s3.eu-central-003.backblazeb2.com", // change to your bucket region
//   credentials: {
//     accessKeyId: process.env.B2_KEY_ID,
//     secretAccessKey: process.env.B2_APPLICATION_KEY,
//   },
//   forcePathStyle: true,
// });

// const BUCKET = process.env.B2_BUCKET_NAME;


// export const upload = multer({ storage: multer.memoryStorage() });

// export async function uploadToB2({ key, body, contentType }) {
//   return s3.send(
//     new PutObjectCommand({
//       Bucket: BUCKET,
//       Key: key,
//       Body: body,
//       ContentType: contentType,
//     })
//   );
// }

// export async function deleteFromB2(key) {
//   return s3.send(
//     new DeleteObjectCommand({
//       Bucket: BUCKET,
//       Key: key,
//     })
//   );
// }

// export async function getSignedUrlFromB2(key, expiresIn = 3600) {
//   const command = new GetObjectCommand({ Bucket: BUCKET, Key: key });
//   return getSignedUrl(s3, command, { expiresIn });
// }

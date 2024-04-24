import { GetObjectCommand, S3Client } from '@aws-sdk/client-s3';

const runtimeConfig = useRuntimeConfig();
const contentsBucketName = runtimeConfig.contents_bucket_name;
const contentsKeyPrefix = runtimeConfig.contents_key_prefix;
const s3Client = new S3Client();

export const fetchWebContent = async (filePath: string) => {
    const command = new GetObjectCommand({
        Bucket: contentsBucketName,
        Key: `${contentsKeyPrefix}${filePath}`,
    });
    return await s3Client.send(command)
        .then(response => response.Body!.transformToWebStream())
        .catch(e => {
            console.log(e);
            throw e;
        });
}
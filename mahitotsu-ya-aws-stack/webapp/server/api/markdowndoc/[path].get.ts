import { GetObjectCommand, S3Client } from '@aws-sdk/client-s3';
import * as AWSXRay from 'aws-xray-sdk';
import markdownit from 'markdown-it';

export default defineEventHandler(async (event) => {

    const bucket = process.env.CONTENT_BUCKET_NAME;
    const prefix = process.env.CONTENT_OBJECT_PREFIX;
    const nodeEnv = process.env.NODE_ENV;
    const path = event.context.params!.path;
    const mdit = markdownit();

    if ("production" === nodeEnv && bucket && prefix) {
        const s3Client = AWSXRay.captureAWSv3Client(new S3Client());
        const command = new GetObjectCommand({
            Bucket: bucket,
            Key: `${prefix}${path}.md`,
        });
        return await s3Client.send(command).then(response => response.Body?.transformToString()).then(text => text ? mdit.render(text) : "");
    } else if ("development" === nodeEnv) {
        return await fetch(`http://localhost:3000/_content/${path}.md`).then(res => res.text()).then(text => mdit.render(text));
    } else {
        return "";
    }
});
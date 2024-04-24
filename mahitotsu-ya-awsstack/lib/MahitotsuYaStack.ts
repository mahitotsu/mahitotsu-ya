import { CfnOutput, DockerImage, Duration, RemovalPolicy, Stack, StackProps } from "aws-cdk-lib";
import { AttributeType, BillingMode, Table } from "aws-cdk-lib/aws-dynamodb";
import { Effect, PolicyStatement } from "aws-cdk-lib/aws-iam";
import { FunctionUrlAuthType, InvokeMode, Runtime } from "aws-cdk-lib/aws-lambda";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import { BlockPublicAccess, Bucket } from "aws-cdk-lib/aws-s3";
import { BucketDeployment, Source } from "aws-cdk-lib/aws-s3-deployment";
import { Construct } from "constructs";

export class MahitotsuYaStack extends Stack {
    constructor(scope: Construct, id: string, props: StackProps) {
        super(scope, id, props);

        const contentsBucket = new Bucket(this, 'ContentsBucket', {
            publicReadAccess: false,
            blockPublicAccess: BlockPublicAccess.BLOCK_ALL,
            autoDeleteObjects: true,
            removalPolicy: RemovalPolicy.DESTROY,
        });
        const contentsDeployment = new BucketDeployment(contentsBucket, 'Deployment', {
            destinationBucket: contentsBucket,
            destinationKeyPrefix: '',
            sources: [Source.asset(`${__dirname}/../../mahitotsu-ya-website`, {
                bundling: {
                    image: DockerImage.fromRegistry('public.ecr.aws/docker/library/node:20-bullseye-slim'),
                    user: '1000:1000',
                    command: ['sh', '-c', [
                        'npm i',
                        'npm run build',
                        'cp -r ./.output/public /asset-output'
                    ].join(' && ')]
                }
            })]
        });

        const sessionTable = new Table(this, 'SessionTable', {
            partitionKey: { name: 'id', type: AttributeType.STRING },
            sortKey: { name: 'type', type: AttributeType.STRING },
            billingMode: BillingMode.PAY_PER_REQUEST,
        });

        const webServer = new NodejsFunction(this, 'WebServer', {
            entry: `${__dirname}/../../mahitotsu-ya-website/.output/server/index.mjs`,
            runtime: Runtime.NODEJS_20_X,
            memorySize: 256,
            timeout: Duration.minutes(1),
            environment: {
                'NUXT_CONTENTS_BUCKET_NAME': contentsBucket.bucketName,
                'NUXT_CONTENTS_KEY_PREFIX': 'public',
                'NUXT_SESSION_TABLE_NAME': sessionTable.tableName,
            },
        });
        contentsBucket.grantRead(webServer);
        sessionTable.grantReadWriteData(webServer);
        webServer.role!.addToPrincipalPolicy(new PolicyStatement({
            effect: Effect.ALLOW,
            actions: ['bedrock:InvokeModel'],
            resources: ['arn:aws:bedrock:us-east-1::foundation-model/anthropic.claude-3-haiku-20240307-v1:0'],
        }));

        const websiteUrl = webServer.addFunctionUrl({
            authType: FunctionUrlAuthType.NONE,
            invokeMode: InvokeMode.BUFFERED,
        });
        new CfnOutput(this, 'WebsiteUrl', { value: websiteUrl.url });
    }
}
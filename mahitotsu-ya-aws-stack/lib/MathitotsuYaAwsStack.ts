import { CfnOutput, DockerImage, RemovalPolicy, ScopedAws, Stack, StackProps } from "aws-cdk-lib";
import { AllowedMethods, CachePolicy, CfnDistribution, CfnOriginAccessControl, Distribution } from "aws-cdk-lib/aws-cloudfront";
import { FunctionUrlOrigin, S3Origin } from "aws-cdk-lib/aws-cloudfront-origins";
import { Effect, PolicyStatement, ServicePrincipal } from "aws-cdk-lib/aws-iam";
import { FunctionUrlAuthType, InvokeMode, Runtime } from "aws-cdk-lib/aws-lambda";
import { NodejsFunction, OutputFormat } from "aws-cdk-lib/aws-lambda-nodejs";
import { BlockPublicAccess, Bucket } from "aws-cdk-lib/aws-s3";
import { BucketDeployment, Source } from "aws-cdk-lib/aws-s3-deployment";
import { Construct } from "constructs";

export class MahitotsuYaAwsStack extends Stack {
    constructor(scope: Construct, id: string, props: StackProps) {
        super(scope, id, props);
        const { accountId } = new ScopedAws(this);

        const webappStatic = new Bucket(this, 'WebappStatic', {
            publicReadAccess: false,
            blockPublicAccess: BlockPublicAccess.BLOCK_ALL,
            autoDeleteObjects: true,
            removalPolicy: RemovalPolicy.DESTROY,
        });
        const webappStaticDeployment = new BucketDeployment(webappStatic, 'BucketDeployment', {
            destinationBucket: webappStatic,
            destinationKeyPrefix: '',
            retainOnDelete: false,
            sources: [Source.asset(`${__dirname}/../webapp/`, {
                bundling: {
                    image: DockerImage.fromRegistry('public.ecr.aws/docker/library/node:20-bullseye-slim'),
                    command: ['sh', '-c', [
                        'npm run build',
                        'cp -r ./.output/public /asset-output',
                    ].join(' && ')],
                },
            })],
        });
        const cfnWebappStaticOAC = new CfnOriginAccessControl(webappStatic, 'OAC', {
            originAccessControlConfig: {
                name: 'OAC for S3 Bucket as Webapp Static',
                originAccessControlOriginType: 's3',
                signingProtocol: 'sigv4',
                signingBehavior: 'always',
            }
        });

        const webappServer = new NodejsFunction(this, 'WebappServer', {
            entry: `${__dirname}/../webapp/.output/server/index.mjs`,
            runtime: Runtime.NODEJS_20_X,
            memorySize: 128,
            bundling: {
                format: OutputFormat.ESM,
            }
        });
        webappServer.node.addDependency(webappStaticDeployment);
        const webappServerUrl = webappServer.addFunctionUrl({
            invokeMode: InvokeMode.BUFFERED,
            authType: FunctionUrlAuthType.AWS_IAM,
        });
        const cfnWebappServerOAC = new CfnOriginAccessControl(webappServerUrl, 'OAC', {
            originAccessControlConfig: {
                name: 'OAC for Function URL as Webapp Server',
                originAccessControlOriginType: 'lambda',
                signingProtocol: 'sigv4',
                signingBehavior: 'always',
            }
        });

        const webappDistribution = new Distribution(this, 'WebappDistribution', {
            defaultBehavior: {
                origin: new FunctionUrlOrigin(webappServerUrl),
                cachePolicy: CachePolicy.CACHING_DISABLED,
                allowedMethods: AllowedMethods.ALLOW_GET_HEAD_OPTIONS,
            },
            additionalBehaviors: {
                '/_nuxt/*': {
                    origin: new S3Origin(webappStatic, { originPath: '/public' }),
                    cachePolicy: CachePolicy.CACHING_DISABLED,
                    allowedMethods: AllowedMethods.ALLOW_GET_HEAD_OPTIONS,
                },
                '/api/_content/cache.*.json': {
                    origin: new S3Origin(webappStatic, { originPath: '/public' }),
                    cachePolicy: CachePolicy.CACHING_DISABLED,
                    allowedMethods: AllowedMethods.ALLOW_GET_HEAD_OPTIONS,
                },
            },
        });
        const cfnWebappDistribution = webappDistribution.node.defaultChild as CfnDistribution;

        cfnWebappDistribution.addPropertyOverride('DistributionConfig.Origins.0.OriginAccessControlId', cfnWebappServerOAC.attrId);
        webappServer.addPermission('AllowCloudFrontServicePrincipal', {
            principal: new ServicePrincipal('cloudfront.amazonaws.com'),
            action: 'lambda:InvokeFunctionUrl',
            sourceArn: `arn:aws:cloudfront::${accountId}:distribution/${webappDistribution.distributionId}`,
        });

        cfnWebappDistribution.addPropertyOverride('DistributionConfig.Origins.1.S3OriginConfig.OriginAccessIdentity', '');
        cfnWebappDistribution.addPropertyOverride('DistributionConfig.Origins.1.OriginAccessControlId', cfnWebappStaticOAC.attrId);
        webappStatic.addToResourcePolicy(new PolicyStatement({
            effect: Effect.ALLOW,
            principals: [new ServicePrincipal('cloudfront.amazonaws.com')],
            actions: ['s3:GetObject'],
            resources: [
                webappStatic.arnForObjects('public/_nuxt/*'),
                webappStatic.arnForObjects('public/api/_content/*'),
            ],
            conditions: {
                'StringEquals': {
                    'AWS:SourceArn': `arn:aws:cloudfront::${accountId}:distribution/${webappDistribution.distributionId}`,
                }
            }
        }));

        new CfnOutput(this, 'WebappEndpointUrl', { value: `https://${webappDistribution.domainName}` });
    }
}
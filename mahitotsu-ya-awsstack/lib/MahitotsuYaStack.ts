import { CfnOutput, DockerImage, Duration, RemovalPolicy, ScopedAws, Stack, StackProps } from "aws-cdk-lib";
import { AttributeType, BillingMode, Table } from "aws-cdk-lib/aws-dynamodb";
import { Effect, PolicyStatement, Role } from "aws-cdk-lib/aws-iam";
import { FunctionUrlAuthType, InvokeMode, Runtime } from "aws-cdk-lib/aws-lambda";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import { BlockPublicAccess, Bucket } from "aws-cdk-lib/aws-s3";
import { BucketDeployment, Source } from "aws-cdk-lib/aws-s3-deployment";
import { CfnInclude } from "aws-cdk-lib/cloudformation-include";
import { Construct } from "constructs";

export class MahitotsuYaStack extends Stack {
    constructor(scope: Construct, id: string, props: StackProps) {
        super(scope, id, props);
        const { accountId, region } = new ScopedAws(this);

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

        const knowledgeBaseRole = Role.fromRoleArn(this, 'KnowledgeBaseRole',
            'arn:aws:iam::346929044083:role/service-role/AmazonBedrockExecutionRoleForKnowledgeBase_ytvpk');
        const agentRole = Role.fromRoleArn(this, 'AgentRole',
            'arn:aws:iam::346929044083:role/service-role/AmazonBedrockExecutionRoleForAgents_ETA1P5W764');
        const knowledgeBaseId = '4TYP5E01QQ';
        const agentTemplate = new CfnInclude(this, 'MahitotsuYaAgent', {
            templateFile: `${__dirname}/BedrockAgent.yaml`,
            parameters: {
                KnowledgeBaseRole: knowledgeBaseRole.roleArn,
                AgentRoleArn: agentRole.roleArn,
                KnowledgeBaseId: knowledgeBaseId,
            }
        });
        const agent = agentTemplate.getResource('MahitotsuYaAgent');
        const agentAlias = agentTemplate.getResource('MahitotsuYaAgentAlias');
        agentRole.addToPrincipalPolicy(new PolicyStatement({
            effect: Effect.ALLOW,
            actions: ['bedrock:Retrieve'],
            resources: [`arn:aws:bedrock:${region}:${accountId}:knowledge-base/${knowledgeBaseId}`]
        }));

        const webServer = new NodejsFunction(this, 'WebServer', {
            entry: `${__dirname}/../../mahitotsu-ya-website/.output/server/index.mjs`,
            runtime: Runtime.NODEJS_20_X,
            memorySize: 256,
            timeout: Duration.minutes(1),
            environment: {
                NUXT_CONTENTS_BUCKET_NAME: contentsBucket.bucketName,
                NUXT_CONTENTS_KEY_PREFIX: 'public',
                NUXT_SESSION_TABLE_NAME: sessionTable.tableName,
                NUXT_AGENT_ID: agent.ref,
                NUXT_AGENT_ALIAS_ID: agentAlias.getAtt('AgentAliasId').toString(),
            },
        });
        contentsBucket.grantRead(webServer);
        sessionTable.grantReadWriteData(webServer);
        webServer.role!.addToPrincipalPolicy(new PolicyStatement({
            effect: Effect.ALLOW,
            actions: ['bedrock:InvokeAgent'],
            resources: [agentAlias.getAtt('AgentAliasArn').toString()],
        }));

        const websiteUrl = webServer.addFunctionUrl({
            authType: FunctionUrlAuthType.NONE,
            invokeMode: InvokeMode.BUFFERED,
        });

        const agentAction = new NodejsFunction(this, 'AgentAction', {
            entry: `${__dirname}/AgentToApiFunction.ts`,
            runtime: Runtime.NODEJS_20_X,
            memorySize: 128,
            timeout: Duration.minutes(1),
            environment: {
                API_BASE_URL: `${websiteUrl.url}`,
            }
        });
        agentAction.grantInvoke(agentRole);

        new CfnOutput(this, 'WebsiteUrl', { value: websiteUrl.url });
    }
}
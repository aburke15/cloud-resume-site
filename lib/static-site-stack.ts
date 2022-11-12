import * as cdk from 'aws-cdk-lib';
import { RemovalPolicy } from 'aws-cdk-lib';
import { DnsValidatedCertificate } from 'aws-cdk-lib/aws-certificatemanager';

interface IStaticSiteProps extends cdk.StackProps {
  domainName: string;
  subDomainName: string;
  env: cdk.Environment;
}

export class StaticSiteStack extends cdk.Stack {
  constructor(parent: cdk.App, id: string, props: IStaticSiteProps) {
    super(parent, id, props);

    const zone = cdk.aws_route53.HostedZone.fromLookup(this, 'Zone', {
      domainName: props.domainName,
    });

    const siteDomain: string = `${props.subDomainName}.${props.domainName}`;

    new cdk.CfnOutput(this, 'Site', {
      value: `https://${siteDomain}`,
    });

    const siteBucket = new cdk.aws_s3.Bucket(this, 'SiteBucket', {
      websiteIndexDocument: 'index.html',
      publicReadAccess: true,
      autoDeleteObjects: false,
      removalPolicy: RemovalPolicy.DESTROY,
    });

    new cdk.CfnOutput(this, 'Bucket', {
      value: siteBucket.bucketName,
    });

    const certificateArn = new DnsValidatedCertificate(this, 'SiteCertificate', {
      domainName: siteDomain,
      hostedZone: zone,
      region: 'us-east-1',
    }).certificateArn;

    new cdk.CfnOutput(this, 'Certificate', {
      value: certificateArn,
    });
  }
}

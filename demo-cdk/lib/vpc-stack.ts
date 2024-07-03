
import { BuildSchemaType, CommonSchemaType } from '../../common-config/lib/schema';
import { Stack, StackProps, Tags } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as ec2 from 'aws-cdk-lib/aws-ec2';


export class VpcStack extends Stack {
  constructor(scope: Construct, id: string, buildConfig: BuildSchemaType, commonConfig: CommonSchemaType, props?: StackProps,) {
    super(scope, id, props);
    const vpc = new ec2.Vpc(this, 'vpc', {
      maxAzs: buildConfig.Networking.MaxAzs,
      ipAddresses: ec2.IpAddresses.cidr(buildConfig.Networking.VPCCidr),
      vpcName: commonConfig.App + "-" + buildConfig.Environment + "-vpc",
      subnetConfiguration: [
        {
          cidrMask: 23,
          name: 'public',
          subnetType: ec2.SubnetType.PUBLIC,
        },
        {
          cidrMask: 23,
          name: 'private',
          subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS,
        }
      ]
    })

    // Tagging all subnetfor EKSKSTags
    if (buildConfig.Networking.EKSTags) {
      for (const subnet of vpc.publicSubnets) {
        Tags.of(subnet).add(
          "kubernetes.io/role/elb",
          "1",
        );
      }
      for (const subnet of vpc.privateSubnets) {
        Tags.of(subnet).add(
          "kubernetes.io/role/internal-elb",
          "1",
        );
      }
    }
  }
}

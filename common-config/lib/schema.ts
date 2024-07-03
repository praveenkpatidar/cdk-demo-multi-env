import { z } from 'zod';

// CommonConfig
export const commonSchema = z.object({
    App: z.string(),
    Project: z.string(),
    AWSRegion: z
        .literal('ap-southeast-2')
        .describe("Only AP Southeast 2 Allowed"),
}).strict();

// Define the schema for EKS
const eksSchema = z.object({
    EKSVersion: z.string(),
    CoreNodeCount: z.number(),
}).strict();

// Define the schema for Networking
const networkingSchema = z.object({
    VPCCidr: z.string(),
    EKSTags: z.boolean(),
    MaxAzs: z.literal(2).or(z.literal(3)),
}).strict();

// Define the main schema
export const buildSchema = z.object({
    AWSAccountID: z.string(),
    Environment: z.string(),
    Eks: eksSchema,
    Networking: networkingSchema,
}).strict();


export type BuildSchemaType = z.infer<typeof buildSchema>;
export type CommonSchemaType = z.infer<typeof commonSchema>;

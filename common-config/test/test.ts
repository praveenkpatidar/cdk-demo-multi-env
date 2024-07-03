import { BuildSchemaType, CommonSchemaType, buildSchema, commonSchema } from '../lib/schema';
import { loadConfig } from '../lib/loadConfig';

const commonConfig: CommonSchemaType = loadConfig("common", commonSchema);
const devbuildConfig: BuildSchemaType = loadConfig("dev", buildSchema);
const testbuildConfig: BuildSchemaType = loadConfig("test", buildSchema);

console.log(commonConfig)
console.log(devbuildConfig)
console.log(testbuildConfig)

import * as fs from 'fs';
import * as yaml from 'js-yaml';
import * as z from 'zod';
import { zodToJsonSchema } from 'zod-to-json-schema';
import { buildSchema, commonSchema } from './schema';
import * as path from 'path';

function resolvePath(relativePath: string): string {
    const configPath = path.resolve(__dirname, relativePath)
    // Ensure the directory exists before writing the file
    const directory = path.dirname(configPath);
    if (!fs.existsSync(directory)) {
        fs.mkdirSync(directory, { recursive: true });
        console.log(`Directory created: ${configPath}`);
    }
    return configPath;
}

// Build Schema On everytime the Synth Called
const buildSchemaFiles = (env: string, schema: z.Schema) => {
    const jsonSchema = zodToJsonSchema(schema);
    if (env == "common") {
        fs.writeFileSync(resolvePath('../schemas/common-schema.json'), JSON.stringify(jsonSchema, null, 2), 'utf-8');
    } else {
        fs.writeFileSync(resolvePath('../schemas/build-schema.json'), JSON.stringify(jsonSchema, null, 2), 'utf-8');
    }
    console.log(`JSON Schema Generation Completed for ${env}`);
}

// Function to load and parse the YAML file
const loadYamlFile = (filePath: string) => {
    const fileContents = fs.readFileSync(filePath, 'utf8');
    return yaml.load(fileContents);
};

// Function to validate the parsed YAML data against the Zod schema
const validateYamlData = (data: any, schema: z.Schema) => {
    try {
        return schema.parse(data);
    } catch (error) {
        if (error instanceof z.ZodError) {
            console.error('Schema validation errors:', error.errors);
            throw error; // Rethrow to indicate validation failure
        } else {
            console.error('Unexpected error:', error);
            throw error; // Rethrow unexpected errors
        }
    }
};

// Main function to load, parse, and validate the YAML file
const loadConfig = (env: string, schema: z.Schema) => {
    try {
        buildSchemaFiles(env, schema);
        const data = loadYamlFile(resolvePath(`../configs/${env}.yaml`));
        const validatedData = validateYamlData(data, schema);
        console.log('YAML validation successful:', validatedData);
        return validatedData;
    } catch (error) {
        console.error('Failed to validate YAML file');
        console.error(error)
        process.exit(1); // Exit with failure code
    }
};
export { loadConfig }

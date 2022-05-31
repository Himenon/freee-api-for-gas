import * as fs from "fs";
import * as path from "path";
import fetch from "node-fetch";
import rimraf from "rimraf";
import { versions, outputDir } from "./config";

export const getKubernetesSwaggerSchema = async (version: string): Promise<any> => {
  const url = `https://raw.githubusercontent.com/freee/freee-api-schema/master/${version}/open-api-3/api-schema.json`;
  try {
    const res = await fetch(url);
    return res.json();
  } catch (error) {
    throw error as any;
  }
};

const main = async () => {
  const tempDir = `.tmp-${outputDir}`;
  fs.mkdirSync(tempDir, { recursive: true });
  rimraf.sync(outputDir);
  fs.mkdirSync(outputDir, { recursive: true });
  const tasks = versions.map(async version => {
    const result = await getKubernetesSwaggerSchema(version);
    // const swaggerFilename = path.join(tempDir, `swagger-${version}.json`);
    const openapiFilename = path.join(outputDir, `openapi-${version}.json`);
    fs.writeFileSync(openapiFilename, JSON.stringify(result, null, 2), { encoding: "utf-8" });
    // await convert(swaggerFilename, openapiFilename);
  });
  await Promise.all(tasks);
  rimraf.sync(tempDir);
};

main().catch(error => {
  console.error(error);
  process.exit(1);
});

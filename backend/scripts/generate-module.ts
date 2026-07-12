import fs from 'node:fs/promises';
import path from 'node:path';

async function main() {
  const moduleName = process.argv[2];

  if (!moduleName) {
    console.error('Usage: pnpm generate:module <module-name>');
    process.exit(1);
  }

  const className = toPascalCase(moduleName);

  const root = process.cwd();

  const moduleDir = path.join(root, 'src', 'modules', moduleName);

  await fs.mkdir(moduleDir, {
    recursive: true,
  });

  const serviceTemplate = `
import { Injectable } from '@nestjs/common';

@Injectable()
export class ${className}Service {}
`;

  const controllerTemplate = `
import { Controller } from '@nestjs/common';
import { ${className}Service } from './${moduleName}.service';

@Controller('${moduleName}')
export class ${className}Controller {
  constructor(
    private readonly ${camelCase(moduleName)}Service: ${className}Service,
  ) {}
}
`;

  const moduleTemplate = `
import { Module } from '@nestjs/common';

import { ${className}Controller } from './${moduleName}.controller';
import { ${className}Service } from './${moduleName}.service';

@Module({
  controllers: [${className}Controller],
  providers: [${className}Service],
  exports: [${className}Service],
})
export class ${className}Module {}
`;

  const indexTemplate = `
export * from './${moduleName}.module';
`;

  await Promise.all([
    fs.writeFile(
      path.join(moduleDir, `${moduleName}.service.ts`),
      serviceTemplate.trim(),
    ),

    fs.writeFile(
      path.join(moduleDir, `${moduleName}.controller.ts`),
      controllerTemplate.trim(),
    ),

    fs.writeFile(
      path.join(moduleDir, `${moduleName}.module.ts`),
      moduleTemplate.trim(),
    ),

    fs.writeFile(path.join(moduleDir, 'index.ts'), indexTemplate.trim()),
  ]);

  await updateAppModule(root, moduleName, className);

  console.log(`✓ ${className} module generated successfully.`);
}

function toPascalCase(str: string) {
  return str
    .split(/[-_]/)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join('');
}

function camelCase(str: string) {
  const pascal = toPascalCase(str);

  return pascal.charAt(0).toLowerCase() + pascal.slice(1);
}

async function updateAppModule(
  root: string,
  moduleName: string,
  className: string,
) {
  const appModulePath = path.join(root, 'src', 'app.module.ts');

  let content = await fs.readFile(appModulePath, 'utf8');

  const importStatement = `import { ${className}Module } from './modules/${moduleName}';`;

  if (!content.includes(importStatement)) {
    content = `${importStatement}\n${content}`;
  }

  if (!content.includes(`${className}Module`)) {
    content = content.replace(
      /imports:\s*\[/,
      `imports: [${className}Module, `,
    );
  }

  await fs.writeFile(appModulePath, content);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});

import { Path } from "@angular-devkit/core";
import { capitalize } from "@angular-devkit/core/src/utils/strings";
import { ConfigModuleImportDeclarator } from "./config-module-import.declarator";
import { ConfigMetadataManager } from "./config-metadata.manager";

export interface ConfigDeclarationOptions {
  metadata: string;
  name: string;
  path: Path;
  module: Path;
  symbol: string;
  schemaSymbol?: string;
  className?: string;
  type?: string;
  hasValidation?: boolean;
  staticOptions?: {
    name: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    value: Record<string, any>;
  };
}

export class ConfigDeclarator {
  constructor(private imports: ConfigModuleImportDeclarator = new ConfigModuleImportDeclarator()) {}

  public declare(content: string, options: ConfigDeclarationOptions): string {
    options = this.computeSymbol(options);
    content = this.imports.declare(content, options);
    content = this.metadataDeclare(content, options);
    // console.log("metadata: ", content);
    return content;
  }

  private metadataDeclare(content: string, options: ConfigDeclarationOptions): string {
    let metadataManager = new ConfigMetadataManager(content);
    let inserted: string | undefined = undefined;
    if (options.hasValidation) {
      inserted = metadataManager.insertValidationSchema(options);
      metadataManager = new ConfigMetadataManager(inserted!);
    }
    inserted = metadataManager.insertConfigMetadata(options);
    return inserted ?? content;
  }

  private computeSymbol(options: ConfigDeclarationOptions): ConfigDeclarationOptions {
    const target = Object.assign({}, options);
    target.symbol = options.name.concat(capitalize(options.type!));

    if (options.hasValidation) target.schemaSymbol = options.name.concat("ValidationSchema");

    return target;
  }
}

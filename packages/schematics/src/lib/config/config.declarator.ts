import { Path } from "@angular-devkit/core";
import { ModuleImportDeclarator, ModuleMetadataDeclarator } from "../../utils";
import { capitalize, classify } from "@angular-devkit/core/src/utils/strings";

export interface ConfigDeclarationOptions {
  metadata: string;
  name: string;
  path: Path;
  module: Path;
  symbol?: string;
  className?: string;
  type?: string;
  staticOptions?: {
    name: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    value: Record<string, any>;
  };
}

export class ConfigDeclarator {
  constructor(
    private imports: ModuleImportDeclarator = new ModuleImportDeclarator(),
    private metadata: ModuleMetadataDeclarator = new ModuleMetadataDeclarator()
  ) {}

  public declare(content: string, options: ConfigDeclarationOptions): string {
    options = this.computeSymbol(options);
    // console.log("options: ", options);
    content = this.imports.declare(content, options);
    content = this.metadata.declare(content, options);
    // console.log("metadata: ", content);
    return content;
  }

  private computeSymbol(options: ConfigDeclarationOptions): ConfigDeclarationOptions {
    const target = Object.assign({}, options);
    if (options.className) {
      target.symbol = options.name;
    } else if (options.type !== undefined) {
      target.symbol = options.name.concat(capitalize(options.type));
    } else {
      target.symbol = classify(options.name);
    }
    return target;
  }
}

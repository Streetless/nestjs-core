import { ModuleImportDeclarator, PathSolver } from "../../../utils";
import { ConfigDeclarationOptions } from "./config.declarator";

export class ConfigModuleImportDeclarator extends ModuleImportDeclarator {
  constructor(solver: PathSolver = new PathSolver()) {
    super(solver);
  }

  public override declare(content: string, options: ConfigDeclarationOptions): string {
    const toInsert = this.buildLineToInsert(options);
    const contentLines = content.split("\n");
    const finalImportIndex = this.findImportsEndpoint(contentLines);
    contentLines.splice(finalImportIndex + 1, 0, toInsert);
    return contentLines.join("\n");
  }

  protected override buildLineToInsert(options: ConfigDeclarationOptions): string {
    if (options.hasValidation)
      return `import { ${options.symbol}, ${options.schemaSymbol} } from "${this.computeRelativePath(options)}";`;
    return `import { ${options.symbol} } from "${this.computeRelativePath(options)}";`;
  }
}

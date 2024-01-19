import {
  ArrayLiteralExpression,
  createSourceFile,
  Expression,
  Identifier,
  Node,
  NodeArray,
  ObjectLiteralElement,
  ObjectLiteralExpression,
  PropertyAssignment,
  ScriptTarget,
  SourceFile,
  SyntaxKind,
} from "typescript";
import { ConfigDeclarationOptions } from "./config.declarator";
import { MetadataManager } from "../../../utils";

export class ConfigMetadataManager extends MetadataManager {
  constructor(content: string) {
    super(content);
  }

  public insertValidationSchema(options: ConfigDeclarationOptions): string | undefined {
    if (!options.hasValidation) return this.content;
    const source: SourceFile = createSourceFile("filename.ts", this.content, ScriptTarget.ES2017);
    const environmentSchema = this.getValidEnvironmentSchema(source);
    if (!environmentSchema)
      throw new Error(`Missing global variable 'validEnvironmentSchema' in your module: ${options.module}`);
    return this.addValidationSchemaToValidEnvironmentSchema(source, environmentSchema, options);
  }

  public insertConfigMetadata(options: ConfigDeclarationOptions): string | undefined {
    const source: SourceFile = createSourceFile("filename.ts", this.content, ScriptTarget.ES2017);
    const decoratorNodes: Node[] = this.getDecoratorMetadata(source, "@Module");
    const node: Node = decoratorNodes[0];
    // If there is no occurrence of `@Module` decorator, nothing will be inserted
    if (!node) return;
    const matchingProperties = this.getMatchingProperties(source, "imports", node);

    options.symbol = this.mergeSymbolAndExpr(options.symbol!, options.staticOptions);
    if (matchingProperties.length === 0) throw new Error("Config module must already have imports property");
    return this.insertConfigSymbolToMetadata(source, options, matchingProperties);
  }

  private addValidationSchemaToValidEnvironmentSchema(
    source: SourceFile,
    node: Node,
    options: ConfigDeclarationOptions
  ): string {
    const joi = node.getChildren(source)[2];
    const joiObject = joi.getChildren(source)[2];
    const joiObjectContent = joiObject.getChildren(source)[0].getChildren(source)[1];
    const position = joiObjectContent.getEnd();
    options.schemaSymbol = `...${options.schemaSymbol},`;

    const isEmpty = joiObjectContent.getText(source).trim() === "";
    let toInsert: string = "";
    if (isEmpty) {
      console.log("ueee");
      toInsert = options.staticOptions ? this.addBlankLines(options.schemaSymbol) : ` ${options.schemaSymbol} `;
    } else {
      const text = (node as Node).getFullText(source);
      const itemSeparator = (text.match(/^\r?\n(\r?)\s+/) || text.match(/^\r?\n/) || " ")[0];
      toInsert = `${itemSeparator}${options.schemaSymbol}`;
    }

    return this.content.split("").reduce((content, char, index) => {
      if (index === position) return `${content}${toInsert}${char}`;
      return `${content}${char}`;
    }, "");
  }

  private getValidEnvironmentSchema(source: SourceFile): Node | null {
    const sourcesNodes = this.getSourceNodes(source);
    const environmentSchemaNode = sourcesNodes.find(
      node => node.getText(source).includes("validEnvironmentSchema") && node.kind === SyntaxKind.VariableDeclaration
    );
    return environmentSchemaNode ?? null;
  }

  protected insertConfigSymbolToMetadata(
    source: SourceFile,
    options: ConfigDeclarationOptions,
    matchingProperties: ObjectLiteralElement[]
  ): string {
    const assignment = matchingProperties[0] as PropertyAssignment;
    let node: Node | NodeArray<Expression>;
    const arrLiteral = assignment.initializer as ArrayLiteralExpression;
    if (!arrLiteral.elements) return this.content; // "imports" is not an array but rather function/constant
    if (arrLiteral.elements.length === 0) node = arrLiteral;
    else node = arrLiteral.elements;

    if (Array.isArray(node)) {
      const nodeArray = node as unknown as Node[];
      const symbolsArray = nodeArray.map(childNode => childNode.getText(source));
      if (symbolsArray.includes(options.symbol)) return this.content;
      node = node[node.length - 1];

      // TODO: add search for ConfigModule
      // search for ConfigModule.forRoot({ load: [...] })
      const configModule = node as Node; // assuming that node is ConfigModule
      const configModuleContent = configModule.getChildren(source)[2];
      const forRootContentNode = configModuleContent
        .getChildren(source)
        .find(node => node.kind === SyntaxKind.ObjectLiteralExpression);
      if (!forRootContentNode) throw new Error("Could not find forRoot content in ConfigModule.forRoot({ ... })");
      const forRootContent = forRootContentNode as ObjectLiteralExpression;
      const loadArray = forRootContent.properties.find(
        node => node.kind === SyntaxKind.PropertyAssignment && (node.name as Identifier).escapedText === "load"
      );
      if (!loadArray) throw new Error("Could not find load array in ConfigModule.forRoot({ load: [...] })");
      const loadArrayContent = (loadArray as PropertyAssignment).initializer as ArrayLiteralExpression;
      node = loadArrayContent.elements[loadArrayContent.elements.length - 1];
    }
    let toInsert: string;
    let position = (node as Node).getEnd();

    if ((node as Node).kind === SyntaxKind.ArrayLiteralExpression) {
      position--;
      toInsert = options.staticOptions ? this.addBlankLines(options.symbol) : `${options.symbol}`;
    } else {
      const text = (node as Node).getFullText(source);
      const itemSeparator = (text.match(/^\r?\n(\r?)\s+/) || text.match(/^\r?\n/) || " ")[0];
      toInsert = `,${itemSeparator}${options.symbol}`;
    }
    return this.content.split("").reduce((content, char, index) => {
      if (index === position) return `${content}${toInsert}${char}`;
      return `${content}${char}`;
    }, "");
  }
}

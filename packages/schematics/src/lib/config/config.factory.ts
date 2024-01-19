import { join, Path, strings } from "@angular-devkit/core";
import {
  apply,
  branchAndMerge,
  chain,
  filter,
  mergeWith,
  move,
  noop,
  Rule,
  SchematicContext,
  SchematicsException,
  Source,
  template,
  Tree,
  url,
} from "@angular-devkit/schematics";
import { ConfigOptions } from "./config.schema";
import { Location, mergeSourceRoot, ModuleFinder, NameParser } from "../../utils";
import { normalizeToKebabOrSnakeCase } from "../../utils/formatting";
import { ConfigDeclarationOptions, ConfigDeclarator } from "./utils/config.declarator";

export const main = (options: ConfigOptions): Rule => {
  options = transform(options);
  return (tree: Tree, context: SchematicContext) =>
    branchAndMerge(chain([mergeSourceRoot(options), addDeclarationToModule(options), mergeWith(generate(options))]))(
      tree,
      context
    );
};

const transform = (options: ConfigOptions): ConfigOptions => {
  const target: ConfigOptions = Object.assign({}, options);
  target.metadata = "config";
  target.type = "config";

  if (!target.name) throw new SchematicsException("Option (name) is required.");

  const location: Location = new NameParser().parse(target);
  target.name = normalizeToKebabOrSnakeCase(location.name);
  target.path = normalizeToKebabOrSnakeCase(location.path);
  target.specFileSuffix = normalizeToKebabOrSnakeCase(options.specFileSuffix || "spec");
  target.hasValidation = options.hasValidation || true; // TODO: handle optional generation of validation schema in spec and config

  target.path = target.flat ? target.path : join(target.path as Path, target.name);
  return target;
};

const generate =
  (options: ConfigOptions): Source =>
  (context: SchematicContext) =>
    apply(url("./files"), [
      options.spec
        ? noop()
        : filter(path => {
            const suffix = `.__specFileSuffix__.ts`;
            return !path.endsWith(suffix);
          }),
      template({
        ...strings,
        ...options,
      }),
      move(options.path!),
    ])(context);

const addDeclarationToModule =
  (options: ConfigOptions): Rule =>
  (tree: Tree) => {
    if (options.skipImport !== undefined && options.skipImport) return tree;

    options.module = new ModuleFinder(tree).find({
      name: options.name,
      path: options.path as Path,
    });
    if (!options.module) return tree;

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const content = tree.read(options.module).toString();
    const declarator: ConfigDeclarator = new ConfigDeclarator();
    const oh = options as ConfigDeclarationOptions;
    console.log("declarator: ", declarator.declare(content, oh));
    // tree.overwrite(options.module, declarator.declare(content, options as DeclarationOptions));
    return tree;
  };

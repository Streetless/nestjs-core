import { join, Path, strings } from "@angular-devkit/core";
import {
  apply,
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
  url,
} from "@angular-devkit/schematics";
import { Location, NameParser } from "@nestjs/schematics";
import { ConfigOptions } from "./config.schema";
import { normalizeToKebabOrSnakeCase } from "@nestjs/cli/lib/utils/formatting";
import { mergeSourceRoot } from "../../utils";

export const main = (options: ConfigOptions): Rule => {
  options = transform(options);
  const sourceRoot = mergeSourceRoot(options);
  const generatedSource = mergeWith(generate(options));
  const rules: Array<Rule> = [sourceRoot, generatedSource];
  return chain(rules);
};

const transform = (options: ConfigOptions): ConfigOptions => {
  const target: ConfigOptions = Object.assign({}, options);
  if (!target.name) throw new SchematicsException("Option (name) is required.");

  const location: Location = new NameParser().parse(target);
  target.name = normalizeToKebabOrSnakeCase(location.name);
  target.path = normalizeToKebabOrSnakeCase(location.path);
  target.specFileSuffix = normalizeToKebabOrSnakeCase(options.specFileSuffix || "spec");

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

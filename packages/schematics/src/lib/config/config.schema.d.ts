import { Path } from "@angular-devkit/core";

export interface ConfigOptions {
  /**
   * The name of the class.
   */
  name: string;
  /**
   * The path to create the class.
   */
  path?: string | Path;
  /**
   * The source root path.
   */
  sourceRoot?: string;
  /**
   * Flag to indicate if a directory is created.
   */
  flat?: boolean;
  /**
   * Specifies if a spec file is generated.
   */
  spec?: boolean;
  /**
   * Specifies the file suffix of spec files.
   * @default "spec"
   */
  specFileSuffix?: string;
  /**
   * Flag to add validation import.
   */
  hasValidation?: boolean;
  /**
   * Directive to insert declaration in module.
   */
  skipImport?: boolean;
  /**
   * The path to insert the service declaration.
   */
  module?: Path | null;
  /**
   * Metadata name affected by declaration insertion.
   */
  metadata?: string;
  /**
   * Nest element type name
   */
  type?: string;
}

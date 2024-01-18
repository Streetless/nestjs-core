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
}

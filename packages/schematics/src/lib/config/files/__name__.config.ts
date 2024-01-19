import Joi from "joi";
import { ConfigType, registerAs } from "@nestjs/config";
<% if(hasValidation) { %>export const <%= name %>ValidationSchema = {

};
<% } %>
/**
 * @warning Only use this if config service is not available
 */
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const <%= name %>ConfigRaw = () => {
  return {

  };
};

export const <%= name %>Config = registerAs("<%= name %>", <%= name %>ConfigRaw);
export type <%= classify(name) %>Config = ConfigType<typeof <%= name %>Config>;
export const <%= classify(name) %>ConfigKey = <%= name %>Config.KEY;

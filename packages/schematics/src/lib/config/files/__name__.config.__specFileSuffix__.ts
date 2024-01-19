import { <%= name %>Config, <%= name %>ConfigRaw, <%= classify(name) %>ConfigKey, <%= name %>ValidationSchema } from "./<%= name %>.config";

describe("<%= classify(name) %>Config", () => {
  it("should be defined", () => {
    expect(<%= name %>Config()).toBeDefined();
  });
});
<% if(hasValidation) { %>
describe("<%= classify(name) %>ValidationSchema", () => {
  it("should be defined", () => {
    expect(<%= name %>ValidationSchema).toBeDefined();
  });
});
<% } %>
describe("<%= classify(name) %>ConfigKey", () => {
  it("should be defined", () => {
    expect(<%= classify(name) %>ConfigKey).toBeDefined();
  });
});

describe("<%= classify(name) %>ConfigRaw", () => {
  it("should be defined", () => {
    expect(<%= name %>ConfigRaw()).toBeDefined();
  });

  describe("Tests environment variables", () => {

  });

  describe("Tests optional environment variables", () => {

  });
});

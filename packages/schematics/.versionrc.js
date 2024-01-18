module.exports = {
  types: [
    { type: "feat", section: "✨ Features" },
    { type: "fix", scope: "test", section: "🔧 Other", hidden: true },
    { type: "fix", scope: "ci", section: "🔧 Other", hidden: true },
    { type: "fix", scope: "pnpm", section: "🔧 Other", hidden: true },
    { type: "fix", scope: "npm", section: "🔧 Other", hidden: true },
    { type: "fix", section: "🐛 Bug Fixes" },
    { type: "build", scope: "deps", section: "🔗 Dependencies" },
    { type: "chore", scope: "deps", section: "🔗 Dependencies" },
    { type: "chore", section: "🔧 Other", hidden: true },
    { type: "docs", section: "📚 Documentation" },
    { type: "style", section: "♻️ Refactoring", hidden: false },
    { type: "refactor", section: "♻️ Refactoring", hidden: false },
    { type: "perf", section: "🔧 Other", hidden: true },
    { type: "test", section: "🧪 Tests", hidden: false },
  ],
  releaseCommitMessageFormat: "chore(release): Release v{{currentTag}}",
  skip: {
    // tag: true,
    // commit: true,
  },
  writerOpts: {
    commitsSort: true,
  },
  bumpFiles: [
    {
      filename: "./package.json", // default
      // The `json` updater assumes the version is available under a `version` key in the provided JSON document.
      type: "json",
    },
    {
      filename: "./openapi.json",
      updater: {
        readVersion: (content) => JSON.parse(content).info.version,
        writeVersion: (content, version) => {
          const parsed = JSON.parse(content);
          parsed.info.version = version;
          return JSON.stringify(parsed, null, 2);
        }
      }
    },
  ],
};

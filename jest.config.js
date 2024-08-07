module.exports = {
  transform: {
    "^.+\\.[tj]sx?$": "babel-jest",
    "^.+\\.css$": "<rootDir>/jest/cssTransform.js",
  },
  transformIgnorePatterns: [
    "/node_modules/(?!(axios)/)", // Allow transforming axios
  ],
  moduleNameMapper: {
    "\\.(css|less)$": "identity-obj-proxy",
  },
  testEnvironment: "jsdom",
};

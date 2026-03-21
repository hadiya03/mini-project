module.exports = {
  testEnvironment: "jsdom",

  setupFilesAfterEnv: ["<rootDir>/src/setupTests.js"],

  transform: {
    "^.+\\.[jt]sx?$": "babel-jest",
  },

  moduleNameMapper: {
    "\\.(css|less|scss)$": "identity-obj-proxy",
  },
};
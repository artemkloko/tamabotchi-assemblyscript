module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  globals: {
    "ts-jest": {
      isolatedModules: true
    }
  },
  moduleNameMapper: {
    "^./assembly/(.*)$": "<rootDir>/assembly/$1"
  }
};

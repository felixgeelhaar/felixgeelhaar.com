module.exports = {
  setupFilesAfterEnv: [
    '@testing-library/jest-dom/extend-expect',
    '@testing-library/react/cleanup-after-each',
  ],
  moduleNameMapper: {
    '\\.(css|less|sass|scss)$': 'identity-obj-proxy',
  },
}

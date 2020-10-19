module.exports = {
  printWidth: 80,
  singleQuote: true,
  trailingComma: 'all',
  overrides: [
    {
      files: '*.wxml',
      options: {
        parser: 'html',
      },
    },
    {
      files: '*.wxss',
      options: {
        parser: 'css',
      },
    },
    {
      files: '*.wxs',
      options: {
        parser: 'babel',
      },
    },
  ],
};

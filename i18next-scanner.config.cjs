module.exports = {
   input: [
      'src/**/*.{js,jsx,tsx,ts}', // replace with your file extensions
      // 'path/to/your/files/**/*.{js,jsx,tsx}',
      '!**/node_modules/**',
   ],
   output: './',
   options: {
      debug: true,
      removeUnusedKeys: true,
      func: {
         list: ['t'],
         extensions: ['.js', '.jsx', '.tsx', '.ts'],
      },
      lngs: ['en', 'sv', 'de'], // replace with your supported languages
      defaultLng: 'en',
      defaultNs: 'translation',
      defaultValue: '__STRING_NOT_TRANSLATED__',
      resource: {
         loadPath: 'translations/{{lng}}.json',
         savePath: 'translations/{{lng}}.json',
         jsonIndent: 2,
         lineEnding: '\n',
      },
      nsSeparator: false,
      keySeparator: false,
      interpolation: {
         prefix: '{{',
         suffix: '}}',
      },
   },
};

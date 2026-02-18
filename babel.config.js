module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    [
      'module:react-native-dotenv',
      {
        moduleName: '@env',
        path: '.env.dev',
      },
    ],
  ],
};

// module.exports = function (api) {
//   api.cache(true);

//   const env = process.env.ENVFILE;

//   return {
//     presets: ['module:@react-native/babel-preset'],
//     plugins: [
//       [
//         'module:react-native-dotenv',
//         {
//           moduleName: '@env',
//           path: `.env.${env}`,
//         },
//       ],
//     ],
//   };
// };

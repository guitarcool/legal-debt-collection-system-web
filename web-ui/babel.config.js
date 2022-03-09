let prodPlugins = [];
if (process.env.NODE_ENV === "production") {    // todo  if判断是否打包,打包环境下控制台去掉console.log,也可去掉if判断，整个项目不会出现console.log(不建议)
  prodPlugins.push("transform-remove-console");
}
module.exports = {
  presets: [
    // https://github.com/vuejs/vue-cli/tree/master/packages/@vue/babel-preset-app
    '@vue/cli-plugin-babel/preset',
    ["@babel/preset-env", { modules: false }]
  ],
  'plugins': [
    ...prodPlugins,
    [
      'component',
      {
        libraryName: 'element-ui',
        styleLibraryName: 'theme-chalk'
      }
    ]
  ],  
  'env': {
    'development': {
      // babel-plugin-dynamic-import-node plugin only does one thing by converting all import() to require().
      // This plugin can significantly increase the speed of hot updates, when you have a large number of pages.
      'plugins': ['dynamic-import-node']
    }
  }
}
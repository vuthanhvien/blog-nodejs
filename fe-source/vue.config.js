module.exports = {
  lintOnSave: false,
  runtimeCompiler: true,
  outputDir: './../dist',

  pluginOptions: {
    apollo: {
      enableMocks: true,
      enableEngine: true
    }
  }
}

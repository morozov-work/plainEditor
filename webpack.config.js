const path = require('path');
module.exports = {
  mode: "development", 
  entry: './src/plainEditorScript.js', 
  output: {
    path: path.resolve(__dirname, 'dist'), 
    filename: 'plainEditor.js',
    library: 'plainEditor',
    libraryTarget: 'var'
  },
  watch: false,

  devtool: "source-map"
};

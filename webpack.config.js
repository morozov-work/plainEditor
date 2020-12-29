const path = require('path');
module.exports = {
  mode: "development", 
  entry: './src/plainEditorScript.js', 
  output: {
    path: path.resolve(__dirname, 'public'), 
    filename: 'plainEditor.js'
  }
};

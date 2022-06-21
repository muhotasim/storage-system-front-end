const express = require("express");
const app = express();
const PORT = 3000;
const path = require("path");

var webpack = require("webpack");
var webpackConfig = require("./webpack.config");
var compiler = webpack(webpackConfig);

app.use(
  require("webpack-dev-middleware")(compiler, {
    publicPath: webpackConfig.output.publicPath,
  })
);
app.use(require("webpack-hot-middleware")(compiler));

app.use(express.static(path.join(__dirname,'public')));
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname,"public")+"/index.html");
});


app.listen(PORT, () =>
  console.info(`server is running at http://localhost:${PORT}`)
);

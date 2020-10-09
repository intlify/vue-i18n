const path = require('path')
const { VueLoaderPlugin } = require('vue-loader')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MonacoEditorPlugin = require('monaco-editor-webpack-plugin')

module.exports = {
  mode: process.env.NODE_ENV === 'production' ? 'production' : 'development',
  devtool:
    process.env.NODE_ENV === 'production'
      ? 'source-map'
      : 'cheap-module-eval-source-map',
  entry: path.resolve(__dirname, './src/index.ts'),
  output: {
    path: path.resolve(__dirname, './dist'),
    publicPath: '/'
  },
  resolve: {
    extensions: ['.js', '.ts', '.tsx', '.vue', '.json', '.mjs', '.wasm'],
    alias: {
      vue: require.resolve('vue/dist/vue.esm-bundler.js')
    }
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        use: 'vue-loader'
      },
      {
        test: /\.tsx?$/,
        use: {
          loader: 'ts-loader',
          options: {
            happyPackMode: true,
            transpileOnly: true,
            appendTsSuffixTo: [/\.vue$/]
          }
        }
      },
      {
        test: /\.png$/,
        use: {
          loader: 'url-loader',
          options: { limit: 8192 }
        }
      },
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader']
      },
      {
        test: /\.ttf$/,
        use: ['file-loader']
      }
    ]
  },
  plugins: [
    new VueLoaderPlugin(),
    new MonacoEditorPlugin(),
    new HtmlWebpackPlugin({
      template: path.join(__dirname, 'src/index.html')
    })
  ],
  devServer: {
    inline: true,
    hot: true,
    stats: 'minimal',
    contentBase: __dirname,
    overlay: true
  }
}

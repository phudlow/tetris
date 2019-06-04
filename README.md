## Frontend Webpack Boilerplate

### Usage

1. Install dev dependencies used every time
    - Run `npm install --save-dev @babel/core @babel/preset-env babel-loader css-loader html-webpack-plugin mini-css-extract-plugin minimist node-sass sass-loader style-loader webpack webpack-cli webpack-dev-server webpack-merge clean-webpack-plugin`
2. To use React
    - Run `npm install @babel/preset-react --save-dev`
    - Run `npm install react react-dom --save`
    - Add `@babel/preset-react` to the `babel.presets` array in package.json
3. Run `npm start` to start the hot module dev server.
4. Get coding!
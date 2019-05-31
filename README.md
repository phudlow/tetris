## Frontend Webpack Boilerplate

### Usage

1. Install dev dependencies used every time
    - Run `npm install --save-dev @babel/core @babel/preset-env webpack webpack-cli webpack-dev-server babel-loader css-loader style-loader node-sass sass-loader html-webpack-plugin`
2. To use React
    - Run `npm install @babel/preset-react --save-dev`
    - Run `npm install react react-dom --save`
    - Add `@babel/preset-react` to the `babel.presets` array in package.json
3. Run `npm start` to start the hot module dev server.
4. Get coding!
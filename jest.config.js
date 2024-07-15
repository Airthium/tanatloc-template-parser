export default {
  testEnvironment: 'node',
  transform: {
    '^.+\\.(j|t)s': [
      'babel-jest',
      {
        presets: ['@babel/preset-env', '@babel/preset-typescript']
      }
    ]
  },
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1'
  }
}

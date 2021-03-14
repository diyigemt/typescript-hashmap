module.exports = {
  root: true,
  env: {
    es6: true,
    node: true
  },
  extends: [
    'plugin:vue/essential',
    '@vue/standard',
    '@vue/typescript/recommended'
  ],
  parserOptions: {
    ecmaVersion: 2020
  },
  rules: {
    'eqeqeq': [2, 'always'], // 强制使用=== !==
    'no-extra-semi': 'off', //禁止不必要的分号 关闭
    'space-before-function-paren': 'off', //函数后不必有空格
    'semi': [2, 'always'] //语句必须以分号结尾
  }
}

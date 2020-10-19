module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      [
        'feat', // 新特性
        'fix', // bug 修改
        'docs', // 文档类修改
        'style', // 格式（不影响代码运行的变动）
        'refactor', // 重构代码
        'perf', // 性能优化
        'test', // 新增、修改测试
        'build', // 构建发布版本
        'ci', // 持续集成修改
        'chore', // 琐事，小修改
        'revert', // 版本回退
      ],
    ],
    'subject-full-stop': [0, 'never'],
    'subject-case': [0, 'never'],
  },
};

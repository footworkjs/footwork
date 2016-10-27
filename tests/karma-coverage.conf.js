module.exports = {
  preprocessors: {
    'tests/assets/**/*.html': ['html2js'],
    'tests/assets/**/*.json': ['json_fixtures']
  },
  reporters: ['spec', 'coverage'],
  coverageReporter: {
    dir : 'build/coverage-reports/',
    reporters: [
      { type: 'html', subdir: 'report-html' },
      { type: 'lcov', subdir: 'report-lcov' }
    ]
  }
};

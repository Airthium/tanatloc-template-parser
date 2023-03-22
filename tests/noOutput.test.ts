describe('noInput', () => {
  test('run', async () => {
    process.argv[2] = './tests/assets/test1.edp.ejs'
    await import('../src/index')
  })
})

describe('noInput', () => {
  test('run', async () => {
    try {
      process.argv[2] = ''
      await import('../src/index')
    } catch (err) {
      expect(err.message).toBe('No input file')
    }
  })
})

import { promises as fs } from 'fs'

describe('test3.edp.ejs', () => {
  test('run', async () => {
    const formattedFile = await fs.readFile(
      './tests/assets/test3.formatted.edp'
    )

    process.argv[2] = './tests/assets/test3.edp'
    process.argv[3] = './tests/assets/test3.jest.edp'
    await import('../src/index')

    const jestFile = await fs.readFile('./tests/assets/test3.jest.edp')

    expect(jestFile.toString()).toBe(formattedFile.toString())
  })
})

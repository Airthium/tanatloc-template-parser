import { promises as fs } from 'fs'

describe('test2.edp.ejs', () => {
  test('run', async () => {
    const formattedFile = await fs.readFile(
      './tests/assets/test2.formatted.edp.ejs'
    )

    process.argv[2] = './tests/assets/test2.edp.ejs'
    process.argv[3] = './tests/assets/test2.jest.edp.ejs'
    await import('../src/index')

    const jestFile = await fs.readFile('./tests/assets/test2.jest.edp.ejs')

    expect(jestFile.toString()).toBe(formattedFile.toString())
  })
})

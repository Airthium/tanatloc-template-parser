import { promises as fs } from 'fs'

describe('test1.edp.ejs', () => {
  test('run', async () => {
    const formattedFile = await fs.readFile(
      './tests/assets/test1.formatted.edp.ejs'
    )

    process.argv[2] = './tests/assets/test1.edp.ejs'
    process.argv[3] = './tests/assets/test1.jest.edp.ejs'
    await import('../src/index')

    const jestFile = await fs.readFile('./tests/assets/test1.jest.edp.ejs')

    expect(jestFile.toString()).toBe(formattedFile.toString())
  })
})

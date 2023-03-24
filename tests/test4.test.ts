import { promises as fs } from 'fs'

describe('test4.edp.ejs', () => {
  test('run', async () => {
    const formattedFile = await fs.readFile(
      './tests/assets/test4.formatted.edp'
    )

    process.argv[2] = './tests/assets/test4.edp'
    process.argv[3] = './tests/assets/test4.jest.edp'
    await import('../src/index')

    const jestFile = await fs.readFile('./tests/assets/test4.jest.edp')

    expect(jestFile.toString()).toBe(formattedFile.toString())
  })
})

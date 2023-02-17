import * as fs from 'fs'

import { parse } from './parse.js'
import { beautify } from './beautify.js'
import { stringify } from './stringify.js'

// Input file
const inputFile = process.argv[2]
if (!inputFile) {
  console.error('You must specify an input file to parse')
  console.error('node index.js file.edp.ejs')
  process.exit(-1)
}

// Output file
const outputFile = process.argv[3]
if (!outputFile) {
  console.info('You did not specify an output file')
  console.info('-> console output')
  console.info('----------------->')
}

const fileContent = fs.readFileSync(inputFile)
const content = fileContent.toString()

const tree = parse(content)
// console.dir(tree, { depth: null })

const beautifiedTree = beautify(tree)

const code = stringify(beautifiedTree)
if (outputFile) {
  fs.writeFileSync(outputFile, code)
} else {
  console.info(code)
}

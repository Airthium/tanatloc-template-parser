/** @module Src */

import * as fs from 'fs'
import colors from 'colors/safe.js'

import { parse } from './parse/index.js'
import { beautify } from './beautify/index.js'
import { stringify } from './stringify/index.js'

/**
 * Print code
 * @param code Code
 */
const printCode = (code: string): void => {
  const lines = code.split('\n')
  const length = lines.length
  const maxCharLenght = String(length).length

  for (let i = 0; i < length; ++i) {
    const line = lines[i]
    const lineNumber = ' '.repeat(maxCharLenght) + i
    console.log(
      colors.gray(
        lineNumber.substring(lineNumber.length - maxCharLenght) + ':'
      ),
      line
    )
  }
}

// Input file
const inputFile = process.argv[2]
if (!inputFile) {
  console.error('You must specify an input file to parse')
  console.error('node index.js file.edp.ejs')
  throw new Error('No input file')
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

const beautifiedTree = beautify(tree)

const code = stringify(beautifiedTree)
if (outputFile) {
  fs.writeFileSync(outputFile, code)
} else {
  printCode(code)
}

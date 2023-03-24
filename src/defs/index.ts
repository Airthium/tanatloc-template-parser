/** @module Src.Defs */

import { Def } from './typedef.d.js'

/**
 * Root
 */
export const root: Def = {
  family: 'root',
  name: 'root',
  identifier: ''
}

/**
 * Inline comment
 */
export const inlineComment: Def = {
  family: 'comment',
  name: 'inline',
  identifier: '//'
}

/**
 * Multiline comment
 */
export const multilineComment: Def[] = [
  {
    family: 'comment',
    name: 'multiline',
    identifier: '/*',
    dir: 1
  },
  {
    family: 'comment',
    name: 'multiline',
    identifier: '*/',
    dir: -1
  }
]

/**
 * Text
 */
export const string: Def = {
  family: 'string',
  name: 'text',
  identifier: ''
}

/**
 * Space
 */
export const space: Def = {
  family: 'string',
  name: 'space',
  identifier: ' '
}

/**
 * Line break
 */
export const lineBreak: Def = {
  family: 'string',
  name: 'lineBreak',
  identifier: '\n'
}

/**
 * Blocks
 */
export const blocks: Def[] = [
  {
    family: 'block',
    name: 'brace',
    identifier: '{',
    closeIdentifiers: ['}'],
    dir: 1,
    freefem: {
      spaceBefore: true,
      spaceAfter: true,
      lineBreakAfter: true,
      indent: true,
      keepInline: true
    },
    ejs: {
      indent: true,
      keepInline: true
    }
  },
  {
    family: 'block',
    name: 'brace',
    identifier: '}',
    dir: -1,
    freefem: {
      spaceBefore: true,
      spaceAfter: true,
      lineBreakBefore: true,
      lineBreakAfter: true,
      keepInline: true
    },
    ejs: {
      keepInline: true
    }
  },
  {
    family: 'block',
    name: 'array',
    identifier: '[',
    closeIdentifiers: [']'],
    dir: 1,
    freefem: {
      indent: true,
      keepInline: true
    },
    ejs: {
      keepInline: true
    }
  },
  {
    family: 'block',
    name: 'array',
    identifier: ']',
    dir: -1,
    freefem: {
      keepInline: true
    },
    ejs: {
      keepInline: true
    }
  },
  {
    family: 'block',
    name: 'parenthesis',
    identifier: '(',
    closeIdentifiers: [')'],
    dir: 1,
    freefem: {
      indent: true,
      keepInline: true
    }
  },
  {
    family: 'block',
    name: 'parenthesisClose',
    identifier: ')',
    dir: -1,
    freefem: {
      lineBreakBefore: true,
      keepInline: true
    }
  },
  {
    family: 'block',
    name: 'ejsComment',
    identifier: '<%#',
    closeIdentifiers: ['-%>', '%>'],
    dir: 1,
    ejs: {
      spaceBefore: true,
      spaceAfter: true
    },
    enableEJS: true
  },
  {
    family: 'block',
    name: 'ejsEscape',
    identifier: '<%=',
    closeIdentifiers: ['-%>', '%>'],
    dir: 1,
    ejs: {
      spaceAfter: true
    },
    enableEJS: true
  },
  {
    family: 'block',
    name: 'ejsUnescape',
    identifier: '<%-',
    closeIdentifiers: ['-%>', '%>'],
    dir: 1,
    ejs: {
      spaceBefore: true,
      spaceAfter: true,
      keepInline: true
    },
    enableEJS: true
  },
  {
    family: 'block',
    name: 'ejsOpen',
    identifier: '<%',
    closeIdentifiers: ['-%>', '%>'],
    dir: 1,
    ejs: {
      spaceBefore: true,
      spaceAfter: true,
      lineBreakAfter: true,
      indent: true,
      keepInline: true
    },
    enableEJS: true
  },
  {
    family: 'block',
    name: 'ejsTrimClose',
    identifier: '-%>',
    dir: -1,
    ejs: {
      spaceBefore: true
    },
    disableEJS: true
  },
  {
    family: 'block',
    name: 'ejsClose',
    identifier: '%>',
    dir: -1,
    ejs: {
      lineBreakBefore: true,
      lineBreakAfter: true,
      keepInline: true
    },
    disableEJS: true
  }
]

/**
 * Operators
 */
export const operators: Def[] = [
  {
    family: 'operator',
    name: 'pow-1',
    identifier: '^-1',
    freefem: {
      spaceAfter: true
    }
  },
  {
    family: 'operator',
    name: 'or',
    identifier: '||',
    freefem: {
      spaceBefore: true,
      spaceAfter: true
    },
    ejs: {
      spaceBefore: true,
      spaceAfter: true
    }
  },
  {
    family: 'operator',
    name: 'and',
    identifier: '&&',
    freefem: {
      spaceBefore: true,
      spaceAfter: true
    },
    ejs: {
      spaceBefore: true,
      spaceAfter: true
    }
  },
  {
    family: 'operator',
    name: 'streamIn',
    identifier: '<<',
    freefem: {
      spaceBefore: true,
      spaceAfter: true
    }
  },
  {
    family: 'operator',
    name: 'plusPlus',
    identifier: '++'
  },
  {
    family: 'operator',
    name: 'minusMinus',
    identifier: '--'
  },
  {
    family: 'operator',
    name: 'equalEqualEqual',
    identifier: '===',
    ejs: {
      spaceBefore: true,
      spaceAfter: true
    }
  },
  {
    family: 'operator',
    name: 'notEqualEqual',
    identifier: '!==',
    ejs: {
      spaceBefore: true,
      spaceAfter: true
    }
  },
  {
    family: 'operator',
    name: 'equalEqual',
    identifier: '==',
    freefem: {
      spaceBefore: true,
      spaceAfter: true
    }
  },
  {
    family: 'operator',
    name: 'notEqual',
    identifier: '!=',
    freefem: {
      spaceBefore: true,
      spaceAfter: true
    }
  },
  {
    family: 'operator',
    name: 'plusEqual',
    identifier: '+=',
    freefem: {
      spaceBefore: true,
      spaceAfter: true
    },
    ejs: {
      spaceBefore: true,
      spaceAfter: true
    }
  },
  {
    family: 'operator',
    name: 'minusEqual',
    identifier: '-=',
    freefem: {
      spaceBefore: true,
      spaceAfter: true
    },
    ejs: {
      spaceBefore: true,
      spaceAfter: true
    }
  },
  {
    family: 'operator',
    name: 'timesEqual',
    identifier: '*=',
    freefem: {
      spaceBefore: true,
      spaceAfter: true
    },
    ejs: {
      spaceBefore: true,
      spaceAfter: true
    }
  },
  {
    family: 'operator',
    name: 'divideEqual',
    identifier: '/=',
    freefem: {
      spaceBefore: true,
      spaceAfter: true
    },
    ejs: {
      spaceBefore: true,
      spaceAfter: true
    }
  },
  {
    family: 'operator',
    name: 'lowerOrEqual',
    identifier: '<=',
    freefem: {
      spaceBefore: true,
      spaceAfter: true
    },
    ejs: {
      spaceBefore: true,
      spaceAfter: true
    }
  },
  {
    family: 'operator',
    name: 'upperOrEqual',
    identifier: '>=',
    freefem: {
      spaceBefore: true,
      spaceAfter: true
    },
    ejs: {
      spaceBefore: true,
      spaceAfter: true
    }
  },
  {
    family: 'operator',
    name: 'arrow',
    identifier: '=>',
    ejs: {
      spaceBefore: true,
      spaceAfter: true
    }
  },
  {
    family: 'operator',
    name: 'dotDivide',
    identifier: './',
    freefem: {
      spaceBefore: true,
      spaceAfter: true
    }
  },
  {
    family: 'operator',
    name: 'test',
    identifier: '??',
    ejs: {
      spaceBefore: true,
      spaceAfter: true
    }
  },
  {
    family: 'operator',
    name: 'ternary',
    identifier: '?',
    freefem: {
      spaceBefore: true,
      spaceAfter: true
    },
    ejs: {
      spaceBefore: true,
      spaceAfter: true
    }
  },
  {
    family: 'operator',
    name: 'equal',
    identifier: '=',
    freefem: {
      spaceBefore: true,
      spaceAfter: true
    },
    ejs: {
      spaceBefore: true,
      spaceAfter: true
    }
  },
  {
    family: 'operator',
    name: 'upper',
    identifier: '>',
    freefem: {
      spaceBefore: true,
      spaceAfter: true
    },
    ejs: {
      spaceBefore: true,
      spaceAfter: true
    }
  },
  {
    family: 'operator',
    name: 'lower',
    identifier: '<',
    freefem: {
      spaceBefore: true,
      spaceAfter: true
    },
    ejs: {
      spaceBefore: true,
      spaceAfter: true
    }
  },
  {
    family: 'operator',
    name: 'remaind',
    identifier: '%',
    freefem: {
      spaceBefore: true,
      spaceAfter: true
    },
    ejs: {
      spaceBefore: true,
      spaceAfter: true
    }
  },
  {
    family: 'operator',
    name: 'plus',
    identifier: '+',
    freefem: {
      spaceBefore: true,
      spaceAfter: true
    },
    ejs: {
      spaceBefore: true,
      spaceAfter: true
    }
  },
  {
    family: 'operator',
    name: 'minus',
    identifier: '-',
    freefem: {
      spaceBefore: true,
      spaceAfter: true
    },
    ejs: {
      spaceBefore: true,
      spaceAfter: true
    }
  },
  {
    family: 'operator',
    name: 'time',
    identifier: '*',
    freefem: {
      spaceBefore: true,
      spaceAfter: true
    },
    ejs: {
      spaceBefore: true,
      spaceAfter: true
    }
  },
  {
    family: 'operator',
    name: 'divide',
    identifier: '/',
    freefem: {
      spaceBefore: true,
      spaceAfter: true
    },
    ejs: {
      spaceBefore: true,
      spaceAfter: true
    }
  },
  {
    family: 'operator',
    name: 'transpose',
    identifier: "'",
    freefem: {
      spaceAfter: true
    }
  },
  {
    family: 'operator',
    name: 'caret',
    identifier: '^'
  },
  {
    family: 'operator',
    name: 'comma',
    identifier: ',',
    freefem: {
      spaceAfter: true
    },
    ejs: {
      spaceAfter: true
    }
  },
  {
    family: 'operator',
    name: 'semiComma',
    identifier: ';',
    freefem: {
      spaceAfter: true
    },
    ejs: {
      spaceAfter: true
    }
  },
  {
    family: 'operator',
    name: 'colon',
    identifier: ':',
    freefem: {
      spaceBefore: true,
      spaceAfter: true
    },
    ejs: {
      spaceAfter: true
    }
  },
  {
    family: 'operator',
    name: 'dot',
    identifier: '.',
    freefem: {
      skip: true // Because of real numbers
    }
  }
]

/**
 * Types
 */
export const types: Def[] = [
  {
    family: 'string',
    name: 'type',
    identifier: 'int[int, int]'
  },
  {
    family: 'string',
    name: 'type',
    identifier: 'complex[int, int]'
  },
  {
    family: 'string',
    name: 'type',
    identifier: 'real[int, int]'
  },
  {
    family: 'string',
    name: 'type',
    identifier: 'int[int]'
  },
  {
    family: 'string',
    name: 'type',
    identifier: 'complex[int]'
  },
  {
    family: 'string',
    name: 'type',
    identifier: 'real[int]'
  },
  {
    family: 'string',
    name: 'type',
    identifier: 'int[string]'
  },
  {
    family: 'string',
    name: 'type',
    identifier: 'complex[string]'
  },
  {
    family: 'string',
    name: 'type',
    identifier: 'real[string]'
  },
  {
    family: 'string',
    name: 'type',
    identifier: 'bool'
  },
  {
    family: 'string',
    name: 'type',
    identifier: 'border'
  },
  {
    family: 'string',
    name: 'type',
    identifier: 'complex'
  },
  {
    family: 'string',
    name: 'type',
    identifier: 'fespace'
  },
  {
    family: 'string',
    name: 'type',
    identifier: 'func'
  },
  {
    family: 'string',
    name: 'type',
    identifier: 'int'
  },
  {
    family: 'string',
    name: 'type',
    identifier: 'macro'
  },
  {
    family: 'string',
    name: 'type',
    identifier: 'matrix'
  },
  {
    family: 'string',
    name: 'type',
    identifier: 'mesh'
  },
  {
    family: 'string',
    name: 'type',
    identifier: 'mesh3'
  },
  {
    family: 'string',
    name: 'type',
    identifier: 'problem',
    closeIdentifiers: [';'],
    dir: 1,
    freefem: {
      indent: true
    }
  },
  {
    family: 'string',
    name: 'type',
    identifier: 'real'
  },
  {
    family: 'string',
    name: 'type',
    identifier: 'solve',
    closeIdentifiers: [';'],
    dir: 1,
    freefem: {
      indent: true
    }
  },
  {
    family: 'string',
    name: 'type',
    identifier: 'string'
  },
  {
    family: 'string',
    name: 'type',
    identifier: 'varf',
    closeIdentifiers: [';'],
    dir: 1,
    freefem: {
      indent: true
    }
  }
]

/**
 * Keywords
 */
export const keywords: Def[] = [
  {
    family: 'string',
    name: 'keyword',
    identifier: 'break'
  },
  {
    family: 'string',
    name: 'keyword',
    identifier: 'catch',
    freefem: {
      spaceAfter: true,
      eatLineBreakBefore: true
    },
    ejs: {
      spaceAfter: true,
      eatLineBreakBefore: true
    }
  },
  {
    family: 'string',
    name: 'keyword',
    identifier: 'continue'
  },
  {
    family: 'string',
    name: 'keyword',
    identifier: 'else',
    freefem: {
      spaceBefore: true,
      spaceAfter: true,
      eatLineBreakBefore: true
    },
    ejs: {
      spaceBefore: true,
      spaceAfter: true,
      eatLineBreakBefore: true
    }
  },
  {
    family: 'string',
    name: 'keyword',
    identifier: 'for',
    freefem: {
      spaceAfter: true
    },
    ejs: {
      spaceAfter: true
    }
  },
  {
    family: 'string',
    name: 'keyword',
    identifier: 'if',
    freefem: {
      spaceAfter: true
    },
    ejs: {
      spaceAfter: true
    }
  },
  {
    family: 'string',
    name: 'keyword',
    identifier: 'try'
  },
  {
    family: 'string',
    name: 'keyword',
    identifier: 'while',
    freefem: {
      spaceAfter: true
    },
    ejs: {
      spaceAfter: true
    }
  }
]

/**
 * Customs
 */
export const customs: Def[] = [
  {
    family: 'string',
    name: 'custom',
    identifier: '[]'
  }
]

import { Def } from './typedef.d.js'

export const root: Def = {
  family: 'root',
  name: 'root',
  identifier: ''
}

export const inlineComment: Def = {
  family: 'comment',
  name: 'inline',
  identifier: '//'
}

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

export const string: Def = {
  family: 'string',
  name: 'text',
  identifier: ''
}

export const space: Def = {
  family: 'string',
  name: 'space',
  identifier: ' '
}

export const lineBreak: Def = {
  family: 'string',
  name: 'lineBreak',
  identifier: '\n'
}

export const blocks: Def[] = [
  {
    family: 'block',
    name: 'braceParenthesis',
    identifier: '})',
    dir: -1
  },
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
      spaceAfter: true,
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
      spaceBefore: true,
      indent: true,
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
    dir: -1
  },
  {
    family: 'block',
    name: 'ejsComment',
    identifier: '<%#',
    closeIdentifiers: ['-%>', '%>'],
    dir: 1,
    ejs: {
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
  }
]

export const types = [
  'int[int, int]',
  'complex[int, int]',
  'real[int, int]',
  'int[int]',
  'complex[int]',
  'real[int]',
  'int[string]',
  'complex[string]',
  'real[string]',
  'bool',
  'border',
  'complex',
  'fespace',
  'func',
  'int',
  'macro',
  'matrix',
  'mesh',
  'mesh3',
  'problem',
  'real',
  'solve',
  'string',
  'varf'
]

export const keywords = [
  'break',
  'catch',
  'continue',
  'else',
  'for',
  'if',
  'try',
  'while'
]

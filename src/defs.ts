export interface Def {
  family: 'root' | 'comment' | 'string' | 'block' | 'operator'
  name: string
  identifier: string
  type?: string
  dir?: -2 | -1 | 1
  spaceBefore?: true
  spaceAfter?: true
  lineBreakBefore?: true
  lineBreakAfter?: true
  enableEJS?: true
  disableEJS?: true
  indentEJS?: true
}

export const root: Def = {
  family: 'root',
  name: 'root',
  identifier: '',
  type: 'root'
}

export const inlineComment: Def = {
  family: 'comment',
  name: 'inline',
  identifier: '//',
  type: 'inline'
}

export const multilineComment: Def[] = [
  {
    family: 'comment',
    name: 'multilineOpen',
    identifier: '/*',
    type: 'multiline',
    dir: 1
  },
  {
    family: 'comment',
    name: 'multilineClose',
    identifier: '*/',
    dir: -1
  }
]

export const string: Def = {
  family: 'string',
  name: 'string',
  identifier: '',
  type: 'string'
}

export const space: Def = {
  family: 'string',
  name: 'space',
  identifier: ' ',
  type: 'space'
}

export const lineBreak: Def = {
  family: 'string',
  name: 'lineBreak',
  identifier: '\n',
  type: 'line_break'
}

export const blocks: Def[] = [
  {
    family: 'block',
    name: 'blockParenthesisClose',
    identifier: '})',
    dir: -1,
    indentEJS: true
  },
  {
    family: 'block',
    name: 'blockOpen',
    identifier: '{',
    type: 'block',
    dir: 1,
    spaceBefore: true,
    lineBreakAfter: true,
    indentEJS: true
  },
  {
    family: 'block',
    name: 'blockClose',
    identifier: '}',
    dir: -1,
    lineBreakBefore: true,
    lineBreakAfter: true,
    indentEJS: true
  },
  {
    family: 'block',
    name: 'arrayOpen',
    identifier: '[',
    type: 'array',
    dir: 1
  },
  {
    family: 'block',
    name: 'arrayClose',
    identifier: ']',
    dir: -1
  },
  {
    family: 'block',
    name: 'parenthesisOpen',
    identifier: '(',
    type: 'parenthesis',
    dir: 1
  },
  {
    family: 'block',
    name: 'parenthesisClose',
    identifier: ')',
    dir: -1
  },
  {
    family: 'block',
    name: 'ejsCommentOpen',
    identifier: '<%#',
    type: 'ejs_comment',
    dir: 1,
    spaceAfter: true,
    enableEJS: true
  },
  {
    family: 'block',
    name: 'ejsEscapeOpen',
    identifier: '<%=',
    type: 'ejs_escape',
    dir: 1,
    spaceAfter: true,
    enableEJS: true
  },
  {
    family: 'block',
    name: 'ejsUnescapeOpen',
    identifier: '<%-',
    type: 'ejs_unescape',
    dir: 1,
    spaceAfter: true,
    enableEJS: true
  },
  {
    family: 'block',
    name: 'ejsOpen',
    identifier: '<%',
    type: 'ejs',
    dir: 1,
    lineBreakAfter: true,
    enableEJS: true,
    indentEJS: true
  },
  {
    family: 'block',
    name: 'ejsTrimClose',
    identifier: '-%>',
    dir: -1,
    spaceBefore: true,
    disableEJS: true
  },
  {
    family: 'block',
    name: 'ejsClose',
    identifier: '%>',
    dir: -1,
    lineBreakBefore: true,
    lineBreakAfter: true,
    disableEJS: true
  }
]

export const operators: Def[] = [
  {
    family: 'operator',
    name: 'pow-1',
    identifier: '^-1',
    type: 'pow-1',
    spaceAfter: true
  },
  {
    family: 'operator',
    name: 'streamIn',
    identifier: '<<',
    type: 'stream_in',
    spaceBefore: true,
    spaceAfter: true
  },
  {
    family: 'operator',
    name: 'plusPlus',
    identifier: '++',
    type: 'plus_plus'
  },
  {
    family: 'operator',
    name: 'minusMinus',
    identifier: '--',
    type: 'minus_minus'
  },
  {
    family: 'operator',
    name: 'equalEqual',
    identifier: '==',
    type: 'equal_equal',
    spaceBefore: true,
    spaceAfter: true
  },
  {
    family: 'operator',
    name: 'notEqual',
    identifier: '!=',
    type: 'not_equal',
    spaceBefore: true,
    spaceAfter: true
  },
  {
    family: 'operator',
    name: 'plusEqual',
    identifier: '+=',
    type: 'plus_equal',
    spaceBefore: true,
    spaceAfter: true
  },
  {
    family: 'operator',
    name: 'minusEqual',
    identifier: '-=',
    type: 'minus_equal',
    spaceBefore: true,
    spaceAfter: true
  },
  {
    family: 'operator',
    name: 'test',
    identifier: '??',
    type: 'test',
    spaceBefore: true,
    spaceAfter: true
  },
  {
    family: 'operator',
    name: 'equal',
    identifier: '=',
    type: 'equal',
    spaceBefore: true,
    spaceAfter: true
  },
  {
    family: 'operator',
    name: 'plus',
    identifier: '+',
    type: 'plus',
    spaceBefore: true,
    spaceAfter: true
  },
  {
    family: 'operator',
    name: 'minus',
    identifier: '-',
    type: 'minus',
    spaceBefore: true,
    spaceAfter: true
  },
  {
    family: 'operator',
    name: 'time',
    identifier: '*',
    type: 'time',
    spaceBefore: true,
    spaceAfter: true
  },
  {
    family: 'operator',
    name: 'divide',
    identifier: '/',
    type: 'divide',
    spaceBefore: true,
    spaceAfter: true
  },
  {
    family: 'operator',
    name: 'transpose',
    identifier: "'",
    type: 'transpose',
    spaceAfter: true
  },
  {
    family: 'operator',
    name: 'caret',
    identifier: '^',
    type: 'caret'
  },
  {
    family: 'operator',
    name: 'comma',
    identifier: ',',
    type: 'comma',
    spaceAfter: true
  },
  {
    family: 'operator',
    name: 'semiComma',
    identifier: ';',
    type: 'semi-comma',
    spaceAfter: true
  },
  {
    family: 'operator',
    name: 'colon',
    identifier: ':',
    type: 'colon',
    spaceAfter: true
  }
]

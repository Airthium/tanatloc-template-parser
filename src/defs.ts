export interface Def {
  name: string
  identifier: string
  type?: string
  dir?: -1 | 1
  spaceBefore?: true
  spaceAfter?: true
  lineBreak?: true
  indent?: true
  enableEJS?: true
  disableEJS?: true
}

export const root: Def = {
  name: 'root',
  identifier: '',
  type: 'root'
}

export const inlineComment: Def = {
  name: 'inline',
  identifier: '//',
  type: 'inline'
}

export const multilineComment: Def[] = [
  {
    name: 'multilineOpen',
    identifier: '/*',
    type: 'multiline'
  },
  {
    name: 'multilineClose',
    identifier: '*/'
  }
]

export const string: Def = {
  name: 'string',
  identifier: '',
  type: 'string'
}

export const lineBreak: Def = {
  name: 'lineBreak',
  identifier: '\n',
  type: 'line_break'
}

export const blocks: Def[] = [
  {
    name: 'blockOpen',
    identifier: '{',
    type: 'block',
    dir: 1,
    spaceBefore: true,
    lineBreak: true,
    indent: true
  },
  {
    name: 'blockClose',
    identifier: '}',
    dir: -1,
    lineBreak: true
  },
  {
    name: 'arrayOpen',
    identifier: '[',
    type: 'array',
    dir: 1
  },
  {
    name: 'arrayClose',
    identifier: ']',
    dir: -1
  },
  {
    name: 'parenthesisOpen',
    identifier: '(',
    type: 'parenthesis',
    dir: 1
  },
  {
    name: 'parenthesisClose',
    identifier: ')',
    dir: -1
  },
  {
    name: 'ejsCommentOpen',
    identifier: '<%#',
    type: 'ejs_comment',
    dir: 1,
    spaceAfter: true,
    enableEJS: true
  },
  {
    name: 'ejsEscapeOpen',
    identifier: '<%=',
    type: 'ejs_escape',
    dir: 1,
    spaceAfter: true,
    enableEJS: true
  },
  {
    name: 'ejsUnescapeOpen',
    identifier: '<%-',
    type: 'ejs_unescape',
    dir: 1,
    spaceAfter: true,
    enableEJS: true
  },
  {
    name: 'ejsOpen',
    identifier: '<%',
    type: 'ejs',
    dir: 1,
    lineBreak: true,
    enableEJS: true,
    indent: true
  },
  {
    name: 'ejsTrimClose',
    identifier: '-%>',
    dir: -1,
    spaceBefore: true,
    disableEJS: true
  },
  {
    name: 'ejsClose',
    identifier: '%>',
    dir: -1,
    lineBreak: true,
    disableEJS: true
  }
]

export const operators: Def[] = [
  {
    name: 'streamIn',
    identifier: '<<',
    type: 'stream_in',
    spaceBefore: true,
    spaceAfter: true
  },
  {
    name: 'plusPlus',
    identifier: '++',
    type: 'plus_plus'
  },
  {
    name: 'minusMinus',
    identifier: '--',
    type: 'minus_minus'
  },
  {
    name: 'plusEqual',
    identifier: '+=',
    type: 'plus_equal',
    spaceBefore: true,
    spaceAfter: true
  },
  {
    name: 'minusEqual',
    identifier: '-=',
    type: 'minus_equal',
    spaceBefore: true,
    spaceAfter: true
  },
  {
    name: 'equal',
    identifier: '=',
    type: 'equal',
    spaceBefore: true,
    spaceAfter: true
  },
  {
    name: 'plus',
    identifier: '+',
    type: 'plus',
    spaceBefore: true,
    spaceAfter: true
  },
  {
    name: 'minus',
    identifier: '-',
    type: 'minus',
    spaceBefore: true,
    spaceAfter: true
  },
  {
    name: 'time',
    identifier: '*',
    type: 'time',
    spaceBefore: true,
    spaceAfter: true
  },
  {
    name: 'divide',
    identifier: '/',
    type: 'divide',
    spaceBefore: true,
    spaceAfter: true
  },
  {
    name: 'transpose',
    identifier: "'",
    type: 'transpose',
    spaceAfter: true
  }
]

export const comments = [
  {
    name: 'inline',
    identifier: '//'
  },
  { name: 'multilineStart', identifier: '/*' }
]

export const blocks = [
  {
    name: 'blockOpen',
    identifier: '{',
    type: 'block',
    dir: 1,
    lineBreak: true
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
    enableEJS: true
  },
  {
    name: 'ejsEscapeOpen',
    identifier: '<%=',
    type: 'ejs_escape',
    dir: 1,
    enableEJS: true
  },
  {
    name: 'ejsUnescapeOpen',
    identifier: '<%-',
    type: 'ejs_unescape',
    dir: 1,
    enableEJS: true
  },
  {
    name: 'ejsOpen',
    identifier: '<%',
    type: 'ejs',
    dir: 1,
    lineBreak: true,
    enableEJS: true
  },
  {
    name: 'ejsTrimClose',
    identifier: '-%>',
    dir: -1,
    lineBreak: true,
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

export const operators = [
  {
    name: 'streamIn',
    identifier: '<<',
    type: 'stream_in'
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
    type: 'plus_equal'
  },
  {
    name: 'minusEqual',
    identifier: '-=',
    type: 'minus_equal'
  },
  {
    name: 'equal',
    identifier: '=',
    type: 'equal'
  },
  {
    name: 'plus',
    identifier: '+',
    type: 'plus'
  },
  {
    name: 'minus',
    identifier: '-',
    type: 'minus'
  },
  {
    name: 'time',
    identifier: '*',
    type: 'time'
  },
  {
    name: 'divide',
    identifier: '/',
    type: 'divide'
  },
  {
    name: 'transpose',
    identifier: "'",
    type: 'transpose'
  }
]

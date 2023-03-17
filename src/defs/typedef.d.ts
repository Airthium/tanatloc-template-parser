export interface BeautifierParams {
  spaceBefore?: true
  spaceAfter?: true
  lineBreakBefore?: true
  lineBreakAfter?: true
  indent?: true
  keepInline?: true
  skip?: true
  eatLineBreakBefore?: true
}

export type Families = 'root' | 'comment' | 'string' | 'block' | 'operator'

export interface Def {
  family: Families
  name: string
  identifier: string
  closeIdentifiers?: string[]
  dir?: -1 | 1
  freefem?: BeautifierParams
  ejs?: BeautifierParams
  enableEJS?: true
  disableEJS?: true
}

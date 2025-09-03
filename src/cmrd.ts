export type CmrdArgIndex = number
export type CmrdIf = [CmrdArgIndex, string]
export type CmrdExpression = string | CmrdArgIndex | CmrdIf

type GetArgsType<T> = T extends [infer Head, ...infer Tail]
  ? Head extends CmrdExpression
    ? Head extends CmrdArgIndex
      ? [arg?: string, ...GetArgsType<Tail>, ...args: Array<string | undefined>]
      : [...GetArgsType<Tail>]
    : [...args: Array<string | undefined>]
  : [...args: Array<string | undefined>]

function getMaxArgPlaceholder(expressions: CmrdExpression[]): CmrdArgIndex {
  return Math.max(...expressions.filter((exp) => typeof exp === 'number'))
}

function isNil(value: unknown): value is null | undefined {
  return value == null
}

function isCmdArgIndex(exp: CmrdExpression): exp is CmrdArgIndex {
  return typeof exp === 'number'
}

function isCmdIf(exp: CmrdExpression): exp is CmrdIf {
  return (
    Array.isArray(exp) &&
    exp.length === 2 &&
    isCmdArgIndex(exp[0]) &&
    typeof exp[1] === 'string'
  )
}

export function cmrd<TExprs extends CmrdExpression[]>(
  strings: TemplateStringsArray,
  ...exprs: TExprs
) {
  const highestArgKey = getMaxArgPlaceholder(exprs)

  return (...args: GetArgsType<TExprs>): string => {
    const getExprValue = (expr: CmrdExpression | undefined): string => {
      if (isNil(expr)) return ''
      if (isCmdArgIndex(expr)) return args[expr] || ''
      if (isCmdIf(expr)) return args[expr[0]] == null ? '' : expr[1]

      return expr
    }

    const parsedCmd = strings.reduce((acc, str, i) => {
      const arg = getExprValue(exprs[i])?.trim()
      const part = `${str}${arg}`
      if (acc.endsWith(' ') && part.startsWith(' ')) {
        return `${acc}${part.trimStart()}`
      }
      return `${acc}${part}`
    }, '')

    const extraArgs = args.slice(highestArgKey + 1).join(' ')

    return `${parsedCmd} ${extraArgs}`.trim()
  }
}

export default cmrd

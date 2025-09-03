import { describe, expect, test } from 'bun:test'
import { cmrd } from '../src'

describe('cmrd', () => {
  test('without placeholder', () => {
    const cm = cmrd`npm i`
    expect(cm()).toBe('npm i')
  })

  test('single positional placeholder', () => {
    const cm = cmrd`npm i ${0}`
    expect(cm('cmrd')).toBe('npm i cmrd')
  })

  test('multiple placeholders and single argument', () => {
    const cm = cmrd`npx --yes ${0} --verbose ${1}`
    expect(cm('create-nx-workspace')).toBe(
      'npx --yes create-nx-workspace --verbose'
    )
  })

  test('multiple placeholders and multiple arguments', () => {
    const cm = cmrd`npx --yes ${0} --verbose ${1}`
    expect(cm('create-nx-workspace cmrd', '--preset=apps')).toBe(
      'npx --yes create-nx-workspace cmrd --verbose --preset=apps'
    )
  })

  test('conditional placeholder: false', () => {
    const cm = cmrd`npm run ${0} ${[1, '--']} ${1}`
    expect(cm()).toBe('npm run')
    expect(cm('build')).toBe('npm run build')
  })

  test('conditional placeholder: true', () => {
    const cm = cmrd`npm run ${0} ${[1, '--']} ${1}`
    expect(cm('build', '--skip-cache')).toBe('npm run build -- --skip-cache')
  })

  test('non-sequential placeholders and highest key handling', () => {
    const cm = cmrd`cmd ${1} ${0}`
    expect(cm('first', 'second')).toBe('cmd second first')
  })

  test('only higher index placeholder present', () => {
    const cm = cmrd`do ${2}`
    // indexes: [2], highestKey = 2
    // args[2] provided => placed, extras start from index 3
    expect(cm(undefined, undefined, 'it')).toBe('do it')
    expect(cm(undefined, undefined, 'it', '--flag', '--another')).toBe(
      'do it --flag --another'
    )
  })

  test('empty string arguments preserved', () => {
    const cm = cmrd`echo ${0}:${1}`
    expect(cm('', '')).toBe('echo :')
  })

  test('no placeholders but extra args are appended', () => {
    const cm = cmrd`base`
    expect(cm('--a', '--b')).toBe('base --a --b')
  })

  test('spacing correctness with missing optional args', () => {
    const cm = cmrd`a ${0} b ${1} c`
    // When args missing, segments should trim correctly without double spaces
    expect(cm('X')).toBe('a X b c')
  })
})

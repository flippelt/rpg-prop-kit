import { describe, it, expect } from 'vitest'
import { cx } from './cx'

describe('cx', () => {
  it('junta classes separadas por espaço', () => {
    expect(cx('a', 'b', 'c')).toBe('a b c')
  })

  it('descarta valores falsy (false, null, undefined)', () => {
    expect(cx('a', false, null, undefined, 'b')).toBe('a b')
  })

  it('descarta string vazia', () => {
    expect(cx('a', '', 'b')).toBe('a b')
  })

  it('retorna string vazia quando tudo é falsy', () => {
    expect(cx(false, null, undefined)).toBe('')
  })

  it('retorna string vazia sem argumentos', () => {
    expect(cx()).toBe('')
  })

  it('preserva a única classe restante sem espaços extras', () => {
    expect(cx(false, 'only', null)).toBe('only')
  })
})

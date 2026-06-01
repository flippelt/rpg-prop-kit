/** Junta classes condicionais, descartando valores falsy. */
export const cx = (...parts: Array<string | false | null | undefined>) =>
  parts.filter(Boolean).join(' ')

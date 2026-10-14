import { describe, expect, it, vi, beforeEach } from 'vitest'
import { render, waitFor } from '@testing-library/react'

const update = vi.fn()
const destroy = vi.fn()
const create = vi.fn()
vi.mock('../../gpu/crtOverlay', () => ({ createCrtOverlay: (...a: unknown[]) => create(...a) }))

import { CRTGpuOverlay } from './CRTGpuOverlay'
import { CRTScreen } from '../CRTScreen'

describe('CRTGpuOverlay', () => {
  beforeEach(() => {
    update.mockReset()
    destroy.mockReset()
    create.mockReset()
  })

  it('avisa unsupported quando não há WebGPU', async () => {
    create.mockResolvedValue(null)
    const onStatus = vi.fn()
    render(<CRTGpuOverlay onStatusChange={onStatus} />)
    await waitFor(() => expect(onStatus).toHaveBeenCalledWith('unsupported'))
  })

  it('liga, repassa mudanças de opção e libera ao desmontar', async () => {
    create.mockResolvedValue({ update, destroy })
    const onStatus = vi.fn()
    const { rerender, unmount } = render(<CRTGpuOverlay grain={0.2} onStatusChange={onStatus} />)
    await waitFor(() => expect(onStatus).toHaveBeenCalledWith('gpu'))
    expect(create.mock.calls[0][1]).toMatchObject({ grain: 0.2 })
    rerender(<CRTGpuOverlay grain={0.8} onStatusChange={onStatus} />)
    expect(update).toHaveBeenLastCalledWith(expect.objectContaining({ grain: 0.8 }))
    unmount()
    expect(destroy).toHaveBeenCalledTimes(1)
  })

  it('no CRTScreen, a GPU ativa tira scanlines/sweep/vinheta do CSS e respeita as props', async () => {
    create.mockResolvedValue({ update, destroy })
    const { container } = render(<CRTScreen gpu={{ mask: 0.9 }} vignette={false} />)
    await waitFor(() =>
      expect(container.querySelector('.rpk-crt')!.className).toContain('rpk-crt--gpu'),
    )
    expect(create.mock.calls[0][1]).toMatchObject({ mask: 0.9, vignette: 0 })
  })
})

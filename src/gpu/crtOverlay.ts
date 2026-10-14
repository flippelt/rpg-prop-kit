import {
  CRT_FRAME_INTERVAL_MS,
  packCrtUniforms,
  resolveCrtOverlayOptions,
  type CrtOverlayOptions,
  type ResolvedCrtOverlayOptions,
} from './crtOverlayParams'

/**
 * Saída pré-multiplicada: `rgb` é só a luz somada, `a` = escurecimento +
 * luz. Mistura normal resulta em `luz + fundo·(1 − a)`.
 */
const CRT_WGSL = /* wgsl */ `
struct U {
  res: vec2f,
  time: f32,
  dpr: f32,
  scanlines: f32,
  mask: f32,
  grain: f32,
  interference: f32,
  vignette: f32,
  fringe: f32,
  glare: f32,
  bandSpeed: f32,
  color: vec3f,
  _pad: f32,
}
@group(0) @binding(0) var<uniform> u: U;

@vertex fn vs(@builtin(vertex_index) i: u32) -> @builtin(position) vec4f {
  var p = array<vec2f, 3>(vec2f(-1.0, -1.0), vec2f(3.0, -1.0), vec2f(-1.0, 3.0));
  return vec4f(p[i], 0.0, 1.0);
}

fn pcg(v: u32) -> u32 {
  let s = v * 747796405u + 2891336453u;
  let w = ((s >> ((s >> 28u) + 4u)) ^ s) * 277803737u;
  return (w >> 22u) ^ w;
}

@fragment fn fs(@builtin(position) pos: vec4f) -> @location(0) vec4f {
  let px = pos.xy;
  let uv = px / u.res;
  let tau = 6.2831853;

  // Escurecimento ------------------------------------------------------
  let rowPeriod = 3.0 * u.dpr;
  let row = 0.5 + 0.5 * cos(px.y * tau / rowPeriod);
  var dark = u.scanlines * 0.32 * (1.0 - row);

  let col = (px.x / u.dpr) % 3.0;
  dark += u.mask * 0.18 * step(2.0, col);

  let c = (uv - 0.5) * vec2f(1.0, 1.15);
  let v = smoothstep(0.35, 0.78, length(c));
  dark += u.vignette * 0.6 * v;

  // Luz ------------------------------------------------------------------
  let frame = u32(u.time * 30.0);
  let cell = vec2u(px / u.dpr);
  let n = f32(pcg(cell.x ^ pcg(cell.y + pcg(frame)))) / 4294967295.0;
  var light = u.color * (u.grain * 0.07 * n);

  let bandY = fract(u.time * u.bandSpeed);
  let dy = uv.y - bandY;
  let band = exp(-dy * dy / 0.0025);
  light += u.color * (u.interference * 0.06 * band);

  let edgeL = 1.0 - smoothstep(0.0, 0.06, uv.x);
  let edgeR = smoothstep(0.94, 1.0, uv.x);
  light += vec3f(1.0, 0.2, 0.25) * (u.fringe * 0.07 * edgeL);
  light += vec3f(0.2, 0.45, 1.0) * (u.fringe * 0.07 * edgeR);

  let g = 1.0 - smoothstep(0.0, 0.35, abs(uv.x * 0.8 + uv.y - 0.45));
  light += vec3f(1.0) * (u.glare * 0.045 * g * (1.0 - uv.y));

  let lum = max(light.r, max(light.g, light.b));
  let a = clamp(dark + lum, 0.0, 1.0);
  return vec4f(light, a);
}
`

export interface CrtOverlay {
  /** Atualiza opções (mescla com as atuais). */
  update(opts: CrtOverlayOptions): void
  /** Para a animação e libera a GPU. */
  destroy(): void
}

const reducedMotionQuery = () =>
  typeof window !== 'undefined' ? window.matchMedia?.('(prefers-reduced-motion: reduce)') : undefined

/**
 * Liga o overlay CRT num `<canvas>` posicionado sobre o conteúdo. Devolve
 * null quando não há WebGPU (o app segue com os efeitos em CSS).
 *
 * O canvas deve ter `pointer-events: none` e ocupar a área da tela.
 */
export async function createCrtOverlay(
  canvas: HTMLCanvasElement,
  opts: CrtOverlayOptions = {},
): Promise<CrtOverlay | null> {
  const gpu = typeof navigator !== 'undefined' ? navigator.gpu : undefined
  if (!gpu) return null

  let device: GPUDevice
  let context: GPUCanvasContext
  let pipeline: GPURenderPipeline
  try {
    const adapter = await gpu.requestAdapter({ powerPreference: 'low-power' })
    if (!adapter) return null
    device = await adapter.requestDevice()
    const ctx = canvas.getContext('webgpu')
    if (!ctx) {
      device.destroy()
      return null
    }
    context = ctx
    const format = gpu.getPreferredCanvasFormat()
    context.configure({ device, format, alphaMode: 'premultiplied' })
    const module = device.createShaderModule({ code: CRT_WGSL })
    pipeline = await device.createRenderPipelineAsync({
      layout: 'auto',
      vertex: { module, entryPoint: 'vs' },
      fragment: {
        module,
        entryPoint: 'fs',
        targets: [{ format }],
      },
      primitive: { topology: 'triangle-list' },
    })
  } catch (err) {
    console.warn('[rpg-prop-kit] CRT em WebGPU indisponível:', err)
    return null
  }

  const uniform = device.createBuffer({
    size: 64,
    usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
  })
  const bindGroup = device.createBindGroup({
    layout: pipeline.getBindGroupLayout(0),
    entries: [{ binding: 0, resource: { buffer: uniform } }],
  })
  const data = new Float32Array(16)

  const mq = reducedMotionQuery()
  let current: CrtOverlayOptions = { ...opts }
  let resolved: ResolvedCrtOverlayOptions
  const resolve = () => {
    resolved = resolveCrtOverlayOptions(current, getComputedStyle(canvas).color, !!mq?.matches)
  }
  resolve()

  let lost = false
  let destroyed = false
  device.lost.then(() => {
    lost = true
  })

  const draw = (time: number) => {
    if (lost || destroyed) return
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    const w = Math.max(1, Math.round(canvas.clientWidth * dpr))
    const h = Math.max(1, Math.round(canvas.clientHeight * dpr))
    if (canvas.width !== w || canvas.height !== h) {
      canvas.width = w
      canvas.height = h
    }
    device.queue.writeBuffer(uniform, 0, packCrtUniforms(resolved, w, h, time, dpr, data))
    const encoder = device.createCommandEncoder()
    const pass = encoder.beginRenderPass({
      colorAttachments: [
        {
          view: context.getCurrentTexture().createView(),
          clearValue: { r: 0, g: 0, b: 0, a: 0 },
          loadOp: 'clear',
          storeOp: 'store',
        },
      ],
    })
    pass.setPipeline(pipeline)
    pass.setBindGroup(0, bindGroup)
    pass.draw(3)
    pass.end()
    device.queue.submit([encoder.finish()])
  }

  let raf = 0
  let last = 0
  const start = performance.now()
  const tick = (now: number) => {
    raf = requestAnimationFrame(tick)
    if (now - last < CRT_FRAME_INTERVAL_MS - 1) return
    last = now
    draw((now - start) / 1000)
  }

  // Movimento reduzido: um quadro parado, redesenhado em resize/mudança.
  const STATIC_TIME = 7.3
  const ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(() => {
    if (resolved.reducedMotion) draw(STATIC_TIME)
  }) : null
  ro?.observe(canvas)

  const apply = () => {
    cancelAnimationFrame(raf)
    if (resolved.reducedMotion) draw(STATIC_TIME)
    else raf = requestAnimationFrame(tick)
  }
  const onMotionChange = () => {
    resolve()
    apply()
  }
  mq?.addEventListener?.('change', onMotionChange)
  apply()

  return {
    update(next) {
      current = { ...current, ...next }
      resolve()
      apply()
    },
    destroy() {
      if (destroyed) return
      destroyed = true
      cancelAnimationFrame(raf)
      ro?.disconnect()
      mq?.removeEventListener?.('change', onMotionChange)
      context.unconfigure()
      device.destroy()
    },
  }
}

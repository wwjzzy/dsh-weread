/**
 * dsh-weread — host half.
 *
 * Owns the WeRead service, the four agent tools, and the Fetch route the
 * sidebar panel calls. Tools and the panel share one service instance.
 */

import Schema from '@deepseek-ai/schemastery'
import { createRpcRoute } from './lib/rpc.js'
import { WereadService } from './lib/service.js'
import { registerTools } from './lib/tools.js'

export const name = 'weread'

export const inject = ['tools']

export const Config = Schema.object({
  cookie: Schema.string().default('').description('weread.qq.com Cookie header; leave empty to use QR login or demo mode'),
})

/**
 * Mount the plugin.
 * @param ctx - host plugin context.
 * @param config - the bundle row's config values.
 */
export function apply(ctx, config = {}) {
  const service = new WereadService({ ctx, config })
  registerTools(ctx, service)

  ctx.inject(['connection'], (scope) => {
    try {
      scope.connection.fetch.register(createRpcRoute(service))
    } catch (error) {
      ctx.logger?.warn('[weread] 面板通道注册失败，Agent 工具仍可用：%s', error?.message ?? String(error))
    }
  })

  ctx.logger?.info('[weread] ready (data=%s)', service.config.dataDir)
}

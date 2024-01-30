import request from 'supertest'
import { TRPCClientError, httpLinkFactory } from '@trpc/client'
type App = Parameters<typeof request>[0]
type Requester = Parameters<typeof httpLinkFactory>[0]['requester']
type HTTPResult = Awaited<ReturnType<Requester>['promise']>

interface SupertestLinkOptions {
  headers?: Record<string, string>
  trpcPath: string
}

export const supertestLink = (app: App, options: SupertestLinkOptions) => {
  const supertestRequester: Requester = requesterOptions => {
    const input = requesterOptions['input'] as any

    const promise = new Promise<HTTPResult>((resolve, reject) => {
      const method = requesterOptions.type === 'query' ? 'get' : 'post'
      const headers = { accept: 'application/json', ...options.headers }
      const url =
        method === 'get'
          ? `${options.trpcPath}/${requesterOptions.path}?input=${encodeURIComponent(JSON.stringify(input))}`
          : `${options.trpcPath}/${requesterOptions.path}`

      request(app)
        [method](url)
        .send(input)
        .set(headers)
        .then(res => {
          const httpResult: HTTPResult = {
            json: res.body,
            meta: { response: { json: () => res.body }, responseJSON: res.body },
          }
          return resolve(httpResult)
        })
        .catch(err => {
          return reject(TRPCClientError.from(err, {}))
        })
    })

    const cancel = () => {}

    return { promise, cancel }
  }

  return httpLinkFactory({ requester: supertestRequester })({ url: '', headers: options.headers })
}
const UPSTREAM = "https://social-network.samuraijs.com/api/1.1"

/**
 * Production-only proxy for SamuraiJS.
 * Plain Vercel rewrites forward the browser Origin header; SamuraiJS then
 * responds 403 to POSTs from *.vercel.app. This function re-fetches upstream
 * without Origin / Cookie / Referer.
 */
async function proxy(request: Request): Promise<Response> {
  const url = new URL(request.url)
  const path = (url.searchParams.get("path") ?? "").replace(/^\/+/, "")

  const target = new URL(`${UPSTREAM}/${path}`)
  url.searchParams.forEach((value, key) => {
    if (key !== "path") target.searchParams.append(key, value)
  })

  const headers = new Headers()
  const apiKey =
    request.headers.get("api-key") ??
    request.headers.get("API-KEY") ??
    process.env.VITE_API_KEY
  const authorization = request.headers.get("authorization")
  const contentType = request.headers.get("content-type")

  if (apiKey) headers.set("API-KEY", apiKey)
  if (authorization) headers.set("Authorization", authorization)
  if (contentType) headers.set("Content-Type", contentType)

  const init: RequestInit = { method: request.method, headers }
  if (request.method !== "GET" && request.method !== "HEAD") {
    init.body = await request.arrayBuffer()
  }

  const upstream = await fetch(target, init)

  return new Response(await upstream.arrayBuffer(), {
    status: upstream.status,
    headers: {
      "Content-Type":
        upstream.headers.get("Content-Type") ?? "application/json",
    },
  })
}

export const GET = proxy
export const POST = proxy
export const PUT = proxy
export const DELETE = proxy
export const PATCH = proxy
export const OPTIONS = () => new Response(null, { status: 204 })

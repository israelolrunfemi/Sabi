import { NextResponse } from "next/server";

const BACKEND_API_URL = process.env.BACKEND_API_URL;

if (!BACKEND_API_URL) {
  throw new Error("BACKEND_API_URL is not defined");
}

const HOP_BY_HOP_HEADERS = new Set([
  "connection",
  "keep-alive",
  "proxy-authenticate",
  "proxy-authorization",
  "te",
  "trailer",
  "transfer-encoding",
  "upgrade",
  "content-length",
  "host",
]);

function buildBackendUrl(request: Request) {
  const incomingUrl = new URL(request.url);
  const backendUrl = new URL(BACKEND_API_URL as string);
  const incomingPath = incomingUrl.pathname.replace(/^\/api\/?/, "");
  const basePath = backendUrl.pathname.replace(/\/$/, "");
  const nextPath = incomingPath ? `${basePath}/${incomingPath}` : basePath || "/";

  backendUrl.pathname = nextPath.replace(/\/{2,}/g, "/");
  backendUrl.search = incomingUrl.search;

  return backendUrl;
}

function copyHeaders(source: Headers) {
  const headers = new Headers();

  source.forEach((value, key) => {
    if (HOP_BY_HOP_HEADERS.has(key.toLowerCase())) return;
    headers.set(key, value);
  });

  return headers;
}

async function toRequestBody(request: Request) {
  if (request.method === "GET" || request.method === "HEAD") {
    return undefined;
  }

  const body = await request.arrayBuffer();
  return body.byteLength > 0 ? body : undefined;
}

export async function proxyRequest(request: Request) {
  const targetUrl = buildBackendUrl(request);
  const upstreamResponse = await fetch(targetUrl, {
    method: request.method,
    headers: copyHeaders(request.headers),
    body: await toRequestBody(request),
    cache: "no-store",
    redirect: "manual",
  });

  return new NextResponse(upstreamResponse.body, {
    status: upstreamResponse.status,
    statusText: upstreamResponse.statusText,
    headers: copyHeaders(upstreamResponse.headers),
  });
}

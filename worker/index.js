import { onRequest as handleEstimateRequest } from "../functions/api/estimate.js";

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    if (url.pathname === "/api/estimate" || url.pathname === "/api/estimate/") {
      return handleEstimateRequest({ request, env, ctx });
    }

    if (url.pathname.startsWith("/api/")) {
      return Response.json({ ok: false, message: "Not found" }, { status: 404 });
    }

    return env.ASSETS.fetch(request);
  },
};

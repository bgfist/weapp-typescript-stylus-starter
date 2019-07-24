type ApiMode = "mock" | "dev" | "prod"

const apiMode = "dev" as ApiMode

const apiEndPoints: { [mode in ApiMode]: string } = {
  mock: "https://apiview.funxi.cn",
  dev: "https://public-gateway-dev.funxi.cn",
  prod: "https://public-gateway.funxi.cn"
}

export default {
  apiMode,
  baseUrl: apiEndPoints[apiMode]
}

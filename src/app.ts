interface App {
  globalInfo: number
}

App<App>({
  globalInfo: 1,
  onError(error) {
    console.error(`App Error: ${error}, globalInfo: ${this.globalInfo}`)
  }
})

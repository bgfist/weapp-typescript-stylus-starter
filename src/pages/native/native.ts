Page({
  data: {
    username: "jack",
    age: 100
  },
  onLoad() {
    this.myMethod()
    this.setData({
      age: this.data.age + 1
    })
  },
  myVar: {
    disabled: true
  },
  myMethod() {
    if (this.myVar.disabled) {
      return
    }

    if (this.route === "/") {
      console.log("ok")
    }
  }
})

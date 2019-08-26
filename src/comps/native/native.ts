Component({
  properties: {
    propA: {
      type: Number,
      value: 100
    }
  },
  data: {
    username: "jack"
  },
  options: {
    addGlobalClass: true
  },
  methods: {
    myMethod() {
      this.myMethod2()
    },
    myMethod2() {
      console.log("ok")
    }
  },
  attached() {
    this.myMethod()
  },
  observers: {
    username() {
      this.myMethod2()
      this.setData({
        username: "rose"
      })
    }
  }
})

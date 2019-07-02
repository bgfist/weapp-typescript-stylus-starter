import { createHookRunner, diffHookReturnData } from "../src/node_modules/@bgfist/weact"
import { Demo } from "../src/comps/hook/hook"

describe("Demo", () => {
  const hook = jest.fn(Demo)
  const runner = createHookRunner(hook, {
    start: 1,
    end: 2
  })

  test("init render ran", () => {
    expect(hook).toBeCalled()
  })

  test("init render diff", () => {
    expect(diffHookReturnData(hook.mock.results[0].value, undefined)).toEqual({
      count: 1,
      testNum: 0,
      total: 4,
      userInfo: {
        name: "jack"
      }
    })
  })

  test("second render, the same props", () => {
    runner.run()
    expect(diffHookReturnData(hook.mock.results[1].value, hook.mock.results[0].value)).toEqual({})
  })

  test("third render, different props", () => {
    runner.run({
      start: 2,
      end: 2
    })
    expect(diffHookReturnData(hook.mock.results[2].value, hook.mock.results[1].value)).toEqual({
      total: 5
    })
  })

  test("forth render, invoke method", () => {
    const { incrCount } = hook.mock.results[2].value
    incrCount()

    expect(diffHookReturnData(hook.mock.results[3].value, hook.mock.results[2].value)).toEqual({
      total: 6,
      count: 2
    })
  })
})

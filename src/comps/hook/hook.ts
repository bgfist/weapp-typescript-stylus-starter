import { FComp, useState, useEffect, useLayoutEffect, useThisAsComp } from "@bgfist/weact"
import { useSelector, useActionCreator } from "@bgfist/weact-redux"
import { AppState, addTest } from "../../store/index"

export interface Properties {
  start: number
  end: number
}

function useQueryDataSet() {
  const funcStyle = useThisAsComp(function() {
    this.createSelectorQuery()
      .select("#the-id")
      .fields(
        {
          dataset: true,
          scrollOffset: true
        },
        res => {
          console.log("in comp", res)
        }
      )
      .exec()
  })
  const arrowStyle = useThisAsComp(self => {
    self
      .createSelectorQuery()
      .select("#the-id")
      .fields(
        {
          rect: true
        },
        res => {
          console.log("in comp", res)
        }
      )
      .exec()
  })

  return () => {
    // funcStyle()
    arrowStyle()
  }
}

export function Demo(prop: Properties) {
  const { start, end } = prop

  const [count, setCount] = useState(1)
  const [userInfo, setUserInfo] = useState({
    name: "jack"
  })

  useEffect(() => {
    const timer = setTimeout(() => console.log("timer trigger"), count * 1000)
    return () => clearTimeout(timer)
  }, [count])

  const queryDataSet = useQueryDataSet()

  useEffect(queryDataSet)
  useLayoutEffect(queryDataSet)

  const incrCount = () => setCount(count + 1)
  const decrCount = () => setCount(s => s - 1)

  const testNum = useSelector((state: AppState) => state.test.num)

  const addTestAction = useActionCreator(addTest)

  const tapAddTest = () => addTestAction(start)

  const changeName = () => setUserInfo(u => ({ name: "weact" }))

  return {
    count,
    total: count + start + end,
    userInfo,
    testNum,
    incrCount,
    decrCount,
    tapAddTest,
    changeName
  }
}

FComp(Demo, { start: 4, end: 5 })

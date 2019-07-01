import { FComp, useState, useEffect, useLayoutEffect, useThisAsComp } from "@bgfist/weact"
import { useSelector, useActionCreator } from "@bgfist/weact-redux"
import { AppState, addTest } from "../../store/index"

interface Properties {
  start: number
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

function Demo(prop: Properties) {
  const { start } = prop

  const [count, setCount] = useState(1)
  const [name] = useState("jack")

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

  return {
    count,
    name,
    testNum,
    incrCount,
    decrCount,
    tapAddTest
  }
}

FComp(Demo, { start: 4 })

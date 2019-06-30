import { FPage, useState, useEffect, useLayoutEffect } from "../../hooks"
import { useSelector, useActionCreator } from "../../weapp-redux/index"
import { AppState, addTest } from "../../store/index"

function queryDataSet() {
  wx.createSelectorQuery()
    .select("#the-id")
    .fields(
      {
        dataset: true,
        scrollOffset: true
      },
      res => {
        console.log("in page", res)
      }
    )
    .exec()
}

function Demo() {
  const [count, setCount] = useState(1)
  const [name] = useState("jack")

  useEffect(() => {
    const timer = setTimeout(() => console.log("timer trigger"), count * 1000)
    return () => clearTimeout(timer)
  }, [count])

  useEffect(queryDataSet)

  useLayoutEffect(queryDataSet)

  const incrCount = () => setCount(count + 1)
  const decrCount = () => setCount(s => s - 1)

  const testNum = useSelector((state: AppState) => state.test.num)

  const addTestAction = useActionCreator(addTest)

  const tapAddTest = () => addTestAction(3)

  return {
    count,
    name,
    testNum,
    incrCount,
    decrCount,
    tapAddTest
  }
}

FPage(Demo)

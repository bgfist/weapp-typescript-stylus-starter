import { FComp, useRef } from "@bgfist/weact"
import { useModal } from "../../hooks/ui"

interface Props {
  width: string
  position: "left" | "right"
}

function useDrawer(position: "left" | "right") {
  const $useModal = useModal()

  const touchX = useRef<number>(NaN)
  const previousTouchX = useRef<number>(NaN)

  const onDragging = (e: wx.TouchEvent) => {
    previousTouchX.current = touchX.current
    touchX.current = e.touches[0].clientX
  }

  const onDragged = (e: wx.TouchEvent) => {
    const $distance = previousTouchX.current - touchX.current
    const distance = position === "right" ? -$distance : $distance
    if (distance > 20) {
      $useModal.closeModal()
    }
    touchX.current = NaN
    previousTouchX.current = NaN
  }

  return {
    ...$useModal,
    onDragging,
    onDragged
  }
}

function FDrawerComp(props: Props) {
  return useDrawer(props.position)
}

FComp(FDrawerComp, {
  width: "750rpx",
  position: "left"
})

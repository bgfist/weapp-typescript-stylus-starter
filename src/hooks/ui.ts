import { useState, useEffect } from "@bgfist/weact"
import { noop } from "../utils/utils"

export function useModal() {
  const [modalVisible, updateModalVisible] = useState(false)
  const openModal = () => updateModalVisible(true)
  const closeModal = () => updateModalVisible(false)

  return {
    modalVisible,
    openModal,
    closeModal,
    noop
  }
}

export function useSubmit(submitFn: (done: AnyFunction) => any) {
  const [submitting, updateSubmitting] = useState(false)
  const submit = async () => {
    if (submitting) {
      return
    }
    updateSubmitting(true)
    await submitFn(() => {
      updateSubmitting(false)
    })
  }

  return {
    submit,
    submitting
  }
}

export function useAccordion() {
  const [accordionOpenIndex, updateAccordionOpenIndex] = useState(-1)

  const toggleAccordionOpen = (e: wx.CustomEvent) => {
    const $accordionOpenIndex = Number(e.currentTarget.dataset.idx)
    if ($accordionOpenIndex === accordionOpenIndex) {
      updateAccordionOpenIndex(-1)
    } else {
      updateAccordionOpenIndex($accordionOpenIndex)
    }
  }

  return {
    accordionOpenIndex,
    toggleAccordionOpen
  }
}

export function useTab(initialTab = -1) {
  const [currentTab, updateCurrentTab] = useState(initialTab)
  const [swiperHeight, updateSwiperHeight] = useState(0)
  const [swiperDuration, updateSwiperDuration] = useState(150)

  const switchTab = (e: wx.CustomEvent) => {
    updateSwiperDuration(0)
    updateCurrentTab(Number(e.currentTarget.dataset.idx))
    updateSwiperDuration(150)
  }

  const onSwiperChange = (e: wx.CustomEvent) => {
    updateCurrentTab(e.detail.current)
  }

  useEffect(() => {
    const query = wx.createSelectorQuery()
    query
      .select("#swiper")
      .boundingClientRect()
      .exec((res: wx.BoundingClientRectCallbackResult[]) => {
        const swiperHeight = res[0].height
        updateSwiperHeight(swiperHeight)
      })
  }, [])

  return {
    currentTab,
    swiperHeight,
    swiperDuration,
    updateCurrentTab,
    onSwiperChange,
    switchTab
  }
}

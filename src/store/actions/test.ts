import { createActionCreator } from "../utils"

export const addTest = createActionCreator<number>("addTest")

export const doubleTest = createActionCreator("doubleTest")

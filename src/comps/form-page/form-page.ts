import { FComp, useLayoutEffect, useMemo, useState, useThisAsComp } from "@bgfist/weact"
import { useFieldInput } from "../../hooks/data"
import { put } from "../../utils/request"
import dayjs = require("dayjs")
import { useSubmit } from "../../hooks/ui"

const EVENT_SUBMIT = "submit"

interface IField {
  type: string
  name: string
  label: string
  valueType?: any
  required?: boolean
}

interface DateField extends IField {
  type: "date"
  valueType?: string // <picker mode="date" fields="{{valueType}}">
  limit: "past" | "future"
}

interface Option {
  label: string
  value: any
}

interface SelectorField extends IField {
  type: "selector"
  valueType: Option[] // <picker mode="selector" range="{{valueType}}" range-key="label">
}

interface InputField extends IField {
  type: "input"
  valueType?: string // <input type="{{valueType}}">
}

interface TextAreaField extends IField {
  type: "textarea"
}

interface SwitchField extends IField {
  type: "switch"
}

interface PercentField extends IField {
  type: "percent"
}

interface CustomField extends IField {
  type: "custom"
}

type Field = DateField | SelectorField | InputField | TextAreaField | SwitchField | PercentField | CustomField
type Section = Field[]

interface Props {
  fixTextArea: boolean
  fields: Section[]
  disabledFields: {
    [field: string]: boolean
  }
  data: AnyObject
  submitText: string
  url: string
  params: AnyObject
}

const pastDateMax = dayjs().format("YYYY-MM-DD")
const futureDateMin = dayjs()
  .add(1, "day")
  .format("YYYY-MM-DD")
const pickNoneOption: Option = {
  label: "请选择",
  value: undefined
}
const booleanTypes: Option[] = [
  {
    value: 1,
    label: "否"
  },
  {
    value: 0,
    label: "是"
  }
]

function makeFormData(fields: Section[], data: AnyObject) {
  return fields.reduce(
    (form, section) => {
      section.forEach(({ name, type, valueType }) => {
        // 不处理自定义字段
        if (type === "custom") {
          return
        }

        // 编辑时，找到表单字段的原始值
        if (name in data) {
          if (type === "selector" || type === "switch") {
            const valueIndex = (valueType as Option[]).findIndex(option => option.value === data[name])
            form[name] = Math.max(valueIndex, 0)
          } else if (type === "percent") {
            form[name] = data[name] * 100
          } else {
            form[name] = data[name]
          }
          return
        }

        // 新增时，给表单字段赋默认值
        switch (type) {
          case "selector":
          case "switch":
            form[name] = 0
            break
          default:
            form[name] = ""
            break
        }
      })
      return form
    },
    {} as AnyObject
  )
}

function makeFields(fields: Section[]): Section[] {
  return fields.map(section =>
    // 给表单控件的属性赋默认值
    section.map(field => {
      const ret = { ...field }

      // 不处理自定义字段
      if (field.type === "custom") {
        return ret
      }

      switch (field.type) {
        case "selector":
          ret.valueType = [pickNoneOption, ...field.valueType]
          break
        case "switch":
          ret.valueType = [pickNoneOption, ...booleanTypes]
          break
        case "date":
          ret.valueType = ret.valueType || "day"
          break
        case "input":
          ret.valueType = ret.valueType || "text"
          break
      }
      return ret
    })
  )
}

function collectFormData(fields: Section[], form: AnyObject) {
  const ret = { ...form }
  fields.forEach(section => {
    // 从表单控件的值中收集待提交的表单数据
    section.forEach(({ name, type, valueType }) => {
      switch (type) {
        case "selector":
        case "switch":
          ret[name] = (valueType as Option[])[ret[name]].value
          break
        case "percent":
          ret[name] = Number(ret[name]) / 100
          break
      }
    })
  })
  return ret
}

function FFormPageComp(props: Props) {
  const formFields = useMemo(() => makeFields(props.fields), [props.fields])

  const [form, updateForm] = useState<AnyObject>({})
  useLayoutEffect(() => updateForm(makeFormData(formFields, props.data)), [formFields, props.data])

  const [formDisabledFields, updateDisabledFields] = useState(props.disabledFields)
  useLayoutEffect(() => updateDisabledFields(props.disabledFields), [props.disabledFields])

  const onFieldInput = useFieldInput(updateForm)
  // 年份选择器返回的是个Number，会导致选择器bug，这里强转成字符串
  const onDateFieldInput = (e: wx.CustomEvent) => {
    const field = e.currentTarget.dataset.field
    updateForm({ ...form, [field]: String(e.detail.value) })
  }

  const onSubmitSuccess = useThisAsComp(self => self.triggerEvent(EVENT_SUBMIT, {}, {}))
  const $useSubmit = useSubmit(async done => {
    await put({ url: props.url, data: { ...props.params, ...collectFormData(formFields, form) } }).finally(done)
    onSubmitSuccess()
  })

  // 当account为已签约时，intention自动选为已签约，且不能改动
  useLayoutEffect(() => {
    if (!form.accountId) {
      return
    }
    const accountIdField = formFields[0][0]
    if (accountIdField.valueType[form.accountId].isSign) {
      updateForm({
        ...form,
        intentionId: 7 // 已签约
      })
      updateDisabledFields({
        ...formDisabledFields,
        intentionId: true
      })
    } else {
      updateForm({
        ...form,
        intentionId: 0
      })
      updateDisabledFields({
        ...formDisabledFields,
        intentionId: false
      })
    }
  }, [form.accountId])

  return {
    ...$useSubmit,
    form,
    formFields,
    formDisabledFields,
    onFieldInput,
    onDateFieldInput,
    pastDateMax,
    futureDateMin
  }
}

FComp(
  FFormPageComp,
  {
    fixTextArea: false,
    fields: [],
    disabledFields: {},
    data: {},
    submitText: "",
    url: "",
    params: {}
  },
  {
    options: {
      addGlobalClass: true,
      multipleSlots: true
    }
  }
)

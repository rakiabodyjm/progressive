import { TextFieldProps } from '@material-ui/core'
// import SingleAutocomplete from '@src/components/AutoComplete'

import CustomTextField from '@src/components/AutoFormRenderer/CustomTextField'
import { useState } from 'react'

type FormType = 'input' | 'autocomplete' | 'dropdown' | 'multiple-autocomplete'

export type RenderTextField = {
  type: 'input'
  name: string
  label: string
  value: any
  props?: TextFieldProps
  onChange: (name: string, value: any) => void
}

export type RenderAutocomplete = {
  type: 'autocomplete'
  name: string
  label: string
  value: any
  props?: {}
  // fetcher: (arg: any) => Promise<T[]>
  fetcher<T>(arg: any): Promise<T>
  // onChange: (name: string, value: T | null) => void
  onChange<T>(name: string, value: T): void
}

// type RenderMultipleAutocomplete = {
//   type: 'multiple-autocomplete'

//   name: string
//   label: string
//   value: any
//   props: {}
// }

type AutoFormRendererFields = RenderTextField | RenderAutocomplete
//   | RenderMultipleAutocomplete

export default function AutoFormRenderer({ fields }: { fields: AutoFormRendererFields[] }) {
  const [formValues, setFormValues] = useState({
    ...fields.reduce(
      (acc, field) => ({
        ...acc,
        [field.name]: field.value,
      }),
      {} as Record<any, any>
    ),
  })
  const handleChange = (name: string, value: any) => {
    setFormValues((prevState) => ({
      ...prevState,
      [name]: value,
    }))
  }

  return (
    <>
      {fields.map(
        (field) =>
          field.type === 'input' && (
            <CustomTextField
              key={field.label + field.name}
              onChange={handleChange}
              label={field.label}
              name={field.name}
              props={field.props || {}}
              value={formValues[field.name] || undefined}
            />
          )
        // (field.type === 'autocomplete' && (
        //   <SingleAuto
        //     key={field.label + field.name}
        //     fetcher={field.fetcher}
        //     label={field.label}
        //     name={field.name}
        //     onChange={handleChange}
        //     props={field.props || {}}
        //     value={field.value}
        //   />
        // ))
      )}
    </>
  )
}

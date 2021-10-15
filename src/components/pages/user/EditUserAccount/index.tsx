import { Box, Button, Grid, makeStyles, Paper, PaperProps, Typography } from '@material-ui/core'
import AestheticObjectFormRenderer from '@src/components/ObjectFormRendererV2'
import { NotificationTypes, setNotification } from '@src/redux/data/notificationSlice'
import { extractErrorFromResponse } from '@src/utils/api/common'
import userApi, { UserResponse } from '@src/utils/api/userApi'
import React, { ChangeEvent, useEffect, useMemo, useRef, useState } from 'react'
import { useDispatch } from 'react-redux'

interface EditUserAccountFormValues {
  first_name: string
  last_name: string
  phone_number: string
  address1: string
  address2: string | null | undefined
  email: string
  username: string
  password: string
}
const useStyles = makeStyles((theme) => ({
  root: {},
}))
export default function EditUserAccount({
  user,
  ...restProps
}: { user: UserResponse } & PaperProps) {
  const classes = useStyles()
  /**
   * get only editable fields from userresponse
   */
  const { first_name, last_name, phone_number, address1, address2, email, username } = user

  const [formValues, setFormValues] = useState<EditUserAccountFormValues>({
    first_name,
    last_name,
    phone_number,
    address1,
    address2,
    email,
    username,
    password: '',
  })

  // const formValuesDefault = useRef(formValues)
  const [formValuesDefault, setFormValuesDefault] = useState(formValues)

  const changes = useMemo(() => {
    const keysOfChanges: (keyof EditUserAccountFormValues)[] = []
    Object.keys(formValuesDefault).forEach((key: string) => {
      const currentKey = key as keyof EditUserAccountFormValues

      if (formValuesDefault[currentKey] !== formValues[currentKey]) {
        keysOfChanges.push(currentKey)
      }
    })
    return keysOfChanges
  }, [formValues, formValuesDefault])

  const dispatch = useDispatch()

  function handleSubmit() {
    if (user && user.id) {
      userApi
        .updateUser(user.id, {
          ...changes.reduce(
            (acc, key) => ({
              ...acc,
              [key]: formValues[key],
            }),
            {}
          ),
        })
        .then((res) => {
          dispatch(
            setNotification({
              type: NotificationTypes.SUCCESS,
              message: `User Updated`,
            })
          )

          const {
            address1,
            address2,
            email,
            first_name,
            last_name,
            // password,
            phone_number,
            username,
          }: Omit<EditUserAccountFormValues, 'password'> = res

          setFormValuesDefault({
            address1,
            address2,
            email,
            first_name,
            phone_number,
            last_name,
            username,
            password: '',
          })
        })
        .catch((err) => {
          dispatch(
            setNotification({
              type: NotificationTypes.ERROR,
              message: extractErrorFromResponse(err),
            })
          )
        })
    }
  }
  return (
    <Paper variant="outlined" className={classes.root} {...restProps}>
      <Box
        component="form"
        onSubmit={(e) => {
          e.preventDefault()
          handleSubmit()
        }}
        className={classes.root}
      >
        <AestheticObjectFormRenderer
          highlight="key"
          spacing={1}
          variant="outlined"
          onChange={(e: ChangeEvent<HTMLInputElement>) => {
            setFormValues((prevState) => ({
              ...prevState,
              [e.target.name]: e.target.value,
            }))
          }}
          fields={formValues}
        />
        <Box mt={2} display="flex" justifyContent="flex-end">
          <Button type="submit" variant="contained" color="primary">
            <Typography variant="body1">Confirm</Typography>
          </Button>
        </Box>
      </Box>
    </Paper>
  )
}

const editableFields = ['']

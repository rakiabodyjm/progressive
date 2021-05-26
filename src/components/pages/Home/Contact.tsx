import { Box, Button, Fade, TextField, Theme, Typography } from '@material-ui/core'
import { makeStyles } from '@material-ui/styles'
import axios from 'axios'
import { ChangeEvent, useCallback, useEffect, useMemo, useState } from 'react'

const outlineString = '& .MuiOutlinedInput-notchedOutline'
const useStyles = makeStyles((theme: Theme) => ({
  contactSection: {
    marginTop: 64,
    marginBottom: 64,
    maxWidth: 1200,
    margin: 'auto',

    [outlineString]: {
      borderColor: theme.palette.primary.dark,
    },
    '& input': {
      fontSize: 16,
      fontWeight: 500,
      background: theme.palette.background.paper,
      borderRadius: 4,
    },
    '& textarea': {
      padding: '14px 14px',
      fontSize: 16,
      fontWeight: 500,
      background: theme.palette.background.paper,
      borderRadius: 4,
    },
    '& .focus': {
      [outlineString]: {
        boxShadow: `0px 0px 0px 2px ${theme.palette.primary.main}`,
        borderColor: theme.palette.primary.main,
      },
    },
    '& .MuiOutlinedInput-root': {
      padding: 0,
      '&:hover': {
        [outlineString]: {
          boxShadow: `0px 0px 0px 2px ${theme.palette.primary.main}`,
          borderColor: theme.palette.primary.main,
        },
      },
    },
    '& .error': {
      color: `${theme.palette.error.dark} !important`,
    },
    '& .raleway': {
      fontFamily: 'Raleway, sans-serif',
    },
  },

  contact: {
    maxWidth: 720,
    minWidth: 240,
    background: theme.palette.secondary.main,
    padding: 16,
    display: 'grid',
    gap: 32,
    borderRadius: 8,
  },
  header: {
    marginBottom: -8,
    '& .title': {
      fontWeight: 700,
      textTransform: 'uppercase',
      color: theme.palette.background.paper,
    },
    '& .subtitle': {
      color: theme.palette.primary.dark,
    },
  },
  content: {
    '& > *': {
      marginTop: 16,
    },
    '& .input-container': {
      '& .text': {
        color: theme.palette.background.paper,
      },
    },
  },
  footer: {
    display: 'flex',
    justifyContent: 'space-between',
    '& .button': {
      padding: '4px 8px',
      background: theme.palette.primary.dark,
      minWidth: 120,

      '& .text': {
        fontWeight: 700,
      },

      '&:hover': {
        background: theme.palette.secondary.main,
        color: theme.palette.primary.dark,
      },
    },
    '& .cancel': {
      background: `${theme.palette.common.white} !important`,
      '&:hover': {
        background: `${theme.palette.secondary.main} !important`,
      },
    },
  },
}))

const Contact = () => {
  const classes = useStyles()
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false)
  const [values, setValues] = useState({
    ...textFields.reduce(
      (acc, ea) => ({
        ...acc,
        [ea.name]: '',
      }),
      { message: '' }
    ),
  })

  const errors = useMemo(
    () =>
      Object.keys(values).reduce(
        (acc, ea) => {
          if (values[ea].length === 0) {
            return {
              ...acc,
              [ea]: '* Input something before sending',
            }
          }
          if (!(values[ea].length > 5)) {
            return {
              ...acc,
              [ea]: '* Must be more than 5 characters in length',
            }
          }
          if (values[ea].length > 500) {
            return {
              ...acc,
              [ea]: '* Must not be more than 500 characters',
            }
          }
          if (ea === 'contact_number' && /^(\+)\d{6,12} |\d{6,12}/.test(values[ea]))
            return {
              ...acc,
              [ea]: '* Must be a phone Number',
            }

          return {
            [ea]: null,
          }
        },
        {
          message: 'null',
        }
      ),
    [values]
  )

  console.log('errors', errors)
  const hasErrors = useMemo(() => {
    let error = false
    Object.keys(errors).forEach((key) => {
      if (errors[key] !== null) {
        error = true
      }
    })
    return error
  }, [errors])
  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setValues((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }))
  }

  const [notification, setNotification] = useState<{ type: 'error' | 'success'; message: string }>(
    null
  )
  const handleSubmit = () => {
    if (!hasErrors) {
      axios
        .post('/api/message', {
          ...values,
        })
        .then((res) => {
          setNotification({ type: 'success', message: res.data.success })
          setNotification(res.data.message)
        })
        .catch((err) => {
          console.error(err)
          setNotification({
            type: 'error',
            message: err.message,
          })
        })
    }
  }

  return (
    <div className={classes.contactSection}>
      <div className={classes.contact}>
        <div className={classes.header}>
          <Typography className="title" variant="h4">
            Contact
          </Typography>
          <Typography className="subtitle" variant="h6">
            Contact Us for Inquiries and Orders
          </Typography>
        </div>
        <div className={classes.content}>
          {textFields.map((ea) => (
            <div key={ea.name} className="input-container">
              <Box display="flex" justifyContent="space-between">
                <Typography className="text" variant="body1">
                  {ea.label}:
                </Typography>
                <Fade in={isSubmitted && !!errors[ea.name]}>
                  <Typography className="text error raleway" variant="body1">
                    {errors[ea.name]}
                  </Typography>
                </Fade>
              </Box>

              <TextField
                onChange={handleChange}
                name={ea.name}
                fullWidth
                variant="outlined"
                size="small"
                inputProps={{
                  autoCapitalize: 'off',
                  autoCorrect: 'off',
                }}
              />
            </div>
          ))}

          <div className="input-container">
            <Box display="flex" justifyContent="space-between">
              <Typography className="text" variant="body1">
                Message:
              </Typography>
              <Fade in={isSubmitted && !!errors.message}>
                <Typography className="text error raleway" variant="body1">
                  {errors.message}
                </Typography>
              </Fade>
            </Box>
            <TextField
              onChange={handleChange}
              name="message"
              fullWidth
              variant="outlined"
              size="small"
              multiline
              rows={4}
              inputProps={{
                autoCapitalize: 'off',
                autoCorrect: 'off',
              }}
            />
          </div>
        </div>
        <div className={classes.footer}>
          <Button
            onClick={() => {
              setIsSubmitted(true)
            }}
            disabled={isSubmitted && hasErrors}
            disableElevation
            className="button"
            variant="contained"
          >
            <Typography className="text" variant="h6">
              Submit
            </Typography>
          </Button>
        </div>
      </div>
    </div>
  )
}

const textFields = [
  {
    name: 'name',
    label: 'Name',
  },
  {
    name: 'contact_number',
    label: 'Contact Number',
  },
  {
    name: 'email',
    label: 'Email',
  },
]

export default Contact

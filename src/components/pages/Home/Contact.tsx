import {
  Box,
  Button,
  CircularProgress,
  Fade,
  TextField,
  Theme,
  Typography,
} from '@material-ui/core'
import { makeStyles } from '@material-ui/styles'
import { RootState } from '@src/redux/store'
import axios from 'axios'
import Image from 'next/image'
import { ChangeEvent, useEffect, useMemo, useState } from 'react'
import { useSelector } from 'react-redux'

const outlineString = '& .MuiOutlinedInput-notchedOutline'
const useStyles = makeStyles((theme: Theme) => ({
  contactSection: {
    marginTop: 64,
    marginBottom: 64,
    maxWidth: 1200,
    margin: 'auto',
    position: 'relative',
    padding: 16,
    paddingTop: 0,
    border: '0.5px solid transparent',

    // '&:after': {
    //   content: "''",
    //   position: 'absolute',
    //   top: 0,
    //   right: 0,
    //   bottom: 0,
    //   left: 0,
    //   border: `2px solid ${theme.palette.secondary.dark}`,
    //   opacity: 0.4,
    //   borderRadius: 8,
    // },
    [theme.breakpoints.down('sm')]: {
      padding: 8,
    },
    [outlineString]: {
      borderColor: theme.palette.primary.dark,
    },
    '& .sectionTitle': {
      textTransform: 'uppercase',
      textAlign: 'center',
      margin: 'auto',

      fontWeight: 700,
    },
    '& .divider': {
      height: 2,
      background: theme.palette.secondary.dark,
      width: 320,
      margin: 'auto',
      marginTop: 16,
      marginBottom: 32,
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
      position: 'relative',
      overflow: 'hidden',
      '& .text': {
        fontWeight: 700,
      },

      '&:hover': {
        background: theme.palette.secondary.main,
        color: theme.palette.primary.dark,
      },
      '& .loading-logo': {
        position: 'absolute',
        left: 0,
        bottom: 0,
        right: 0,
        top: 0,
        '&:after': {
          content: "''",
          position: 'absolute',
          background: theme.palette.primary.light,
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          opacity: 0.4,
        },
      },
    },
    '& .cancel': {
      background: `${theme.palette.common.white} !important`,
      '&:hover': {
        background: `${theme.palette.secondary.main} !important`,
      },
    },
  },
  notification: {
    borderRadius: 4,
    padding: 4,
    // color: theme.palette.background.paper,
  },
  notificationSuccess: {
    // color: theme.palette.success.main,
    border: `2px solid ${theme.palette.success.main}`,
    background: theme.palette.success.light,
  },
  notificationError: {
    // color: theme.palette.error.main,
    border: `2px solid ${theme.palette.error.main}`,
    background: theme.palette.error.light,
  },
  flexContainer: {
    position: 'relative',
    display: 'flex',
    background: theme.palette.secondary.main,
    [theme.breakpoints.down('sm')]: {
      flexDirection: 'column',
      margin: 'auto',
      maxWidth: 520,
    },
  },
  contact: {
    // maxWidth: ,
    // minWidth: 240,
    // minWidth: 480,
    width: '100%',
    margin: 'auto',
    background: theme.palette.secondary.main,
    padding: 16,
    display: 'grid',
    gap: 32,
    borderRadius: 8,
    flexShrink: 0,
    [theme.breakpoints.up('md')]: {
      // width: 'max-content',
      minWidth: 480,
      width: '100%',
      maxWidth: 500,
    },
  },
  imageContainer: {
    // clipPath: 'polygon(10.85% 14.15%, 87.71% 2.45%, 86.71% 88%, 10% 100%)',
    position: 'relative',
    flexGrow: 1,
    [theme.breakpoints.down('sm')]: {
      height: 480,
    },

    '&:after': {
      content: "''",
      position: 'absolute',
      height: 64,
      left: 0,
      right: 0,
      bottom: 0,
      // background: 'red',
      background: theme.palette.primary.dark,
      clipPath: 'polygon(0% 100%, 100% 100%, 100% 0%)',
    },
  },
}))

const Contact = () => {
  /**
   *
   * set inputProps for textFields
   */
  useEffect(() => {
    setInputProps({
      autoCapitalize: 'off',
      autoCorrect: 'off',
    })
  }, [])
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

  const promoMessage = useSelector((state: RootState) => state.orderMessage)

  useEffect(() => {
    if (promoMessage) {
      setValues((prevState) => ({
        ...prevState,
        message: promoMessage,
      }))
      setIsSubmitted(true)
    }
  }, [promoMessage])

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
          if (ea === 'contact_number' && !/(^\+\d{6,12}$|^\d{6,12}$)/.test(values[ea]))
            return {
              ...acc,
              [ea]: '* Must be a valid phone Number',
            }
          if (ea === 'email' && !/^[\w\-.+]+@[a-zA-Z0-9.-]+\.[a-zA-z0-9]{2,5}$/.test(values[ea])) {
            return {
              ...acc,
              [ea]: '* Must be an email',
            }
          }

          return {
            ...acc,
            [ea]: null,
          }
        },
        {
          message: 'null',
        }
      ),
    [values]
  )

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

  const [notification, setNotification] =
    useState<{ type: 'error' | 'success'; message: string }>(null)
  const [buttonLoading, setButtonLoading] = useState(false)
  const handleSubmit = () => {
    if (!hasErrors) {
      setButtonLoading(true)
      axios
        .post('/api/message', {
          ...values,
        })
        .then((res) => {
          setNotification({ type: 'success', message: res.data.success })
          // setNotification(res.data.success)
        })
        .catch((err) => {
          console.error(err)
          if (err.response) {
            setNotification({
              type: 'error',
              message: err.response.data.error,
            })
          } else {
            setNotification({
              type: 'error',
              message: 'Failed to Send Message',
            })
          }
        })
        .finally(() => {
          setButtonLoading(false)
        })
    }
  }

  useEffect(() => {
    if (notification?.message) {
      setTimeout(() => {
        setNotification(null)
      }, 5000)
    }
  }, [notification])

  const [inputProps, setInputProps] = useState({})

  return (
    <>
      <a href="/#contact" id="contact" className="anchor">
        Contact
      </a>
      <div className={classes.contactSection}>
        <Typography className="sectionTitle" noWrap variant="h3" component="p">
          Contact Us
        </Typography>
        <div className="divider" />
        <div className={classes.flexContainer}>
          <div className={classes.contact}>
            <div className={classes.header}>
              <Typography className="title" variant="h4">
                Contact
              </Typography>
              <Typography className="subtitle" variant="h6">
                Contact Us for Inquiries and Orders
              </Typography>
              <Fade in={!!notification?.message}>
                <div
                  className={`${classes.notification} ${
                    notification?.type === 'success' && classes.notificationSuccess
                  } ${notification?.type === 'error' && classes.notificationError}`}
                >
                  <Typography variant="body1">
                    {notification?.message}
                    {/* Lorem ipsum dolor sit amet consectetur adipisicing elit. Explicabo itaque
                    ratione debitis beatae reprehenderit assumenda rem doloremque velit sint, quam
                    magni repellat, iure reiciendis expedita corporis voluptatibus dolores,
                    praesentium provident. */}
                  </Typography>
                </div>
              </Fade>
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
                    inputProps={inputProps}
                    value={values?.[ea.name] || ''}
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
                  value={values?.message || ''}
                  inputProps={inputProps}
                />
              </div>
            </div>
            <div className={classes.footer}>
              <Button
                onClick={() => {
                  setIsSubmitted(true)
                  handleSubmit()
                }}
                disabled={(isSubmitted && hasErrors) || buttonLoading}
                disableElevation
                className="button"
                variant="contained"
              >
                <Typography className="text" variant="h6">
                  Submit
                </Typography>
                <Box
                  alignItems="center"
                  justifyContent="center"
                  className="loading-logo"
                  display={buttonLoading ? 'flex' : 'none'}
                >
                  <CircularProgress thickness={5} color="secondary" size={24} />
                </Box>
              </Button>
            </div>
          </div>

          <div style={{}} className={classes.imageContainer}>
            <Image
              priority
              placeholder="blur"
              src="/assets/dito-contact2.png"
              layout="fill"
              objectFit="cover"
              objectPosition="left center"
              quality={100}
            />
          </div>
        </div>
      </div>
    </>
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

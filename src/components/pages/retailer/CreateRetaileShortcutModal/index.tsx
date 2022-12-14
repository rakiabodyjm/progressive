import {
  Box,
  Chip,
  Divider,
  Grid,
  IconButton,
  Paper,
  TextField,
  TextFieldProps,
  Typography,
} from '@material-ui/core'
import { AddOutlined, CloseOutlined } from '@material-ui/icons'
import AsyncButton from '@src/components/AsyncButton'
import FormLabel from '@src/components/FormLabel'
import FormTextField from '@src/components/FormTextField'
import ModalWrapper from '@src/components/ModalWrapper'
import { Bank } from '@src/utils/types/CashTransferTypes'
import axios from 'axios'
import { ChangeEvent, useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { CreateDspAccount, DspResponseType, getDsp } from '@src/utils/api/dspApi'
import {
  getDsps,
  getSubdistributor,
  searchSubdistributor,
  SubdistributorResponseType,
} from '@src/utils/api/subdistributorApi'
import { NotificationTypes, setNotification } from '@src/redux/data/notificationSlice'
import { extractMultipleErrorFromResponse } from '@src/utils/api/common'
import useNotification from '@src/utils/hooks/useNotification'
import SimpleAutoComplete from '@src/components/SimpleAutoComplete'
import { Autocomplete } from '@material-ui/lab'
import { useRouter } from 'next/router'
import { searchWalletV2 } from '@src/utils/api/walletApi'

type FormValuesType = {
  first_name: string
  last_name: string
  phone_number: string
  address: string
  dsp: string
  subdistributor: string
}

type BankValuesTypes = {
  caesar?: string
  bank?: number
  description?: string
  account_number?: string
}

type SearchParams = {
  searchQuery?: string
}

export default function CreateRetailerShortcutModal({
  open,
  onClose,
  subd,
  dsp,
  triggerRender,
  caesar,
}: {
  open: boolean
  onClose: () => void
  subd?: SubdistributorResponseType
  dsp?: DspResponseType
  triggerRender?: () => void
  caesar?: string
}) {
  const { query } = useRouter()
  const { id } = query
  const [formValues, setFormValues] = useState<FormValuesType>({
    first_name: '',
    last_name: '',
    phone_number: '',
    address: '',
    dsp: dsp?.id as string,
    subdistributor: subd?.id as string,
  })

  const [bankFormValues, setBankFormValues] = useState<BankValuesTypes>({
    bank: undefined,
    caesar: undefined,
    description: undefined,
    account_number: '',
  })

  const [searchParam, setSearchParam] = useState<SearchParams>({
    searchQuery: '',
  })
  const dispatchNotif = useNotification()
  const [visible, setVisible] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)
  const [findCaesar, setFindCaesar] = useState<boolean>(false)
  const dispatch = useDispatch()

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormValues((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  useEffect(() => {
    if (formValues.phone_number) {
      setBankFormValues((prev) => ({
        ...prev,
        account_number: formValues.phone_number,
      }))
      setSearchParam((prev) => ({
        ...prev,
        searchQuery: formValues.phone_number,
      }))
    }
  }, [formValues.phone_number])

  useEffect(() => {
    if (findCaesar) {
      searchWalletV2(searchParam).then((res) => {
        res.data.map((ea) => {
          setBankFormValues((prev) => ({
            ...prev,
            caesar: ea.id,
          }))
          return ea
        })
        setFindCaesar(false)
      })
    }
    if (bankFormValues.caesar && visibleChip) {
      axios
        .post('/cash-transfer/caesar-bank', { ...bankFormValues })
        .then((res) => {
          dispatch(
            setNotification({
              type: NotificationTypes.SUCCESS,
              message: 'Bank Created',
            })
          )
          onClose()
          setLoading(false)
          if (triggerRender) {
            triggerRender()
          }
        })
        .catch((err) => {
          throw extractMultipleErrorFromResponse(err)
        })
    }
  }, [findCaesar])

  const handleSubmit = async () => {
    setLoading(true)
    if (open) {
      await axios
        .post('retailer/cash-transfer/', { ...formValues })
        .then((res) => {
          dispatch(
            setNotification({
              type: NotificationTypes.SUCCESS,
              message: 'Retailer Created',
            })
          )
          setFindCaesar(true)
        })
        .catch((err) => {
          extractMultipleErrorFromResponse(err).forEach((msg) => {
            dispatchNotif({
              type: NotificationTypes.ERROR,
              message: msg,
            })
          })
        })
        .finally(() => {
          // mutate('/caesar/ct-balance')
          if (!visibleChip) {
            setLoading(false)
            onClose()
            if (triggerRender) {
              triggerRender()
            }
          }
        })
    }
  }
  const { entity: autoLoadDsp, loading: autoLoadDspLoading } = useFetchEntity('dsp', dsp?.id)

  const [dspOptions, setDspOptions] = useState<DspResponseType[]>([])
  useEffect(() => {
    /**
     * Fetch only if there is not dspId given
     */
    if (formValues.subdistributor || (subd?.id && !dsp?.id)) {
      getDsps(formValues.subdistributor)
        .then((res) => {
          setDspOptions(res.data)
        })
        .catch((err) => {
          console.error(err)
        })
    }
    if (dsp?.id && autoLoadDsp) {
      setDspOptions([autoLoadDsp as DspResponseType])
    }
  }, [formValues.subdistributor, subd?.id, dsp?.id, autoLoadDsp])

  const handleChangeSubd = (
    e: unknown | React.ChangeEvent<HTMLInputElement>,
    value?: string | null
  ) => {
    if (typeof e !== 'string') {
      const eTarget = e as ChangeEvent<HTMLInputElement>
      setFormValues((prevState) => ({
        ...prevState,
        [eTarget.target.name]: eTarget.target.value,
      }))
    } else {
      setFormValues((prevState) => ({
        ...prevState,
        [e as keyof CreateDspAccount]: value,
      }))
    }
  }

  const { entity: autoLoadSubdistributor, loading: autoLoadSubdistributorLoading } = useFetchEntity(
    'subdistributor',
    subd?.id as string
  )
  useEffect(() => {
    if (autoLoadSubdistributor) {
      handleChangeSubd('subdistributor', autoLoadSubdistributor?.id)
    }
  }, [autoLoadSubdistributor])

  const [selectedBank, setSelectedBank] = useState({})
  const [visibleChip, setVisibleChip] = useState<boolean>(false)

  return (
    <ModalWrapper open={open} onClose={onClose} containerSize="sm">
      <Paper style={{ padding: 16 }} variant="outlined">
        <>
          <Box display="flex" justifyContent="space-between">
            <Box>
              <Typography variant="h5" color="primary">
                Create New Retailer Account
              </Typography>
              <Typography color="textSecondary" variant="body2">
                Complete the form to Create a new Retailer Account
              </Typography>
            </Box>
            <Box>
              <IconButton onClick={onClose}>
                <CloseOutlined />
              </IconButton>
            </Box>
          </Box>
          <Box>
            <Divider
              style={{
                margin: '16px 0',
              }}
            />
          </Box>
          <Grid spacing={1} container>
            <Grid item xs={12} sm={4}>
              <FormLabel> First Name</FormLabel>
              <FormTextField
                name="first_name"
                placeholder="Juan"
                onChange={handleChange}
              ></FormTextField>
            </Grid>
            <Grid item xs={12} sm={4}>
              <FormLabel> Last Name</FormLabel>
              <FormTextField
                name="last_name"
                placeholder="Dela Cruz"
                onChange={handleChange}
              ></FormTextField>
            </Grid>
            <Grid item xs={12} sm={4}>
              <FormLabel> Phone Number</FormLabel>
              <FormTextField
                name="phone_number"
                placeholder="09125846548"
                onChange={handleChange}
              ></FormTextField>
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormLabel> Subdistributor</FormLabel>
              {(subd?.id && autoLoadSubdistributor) || !subd?.id ? (
                <SimpleAutoComplete<SubdistributorResponseType, string>
                  initialQuery=""
                  fetcher={(q) => searchSubdistributor(q || ' ')}
                  getOptionLabel={(option) => option.name}
                  getOptionSelected={(val1, val2) => val1.id === val2.id}
                  querySetter={(arg, inputValue) => inputValue}
                  onChange={(value) => {
                    handleChangeSubd('subdistributor', value?.id || null)
                  }}
                  defaultValue={autoLoadSubdistributor as SubdistributorResponseType}
                  disabled={subd?.id ? true : undefined}
                />
              ) : (
                <CustomTextField name="subdistributor" disabled />
              )}
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormLabel> DSP</FormLabel>
              {formValues.subdistributor && dspOptions.length > 0 ? (
                <Autocomplete<DspResponseType>
                  options={dspOptions}
                  getOptionLabel={(option) => `${option.dsp_code}`}
                  getOptionSelected={(val1, val2) => val1.id === val2.id}
                  onChange={(_, value) => handleChangeSubd('dsp', value?.id || null)}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      variant="outlined"
                      size="small"
                      InputProps={{
                        ...params.InputProps,
                      }}
                    />
                  )}
                  defaultValue={(autoLoadDsp as DspResponseType) || null}
                  disabled={autoLoadDsp ? true : undefined}
                />
              ) : (
                <CustomTextField
                  name="subdistributor"
                  disabled
                  onClick={() => {
                    dispatchNotif({
                      message:
                        formValues.subdistributor && dspOptions.length === 0
                          ? 'Subdistributor doesn\'t have DSP\'s'
                          : 'Select Subdistributor First',
                      type: NotificationTypes.WARNING,
                    })
                  }}
                />
              )}

              {/* <FormTextField name="dsp" disabled defaultValue={dsp?.dsp_code}></FormTextField> */}
            </Grid>
            <Grid item xs={12}>
              <FormLabel> Address</FormLabel>
              <FormTextField
                name="address"
                placeholder="Unit#/Bldg/Street/Brgy/City/Province"
                onChange={handleChange}
              ></FormTextField>
            </Grid>
            <Grid item xs={12}>
              <Box>
                <Chip
                  avatar={
                    <IconButton>
                      <AddOutlined />
                    </IconButton>
                  }
                  style={{
                    display: visibleChip ? 'none' : undefined,
                  }}
                  onClick={() => {
                    setVisibleChip(true)
                  }}
                  label="Add Bank"
                />
              </Box>
              <Box my={2} />

              {visibleChip && (
                <Box>
                  <Paper>
                    <Box p={2}>
                      <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                        <FormLabel>Add Bank</FormLabel>
                        <IconButton
                          style={{
                            padding: 2,
                            marginBottom: 8,
                          }}
                          onClick={() => {
                            setVisibleChip(false)
                          }}
                        >
                          <CloseOutlined
                            style={{
                              fontSize: 16,
                            }}
                          />
                        </IconButton>
                      </Box>
                      <Grid container spacing={2}>
                        <Grid item xs={12}>
                          <SimpleAutoComplete<
                            Bank,
                            {
                              page: number
                              limit: number
                              search: string
                            }
                          >
                            initialQuery={{ limit: 100, page: 0, search: '' }}
                            fetcher={(q) =>
                              axios
                                .get('/cash-transfer/bank', {
                                  params: {
                                    ...q,
                                  },
                                })
                                .then((res) => res.data.data)
                            }
                            querySetter={(arg, inputValue) => ({
                              ...arg,
                              search: inputValue,
                            })}
                            getOptionLabel={(option) =>
                              `${option.name}  ${
                                option?.description && ` - ${option?.description}`
                              }`
                            }
                            onChange={(value) => {
                              setBankFormValues((prev) => ({
                                ...prev,
                                bank: value?.id || undefined,
                              }))
                            }}
                            getOptionSelected={(val1, val2) => val1.id === val2.id}

                            // defaultValue={}
                            // key={}
                          />

                          {/* ) : (
                <Box display="flex" width="100%" alignItems="center" justifyContent="center">
                  <CircularProgress />
                </Box>
                ) */}
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <FormLabel>Account Number</FormLabel>
                          <FormTextField
                            name="account_number"
                            onChange={(e) => {
                              setBankFormValues((prev) => ({
                                ...prev,
                                [e.target.name]: e.target.value,
                              }))
                            }}
                            value={bankFormValues.account_number}
                          />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <FormLabel>Description</FormLabel>
                          <FormTextField
                            name="description"
                            onChange={(e) => {
                              setBankFormValues((prev) => ({
                                ...prev,
                                [e.target.name]: e.target.value,
                              }))
                            }}
                            value={bankFormValues.description}
                          />
                        </Grid>
                      </Grid>
                    </Box>
                  </Paper>
                </Box>
              )}
            </Grid>
          </Grid>
          <Box display="flex" justifyContent="flex-end">
            <Box mt={2}>
              <AsyncButton
                loading={loading}
                disabled={loading}
                variant="contained"
                color="primary"
                onClick={handleSubmit}
              >
                Submit
              </AsyncButton>
            </Box>
          </Box>
        </>
      </Paper>
    </ModalWrapper>
  )
}

const useFetchEntity = (type: 'dsp' | 'subdistributor', id?: string) => {
  const [entity, setEntity] = useState<DspResponseType | SubdistributorResponseType>()
  const [loading, setLoading] = useState<boolean>(false)

  const fetcher = (argType: typeof type) => {
    if (argType === 'dsp') {
      return getDsp
    }
    if (argType === 'subdistributor') {
      return getSubdistributor
    }

    throw new Error('useFetch entity must have type DSP | Subdistributor')
  }
  useEffect(() => {
    if (type && id) {
      setLoading(true)
      fetcher(type)(id)
        .then((res) => {
          setEntity(res)
        })
        .catch((err) => {
          console.error(err)
        })
        .finally(() => {
          setLoading(false)
        })
    }
  }, [type, id])

  return {
    loading,
    entity,
  }
}
function CustomTextField<T extends CreateDspAccount>({
  name,
  ...restProps
}: {
  name: keyof T & string
} & TextFieldProps) {
  return <TextField fullWidth variant="outlined" size="small" name={name} {...restProps} />
}

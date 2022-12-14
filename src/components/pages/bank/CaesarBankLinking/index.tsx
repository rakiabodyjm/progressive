import { Box, Divider, IconButton, Paper, Theme, Typography } from '@material-ui/core'
import { AddCircleOutlined, CloseOutlined } from '@material-ui/icons'
import { useTheme } from '@material-ui/styles'
import AsyncButton from '@src/components/AsyncButton'
import ErrorLoading from '@src/components/ErrorLoadingScreen'
import { LoadingScreen2 } from '@src/components/LoadingScreen'
import ModalWrapper from '@src/components/ModalWrapper'
import AestheticObjectFormRenderer from '@src/components/ObjectFormRendererV2'
import UsersTable from '@src/components/UsersTable'
import { NotificationTypes } from '@src/redux/data/notificationSlice'
import { extractMultipleErrorFromResponse } from '@src/utils/api/common'
import useNotification from '@src/utils/hooks/useNotification'
import { Bank } from '@src/utils/types/CashTransferTypes'
import { Paginated, PaginateFetchParameters } from '@src/utils/types/PaginatedEntity'
import axios from 'axios'
import { MouseEvent, useCallback, useState } from 'react'
import useSubmitFormData from '@hooks/useSubmitFormData'

import SimpleAutoComplete from '@components/SimpleAutoComplete'
import useSWR, { useSWRConfig } from 'swr'

export default function CaesarBankLinking() {
  const [addBankModal, setAddBankModal] = useState<boolean>(false)
  const [editBankModal, setEditBankModal] = useState<Bank | undefined>()

  const handleClose = useCallback(() => {
    if (addBankModal) {
      setAddBankModal(false)
    } else {
      setEditBankModal(undefined)
    }
  }, [addBankModal])

  return (
    <>
      <Box textAlign="end" mb={2}>
        <IconButton
          onClick={() => {
            setAddBankModal(true)
          }}
        >
          <AddCircleOutlined />
        </IconButton>
      </Box>
      <BanksTable
        onRowClick={(e, bankToEdit) => {
          setEditBankModal(bankToEdit)
        }}
      />

      <ModalWrapper
        containerSize="xs"
        onClose={() => {
          if (editBankModal) {
            setEditBankModal(undefined)
          }
          setAddBankModal(false)
        }}
        open={!!addBankModal || !!editBankModal}
      >
        <Paper>
          <Box p={2}>
            <Box display="flex" justifyContent="space-between">
              <Box>
                {addBankModal && <Typography variant="h6">Add New Bank</Typography>}
                {editBankModal && <Typography variant="h6">Edit this Bank</Typography>}
                <Typography variant="body2">
                  Create or Update Banks that can be linked for each cash transfer
                </Typography>
              </Box>

              <Box>
                <IconButton onClick={handleClose}>
                  <CloseOutlined />
                </IconButton>
              </Box>
            </Box>
            <Box my={2}>
              <Divider />
            </Box>
            <CreateOrUpdateBank
              bankUpdateValues={editBankModal}
              handleClose={() => {
                setAddBankModal(false)
              }}
            />
          </Box>
        </Paper>
      </ModalWrapper>
    </>
  )
}

const BanksTable = ({
  onRowClick,
}: {
  onRowClick?: (e: MouseEvent<HTMLElement>, data: Bank) => void
}) => {
  const [paginateOptions, setPaginateOptions] = useState<PaginateFetchParameters>({
    page: 0,
    limit: 100,
  })

  const { data, isValidating, error, mutate } = useSWR<Paginated<Bank>>(
    '/cash-transfer/bank',
    (url) =>
      axios
        .get(url, {
          params: {
            ...paginateOptions,
          },
        })
        .then((res) => ({
          metadata: res.data.metadata,
          data: res.data.data.map((bank: Bank) =>
            Object.entries(bank)
              .filter(([key]) => !['created_at', 'deleted_at', 'updated_at'].includes(key))
              .reduce(
                (acc, [bankColumn, bankValue]) => ({ ...acc, [bankColumn]: bankValue }),
                {} as Bank
              )
          ),
        }))
  )
  const handleTableControls = (param: 'page' | 'limit') => (value: number) => {
    setPaginateOptions((prevState) => ({
      ...prevState,
      [param]: value,
    }))
  }

  if (data) {
    return (
      <>
        <UsersTable
          {...(onRowClick && { onRowClick })}
          data={data.data}
          setPage={handleTableControls('page')}
          setLimit={handleTableControls('limit')}
          page={data.metadata.page}
          limit={data.metadata.limit}
          total={data.metadata.total}
        />
      </>
    )
  }

  if (error) {
    return <ErrorLoading />
  }
  if (isValidating) {
    return <LoadingScreen2 />
  }
  return <LoadingScreen2 />
}

const CreateOrUpdateBank = ({
  bankUpdateValues,
  handleClose,
}: // mutateFn,
{
  bankUpdateValues?: Bank
  handleClose: () => void
  // mutateFn?: KeyedMutator<Paginated<Bank>>
}) => {
  const { mutate } = useSWRConfig()
  const theme: Theme = useTheme()
  const [loading, setLoading] = useState<boolean>(false)
  const dispatchNotif = useNotification()
  const [formValues, setFormValues] = useState<{ name: string; description: string }>(
    bankUpdateValues || {
      name: '',
      description: '',
    }
  )

  const handleSubmit = useCallback(() => {
    const fetchFn = () => {
      if (bankUpdateValues) {
        return axios
          .patch<Bank>(`cash-transfer/bank/${bankUpdateValues.id}`, formValues)
          .then((res) => {
            dispatchNotif({
              type: NotificationTypes.SUCCESS,
              message: 'Bank Details updated',
            })
          })
      }
      return axios.post('/cash-transfer/bank', formValues).then((res) => {
        dispatchNotif({
          type: NotificationTypes.SUCCESS,
          message: 'Bank Created',
        })
        handleClose()
      })
    }

    setLoading(true)
    fetchFn()
      .catch((err) => {
        extractMultipleErrorFromResponse(err).forEach((msg) => {
          dispatchNotif({
            type: NotificationTypes.ERROR,
            message: msg,
          })
        })
      })
      .finally(() => {
        setLoading(false)
        mutate('/cash-transfer/bank', null, true)
      })
  }, [bankUpdateValues, dispatchNotif, formValues, mutate])

  const handleDelete = useCallback(
    () =>
      axios
        .delete(
          `/cash-transfer/bank/${bankUpdateValues?.id}?replacement_bank=${handleReplacementBankDeleteValue?.id}`
        )
        .then((res) => {
          dispatchNotif({
            type: NotificationTypes.SUCCESS,
            message: 'Bank Deleted',
          })
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
          mutate('/cash-transfer/bank', null, true)
        }),
    [bankUpdateValues, dispatchNotif, mutate]
  )

  const [handleDeleteModal, setHandleDeleteModal] = useState<boolean>(false)
  const [handleReplacementBankDeleteValue, setHandleReplacementBankDeleteValue] = useState<
    undefined | Bank
  >()

  const {
    error,
    loading: udpateLoading,
    response,
    submit,
  } = useSubmitFormData({
    submitFunction: handleDelete,
  })

  return (
    <>
      <AestheticObjectFormRenderer
        fields={formValues}
        onChange={(e) => {
          setFormValues((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
          }))
        }}
        spacing={2}
      />
      <Box display="flex" justifyContent={bankUpdateValues ? 'space-between' : 'flex-end'}>
        {!!bankUpdateValues && (
          <AsyncButton
            style={{
              background: theme.palette.error.main,
            }}
            onClick={() => {
              setHandleDeleteModal(true)
            }}
          >
            Delete
          </AsyncButton>
        )}
        <AsyncButton onClick={handleSubmit} loading={loading}>
          Submit
        </AsyncButton>

        {handleDeleteModal && (
          <ModalWrapper
            open={handleDeleteModal}
            onClose={() => {
              setHandleDeleteModal(false)
            }}
            containerSize="xs"
          >
            <Paper>
              <Box p={2}>
                <Typography variant="body2">Input Replacement Bank</Typography>
                <SimpleAutoComplete
                  fetcher={() =>
                    axios
                      .get('/cash-transfer/bank')
                      .then(
                        (res) =>
                          res.data.data.filter(
                            (ea: Bank) => bankUpdateValues?.id !== ea.id
                          ) as Bank[]
                      )
                  }
                  getOptionLabel={(option) => option.name}
                  onChange={(val) => {
                    setHandleReplacementBankDeleteValue(val)
                  }}
                  initialQuery={undefined as undefined | string}
                  querySetter={(arg, inputValue) => inputValue}
                  getOptionSelected={(opt1, opt2) => opt1.id === opt2.id}
                />
                <Box my={2}>
                  <Divider />
                </Box>
                <AsyncButton
                  fullWidth
                  onClick={submit}
                  loading={udpateLoading}
                  disabled={udpateLoading || !handleReplacementBankDeleteValue}
                >
                  Submit
                </AsyncButton>
              </Box>
            </Paper>
          </ModalWrapper>
        )}
      </Box>
    </>
  )
}

import { Box, Button, CircularProgress, Paper } from '@material-ui/core'
import ModalWrapper from '@src/components/ModalWrapper'
import ViewDspAccount from '@src/components/pages/dsp/ViewDSPAccount'
import CreateRetailerAccount from '@src/components/pages/retailer/CreateRetailerAccount'
import { NotificationTypes, setNotification } from '@src/redux/data/notificationSlice'
import { getDsp } from '@src/utils/api/dspApi'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { useDispatch } from 'react-redux'
import EditDSPAccount from '@components/pages/dsp/EditDSPAccount'
import useSWR from 'swr'

type DSPManageModals = {
  editDspModal: boolean
  addRetailerModal: boolean
}
export default function AdminDspManage() {
  const { query } = useRouter()
  const { id } = query

  const dispatch = useDispatch()
  const [modalsOpen, setModalsOpen] = useState<DSPManageModals>({
    editDspModal: false,
    addRetailerModal: false,
  })

  const { data: dsp } = useSWR(id as string, (id) =>
    getDsp(id)
      .then((res) => res)
      .catch((err) => {
        dispatch(
          setNotification({
            type: NotificationTypes.ERROR,
            message: err.message,
          })
        )
      })
  )
  const setModalOpen = (key: keyof typeof modalsOpen, isOpen?: boolean) => () => {
    setModalsOpen((prevState) => ({
      ...prevState,
      [key]: isOpen || !prevState[key],
    }))
  }

  return (
    <Box>
      <Box mb={2}>
        <Paper variant="outlined">
          <Box
            display="flex"
            style={{
              gap: 16,
            }}
            p={2}
          >
            {dspActionButtons.map((ea) => (
              <Button
                key={ea.id}
                onClick={setModalOpen(ea.id as keyof DSPManageModals)}
                variant="outlined"
                color="primary"
              >
                {ea.label}
              </Button>
            ))}
          </Box>
          {modalsOpen.editDspModal && (
            <ModalWrapper
              open={modalsOpen.editDspModal}
              onClose={setModalOpen('editDspModal', false)}
              containerSize="sm"
            >
              {dsp ? (
                <EditDSPAccount modal={setModalOpen('editDspModal', false)} dsp={dsp} />
              ) : (
                <Paper
                  style={{
                    display: 'flex',
                    justifyContent: 'center',
                    padding: 16,
                  }}
                  variant="outlined"
                >
                  <CircularProgress />
                </Paper>
              )}
              {/** Edit DSP Modal */}
            </ModalWrapper>
          )}
          {modalsOpen.addRetailerModal && dsp?.subdistributor.id && (
            <ModalWrapper
              open={modalsOpen.addRetailerModal}
              onClose={setModalOpen('addRetailerModal', false)}
              containerSize="sm"
            >
              <CreateRetailerAccount
                modal={setModalOpen('addRetailerModal', false)}
                subdistributorId={dsp?.subdistributor.id}
                dspId={id as string}
              />
            </ModalWrapper>
          )}
        </Paper>
      </Box>
      {id && <ViewDspAccount dspId={id as string} />}
    </Box>
  )
}

const dspActionButtons = [
  {
    label: 'Edit Account Details',
    id: 'editDspModal',
  },
  {
    label: 'Add Retailer Account',
    id: 'addRetailerModal',
  },
]

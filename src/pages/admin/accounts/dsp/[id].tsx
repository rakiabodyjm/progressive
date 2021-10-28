import { Box, Button, Divider, Paper, Typography } from '@material-ui/core'
import ModalWrapper from '@src/components/ModalWrapper'
import ViewDspAccount from '@src/components/pages/dsp/ViewDSPAccount'
import CreateRetailerAccount from '@src/components/pages/retailer/CreateRetailerAccount'
import { DspResponseType, getDsp } from '@src/utils/api/dspApi'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'

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

  const [dsp, setDsp] = useState<DspResponseType>()
  useEffect(() => {
    if (id) {
      getDsp(id as string)
        .then((res) => {
          setDsp(res)
        })
        .catch((err) => {
          console.error(err)
        })
    }
  }, [])
  const setModalOpen = (key: keyof typeof modalsOpen, isOpen?: boolean) => () => {
    setModalsOpen((prevState) => ({
      ...prevState,
      [key]: isOpen || !prevState[key],
    }))
  }

  return (
    <Box>
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
        {id && <ViewDspAccount dspId={id as string} />}
        {modalsOpen.editDspModal && (
          <ModalWrapper
            open={modalsOpen.editDspModal}
            onClose={setModalOpen('editDspModal', false)}
            containerSize="sm"
          >
            {/** Edit DSP Modal */}
            <Paper variant="outlined">
              <Typography variant="h6" color="primary">
                Edit DSP Account
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Edit DSP Account Information
              </Typography>
              <Divider />
            </Paper>
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

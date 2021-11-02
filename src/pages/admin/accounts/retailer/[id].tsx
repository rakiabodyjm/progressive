import { Box, Button, Paper } from '@material-ui/core'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import ViewRetailerAccount from '@src/components/pages/retailer/ViewRetailerAccount'
import dynamic from 'next/dynamic'
import { getRetailer, RetailerResponseType } from '@src/utils/api/retailerApi'
import ModalWrapper from '@src/components/ModalWrapper'
const EditRetailerAccount = dynamic(
  () => import('@src/components/pages/retailer/EditRetailerAccount')
)
export default function AdminRetailerManage() {
  const [modalsOpen, setModalsOpen] = useState({
    editRetailerModal: false,
  })
  function setModalOpen(key: keyof typeof modalsOpen, isOpen: boolean) {
    return () => {
      setModalsOpen((prevState) => ({
        ...prevState,
        [key]: isOpen || !prevState[key],
      }))
    }
  }
  const { query } = useRouter()
  const { id } = query

  const [retailer, setRetailer] = useState<RetailerResponseType | undefined>()
  useEffect(() => {
    if (id) {
      getRetailer(id as string).then((res) => {
        setRetailer(res)
      })
    }
  }, [id])

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
            {retailerActionButtons.map((action) => (
              <Button
                key={action.id}
                onClick={setModalOpen(action.id as keyof typeof modalsOpen, true)}
                variant="outlined"
                color="primary"
              >
                {action.label}
              </Button>
            ))}
          </Box>
        </Paper>
      </Box>
      {id && <ViewRetailerAccount retailerId={id as string} />}

      {id && retailer && (
        <ModalWrapper
          onClose={setModalOpen('editRetailerModal', false)}
          open={modalsOpen.editRetailerModal}
          containerSize="sm"
        >
          <EditRetailerAccount
            retailer={retailer}
            modal={setModalOpen('editRetailerModal', false)}
          />
        </ModalWrapper>
      )}
    </Box>
  )
}

const retailerActionButtons = [
  {
    label: 'Edit Account Details',
    id: 'editRetailerModal',
  },
]

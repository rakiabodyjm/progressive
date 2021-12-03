import {
  Box,
  CircularProgress,
  Container,
  Divider,
  Grid,
  IconButton,
  Paper,
  Tooltip,
  Typography,
} from '@material-ui/core'
import { AddCircleOutlined } from '@material-ui/icons'
import ModalWrapper from '@src/components/ModalWrapper'
import RoleBadge from '@src/components/RoleBadge'
import UsersTable from '@src/components/UsersTable'
import { userDataSelector } from '@src/redux/data/userSlice'
import { Asset } from '@src/utils/api/assetApi'
import { getAllInventory, Inventory } from '@src/utils/api/inventoryApi'
import { CeasarWalletResponse } from '@src/utils/api/walletApi'
import { PaginateFetchParameters, Paginated } from '@src/utils/types/PaginatedEntity'
import { useEffect, useMemo, useState } from 'react'
import { useSelector } from 'react-redux'
import dynamic from 'next/dynamic'
import EditInventory from '@src/components/pages/inventory/EditInventory'

const CreateInventory = dynamic(() => import(`@src/components/pages/inventory/CreateInventory`))

export default function AdminInventoryManagement() {
  const user = useSelector(userDataSelector)

  const [inventoryItems, setInventoryItems] = useState<Inventory[] | undefined>()
  const [inventoryPaginationParameters, setinventoryPaginationParameters] =
    useState<PaginateFetchParameters>({
      limit: 100,
      page: 0,
    })

  const [inventoryMetadata, setInventoryMetadata] = useState<
    Paginated<Inventory>['metadata'] | undefined
  >()

  useEffect(() => {
    fetchInventory()
  }, [inventoryPaginationParameters])

  function fetchInventory() {
    getAllInventory(inventoryPaginationParameters)
      .then((res) => {
        setInventoryItems(res.data)
        setInventoryMetadata(res.metadata)
      })
      .catch((err) => {
        console.error(err)
      })
  }

  const [addInventoryModalOpen, setAddInventoryModalOpen] = useState<boolean>(false)
  // const [updateInventoryModalOpen, setUpdateInventoryModalOpen] = useState<boolean>(false)
  const [editInventory, setEditInventory] = useState<{
    open: boolean
    inventoryId: null | string
  }>({
    open: false,
    inventoryId: null,
  })

  useEffect(() => {
    console.log('editinventory', editInventory)
  }, [editInventory])

  const setUpdateInventoryModalOpen = (arg: boolean) => {
    setEditInventory((prevState) => ({
      // ...prevState,
      open: arg,
      inventoryId: arg === false ? null : prevState.inventoryId,
    }))
  }
  const updateInventoryModalOpen = useMemo(() => editInventory.open, [editInventory])
  return (
    <Container>
      <Paper variant="outlined">
        <Box p={2}>
          {user?.admin_id && <RoleBadge uppercase>Admin</RoleBadge>}
          <Typography noWrap color="textSecondary" variant="h6">
            {user?.first_name}
          </Typography>
          <Typography variant="h4">Inventory Management</Typography>
          <Typography variant="body2" color="primary">
            Inventory this Admin owns to be sold to Subdistributor | DSP | Retailer
          </Typography>
          <Box display="flex" justifyContent="flex-end">
            <Tooltip
              arrow
              placement="left"
              title={<Typography variant="subtitle2">Add new Asset</Typography>}
            >
              <IconButton
                onClick={() => {
                  setAddInventoryModalOpen(true)
                }}
              >
                <AddCircleOutlined />
              </IconButton>
            </Tooltip>
          </Box>
          <Box my={2}>
            <Divider />
          </Box>
          <Grid container spacing={2}>
            <Grid xs={12} item>
              <Box>
                {inventoryItems && inventoryMetadata && (
                  <UsersTable
                    data={inventoryItems.map((ea) => formatInventory(ea))}
                    setPage={(page: number) => {
                      setinventoryPaginationParameters((prev) => ({
                        ...prev,
                        page,
                      }))
                    }}
                    setLimit={(limit: number) => {
                      setinventoryPaginationParameters((prev) => ({
                        ...prev,
                        limit,
                      }))
                    }}
                    page={inventoryMetadata?.page}
                    limit={inventoryMetadata?.limit}
                    total={inventoryMetadata?.total}
                    hiddenFields={['id']}
                    onRowClick={(e, inventory) => {
                      setUpdateInventoryModalOpen(true)
                      setEditInventory((prevState) => ({
                        ...prevState,
                        inventoryId: inventory.id,
                      }))
                    }}
                  />
                )}
              </Box>
            </Grid>
          </Grid>
        </Box>
        <ModalWrapper
          open={addInventoryModalOpen}
          containerSize="sm"
          onClose={() => {
            setAddInventoryModalOpen(false)
          }}
        >
          <CreateInventory
            modal={() => {
              setAddInventoryModalOpen(false)
            }}
            revalidateFunction={() => {
              fetchInventory()
            }}
          />
        </ModalWrapper>
        <ModalWrapper
          open={updateInventoryModalOpen}
          containerSize="sm"
          onClose={() => {
            setUpdateInventoryModalOpen(false)
          }}
        >
          <EditInventory
            modal={() => {
              setUpdateInventoryModalOpen(false)
            }}
            revalidateFunction={() => {
              fetchInventory()
            }}
            inventoryId={editInventory.inventoryId!}
          />
        </ModalWrapper>
      </Paper>
    </Container>
  )
}

const formatInventory = ({ id, asset, quantity, ceasar }: Inventory) => ({
  id,
  asset: asset.name,
  code: asset.code,
  description: asset.description,
  quantity,
})

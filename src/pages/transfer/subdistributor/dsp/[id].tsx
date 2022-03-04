import {
  Box,
  CircularProgress,
  Divider,
  Grid,
  Paper,
  Theme,
  Typography,
  useTheme,
} from '@material-ui/core'
import ModalWrapper from '@src/components/ModalWrapper'
import CreatePurchase from '@src/components/pages/transactions/CreatePurchase'
import RoleBadge from '@src/components/RoleBadge'
import UsersTable from '@src/components/UsersTable'
import { userDataSelector } from '@src/redux/data/userSlice'
import { getDsp } from '@src/utils/api/dspApi'
import {
  Inventory,
  getAllInventory,
  getInventory,
  GetAllInventoryDto,
} from '@src/utils/api/inventoryApi'
import { getWalletById } from '@src/utils/api/walletApi'
import { PaginateFetchParameters, Paginated } from '@src/utils/types/PaginatedEntity'
import { useRouter } from 'next/router'
import { useState, useCallback, useEffect, useMemo } from 'react'
import { useSelector } from 'react-redux'
import useSWR from 'swr'

export default function TransferPageId() {
  const user = useSelector(userDataSelector)
  const router = useRouter()
  const { query } = router
  const { id } = query
  const theme: Theme = useTheme()
  const [valid, setValid] = useState(Date.now())
  const { data: dsp, error } = useSWR(id as string, getDsp)
  const [inventoryId, setInventoryId] = useState('')
  const { data: inventory } = useSWR(inventoryId, getInventory)
  const [inventoryItems, setInventoryItems] = useState<Inventory[] | undefined>()
  const [inventoryPaginationParameters, setinventoryPaginationParameters] =
    useState<PaginateFetchParameters>({
      limit: 100,
      page: 0,
    })
  const [inventoryMetadata, setInventoryMetadata] = useState<
    Paginated<Inventory>['metadata'] | undefined
  >()
  const [inventoryOptions, setInventoryOptions] = useState<
    Pick<GetAllInventoryDto, 'active' | 'subdistributor'>
  >({
    active: undefined,
    subdistributor: undefined,
  })
  useEffect(() => {
    if (user?.subdistributor_id) {
      setInventoryOptions({ subdistributor: user?.subdistributor_id })
    }
  }, [user?.subdistributor_id])

  const fetchInventory = useCallback(() => {
    getAllInventory({ ...inventoryPaginationParameters, ...inventoryOptions })
      .then((res) => {
        // setInventoryItems(res.data)
        setInventoryMetadata(res.metadata)
        /**
         * Inject ceasar first
         */
        return Promise.all(
          res.data.map(async (ea) => ({
            ...ea,
            caesar: await getWalletById(ea.caesar.id),
          }))
        )
      })
      .then((res) => {
        setInventoryItems(res)
      })
      .catch((err) => {
        console.error(err)
      })
  }, [inventoryOptions, inventoryPaginationParameters])

  useEffect(() => {
    fetchInventory()
  }, [fetchInventory])

  const [purchaseInvnetory, setPurchaseInvnetory] = useState<{
    open: boolean
    inventoryId: null | string
  }>({
    open: false,
    inventoryId: null,
  })

  const setPurchaseInventoryModalOpen = (arg: boolean) => {
    setPurchaseInvnetory((prevState) => ({
      // ...prevState,
      open: arg,
      inventoryId: arg === false ? null : prevState.inventoryId,
    }))
  }
  const purchaseInventoryModalOpen = useMemo(() => purchaseInvnetory.open, [purchaseInvnetory])
  const srpKey = useMemo(() => {
    switch ('subdistributor') {
      case 'subdistributor': {
        return 'srp_for_dsp'
      }
      default:
        return 'unit_price'
    }
  }, [])

  return (
    <div>
      <Paper>
        <Box p={2}>
          <Grid container>
            <Grid item xs={12}>
              <Box p={2}>
                <Box display="flex" justifyContent="space-between">
                  <Box>
                    <RoleBadge uppercase>Subdistributor</RoleBadge>
                    <Typography noWrap color="textSecondary" variant="h6">
                      {user?.first_name}
                    </Typography>
                    <Typography variant="h4">Transfer Inventory</Typography>
                    <Typography variant="body1" color="primary">
                      Transfer Inventory to Selected Account
                    </Typography>
                  </Box>
                </Box>

                <Box my={2}>
                  <Divider />
                </Box>
                <Grid container spacing={2}>
                  <Grid xs={12} item>
                    <Box>
                      {inventoryItems && inventoryMetadata && user?.subdistributor_id && (
                        <UsersTable
                          data={inventoryItems
                            .filter((ea) => ea.caesar.subdistributor?.id === user.subdistributor_id)
                            .map((ea) => formatInventory(ea))}
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
                            setPurchaseInventoryModalOpen(true)
                            setPurchaseInvnetory((prevState) => ({
                              ...prevState,
                              inventoryId: inventory.id,
                            }))
                            setInventoryId(inventory.id)
                          }}
                          formatTitle={{
                            caesar: 'Caesar Wallet Owner',
                            asset: 'Asset Name',
                            name: 'Inventory Name',
                          }}
                        />
                      )}
                    </Box>
                  </Grid>
                </Grid>
              </Box>
              <ModalWrapper
                open={purchaseInventoryModalOpen}
                containerSize="sm"
                onClose={() => {
                  setPurchaseInventoryModalOpen(false)
                }}
              >
                {inventory && dsp ? (
                  <CreatePurchase
                    buyerCaesarId={dsp.caesar_wallet.id}
                    inventory={inventory}
                    srpKey={srpKey}
                    modal={() => {
                      setPurchaseInventoryModalOpen(false)
                    }}
                    revalidateFunction={() => {
                      setValid(Date.now())
                    }}
                  />
                ) : (
                  <CircularProgress />
                )}
              </ModalWrapper>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </div>
  )
}
const formatInventory = ({ id, asset, quantity, caesar, name }: Inventory) => ({
  id,
  account_type: caesar.account_type.toUpperCase(),
  caesar: caesar.description,
  code: asset.code,
  asset: asset.name,
  name,
  quantity,
})

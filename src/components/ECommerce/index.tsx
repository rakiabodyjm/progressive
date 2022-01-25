import {
  Box,
  Button,
  ButtonBase,
  CircularProgress,
  Grid,
  IconButton,
  List,
  makeStyles,
  Paper,
  TablePagination,
  TextField,
  Theme,
  Typography,
  useTheme,
} from '@material-ui/core'
import { Apps, ListAlt } from '@material-ui/icons'
import { setNotification, NotificationTypes } from '@src/redux/data/notificationSlice'
import { userDataSelector } from '@src/redux/data/userSlice'
import userApi, { getUser, UserResponse } from '@src/utils/api/userApi'
import { ChangeEvent, ChangeEventHandler, useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import useSWR from 'swr'
import Image from 'next/image'
import GridView from '@src/components/ECommerce/GridView'
import { getAllInventory, getCommerce, Inventory } from '@src/utils/api/inventoryApi'
import { Paginated, PaginateFetchParameters } from '@src/utils/types/PaginatedEntity'
import { CaesarWalletResponse, getWallet, getWalletById } from '@src/utils/api/walletApi'
import RowView from '@src/components/ECommerce/RowView'
import type { InventoryNumbers } from '@src/components/ECommerce/RowView'
import { UserTypesAndUser } from '@src/pages/admin/accounts'
import CreatePurchase from '@src/components/pages/transactions/CreatePurchase'
import ModalWrapper from '@src/components/ModalWrapper'
import LoadingScreen from '@src/components/LoadingScreen'
getAllInventory()

export default function ECommerce({
  // account,
  caesarBuyer,
}: {
  caesarBuyer: [UserTypesAndUser, string]
}) {
  const [account_type, caesar_id] = caesarBuyer
  const user = useSelector(userDataSelector)
  const [view, setView] = useState({
    rowView: true,
    gridView: false,
  })
  const [paginationParameters, setPaginationParameters] = useState<PaginateFetchParameters>({
    limit: 100,
    page: 0,
  })

  const [paginateParams, setPaginateParams] = useState<PaginateFetchParameters>({
    limit: 100,
    page: 0,
  })

  const [paginatedInventory, setPaginatedInventory] = useState<Paginated<Inventory> | undefined>()
  const inventory = useMemo(() => paginatedInventory?.data, [paginatedInventory])
  const inventoryMetadata = useMemo(() => paginatedInventory?.metadata, [paginatedInventory])

  const srpKey: keyof InventoryNumbers = useMemo(() => {
    switch (account_type) {
      case 'dsp': {
        return 'srp_for_dsp'
      }
      case 'retailer': {
        return 'srp_for_retailer'
      }
      case 'subdistributor': {
        return 'srp_for_subd'
      }
      case 'user': {
        return 'srp_for_user'
      }
      default:
        return 'unit_price'
    }
  }, [account_type])

  useEffect(() => {
    if (caesar_id) {
      getCommerce({
        ...paginateParams,
        caesar: caesar_id,
      }).then((res) => {
        setPaginatedInventory(res)
      })
    }
  }, [paginateParams, caesar_id])

  const [selectedInventory, setSelectedInventory] = useState<undefined | Inventory>()
  const [purchaseModalOpen, setPurchaseModalOpen] = useState(false)
  return (
    <div>
      <Paper
        style={{
          height: 'max-content',
          maxHeight: 720,
          overflowY: 'auto',
        }}
        variant="outlined"
      >
        <Box p={2}>
          <Grid spacing={2} container>
            <Grid item xs={12}>
              <Grid container justifyContent="flex-end" alignItems="center">
                <Grid item>
                  <IconButton
                    onClick={() => {
                      setView({ rowView: true, gridView: false })
                    }}
                  >
                    <ListAlt color={view.rowView ? 'primary' : undefined} />
                  </IconButton>
                </Grid>
                <Grid item>
                  <IconButton
                    onClick={() => {
                      setView({ rowView: false, gridView: true })
                    }}
                  >
                    <Apps color={view.gridView ? 'primary' : undefined} />
                  </IconButton>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
          {/* {view.rowView && inventory && <RowView inventory={inventory} />} */}
          {/* {view.gridView && inventory && <GridView inventory={inventory} />} */}
          {inventory && (
            <RowView
              srpKey={srpKey}
              inventory={inventory}
              onInventoryItemClick={(inventory: Inventory) => {
                setSelectedInventory(inventory)
                // setPurchaseModalOpen(true)
              }}
            />
          )}
          <TablePagination
            rowsPerPageOptions={[5, 10, 20, 50, 100]}
            count={inventoryMetadata?.total || 0}
            rowsPerPage={inventoryMetadata?.limit || 5}
            page={inventoryMetadata?.page || 0}
            onPageChange={(_, page) => {
              setPaginateParams((prev) => ({
                ...prev,
                page,
              }))
            }}
            onRowsPerPageChange={(e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
              setPaginateParams((prev) => ({
                ...prev,
                limit: Number(e.target.value),
              }))
            }}
            component="div"
          />
        </Box>
      </Paper>

      <ModalWrapper
        containerSize="sm"
        open={!!selectedInventory}
        onClose={() => {
          // setPurchaseModalOpen(false)
          setSelectedInventory(undefined)
        }}
      >
        {selectedInventory ? (
          <CreatePurchase
            buyerCaesarId={caesar_id}
            inventory={selectedInventory}
            srpKey={srpKey}
            modal={() => {
              setSelectedInventory(undefined)
            }}
          />
        ) : (
          <CircularProgress />
        )}
      </ModalWrapper>
    </div>
  )
}

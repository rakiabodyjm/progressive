import {
  Box,
  CircularProgress,
  Grid,
  IconButton,
  Paper,
  TablePagination,
  Typography,
} from '@material-ui/core'
import { Apps, ListAlt } from '@material-ui/icons'
import { ChangeEvent, useEffect, useMemo, useRef, useState } from 'react'
import { getAllInventory, getCommerce, Inventory } from '@src/utils/api/inventoryApi'
import { Paginated, PaginateFetchParameters } from '@src/utils/types/PaginatedEntity'
import RowView from '@src/components/ECommerce/RowView'
import type { InventoryNumbers } from '@src/components/ECommerce/RowView'
import { UserTypesAndUser } from '@src/pages/admin/accounts'
import CreatePurchase from '@src/components/pages/transactions/CreatePurchase'
import ModalWrapper from '@src/components/ModalWrapper'
import GridView from './GridView'
getAllInventory()

export default function ECommerce({
  // account,
  caesarBuyer,
}: {
  caesarBuyer: [UserTypesAndUser, string]
}) {
  const [valid, setValid] = useState(Date.now())
  const [account_type, caesar_id] = caesarBuyer

  const [view, setView] = useState({
    rowView: true,
    gridView: false,
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

  const caesar_idRef = useRef<typeof caesar_id | undefined>(caesar_id)
  const [loading, setLoading] = useState<boolean>(false)
  useEffect(() => {
    if (caesar_id !== caesar_idRef.current) {
      setLoading(true)
      caesar_idRef.current = caesar_id
    }
    if (caesar_id) {
      getCommerce({
        ...paginateParams,
        caesar: caesar_id,
      }).then((res) => {
        setPaginatedInventory(res)
        setLoading(false)
      })
    }
  }, [paginateParams, caesar_id, valid])

  const [selectedInventory, setSelectedInventory] = useState<undefined | Inventory>()
  return (
    <div>
      <Paper
        style={{
          height: 'max-content',
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
          {inventory && !loading && view.rowView && (
            <RowView
              srpKey={srpKey}
              inventory={inventory}
              onInventoryItemClick={(inventory: Inventory) => {
                setSelectedInventory(inventory)
                // setPurchaseModalOpen(true)
              }}
            />
          )}
          {inventory && !loading && view.gridView && (
            <GridView
              srpKey={srpKey}
              inventory={inventory}
              onInventoryItemClick={(inventory: Inventory) => {
                setSelectedInventory(inventory)
                // setPurchaseModalOpen(true)
              }}
            />
          )}
          {loading && (
            <Box>
              <Paper>
                <Box p={4}>
                  <Box
                    display="flex"
                    justifyContent="center"
                    flexDirection="column"
                    alignItems="center"
                  >
                    <Typography
                      style={{
                        fontWeight: 600,
                      }}
                      variant="h5"
                    >
                      Loading
                    </Typography>
                    <CircularProgress size={40} thickness={4} />
                  </Box>
                </Box>
              </Paper>
            </Box>
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
            revalidateFunction={() => {
              setValid(Date.now())
            }}
          />
        ) : (
          <CircularProgress />
        )}
      </ModalWrapper>
    </div>
  )
}

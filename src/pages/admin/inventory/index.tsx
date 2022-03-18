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
  Menu,
  FormControlLabel,
  Checkbox,
  FormControl,
  RadioGroup,
  Radio,
} from '@material-ui/core'
import { AddCircleOutlined, MoreVert } from '@material-ui/icons'
import ModalWrapper from '@src/components/ModalWrapper'
import RoleBadge from '@src/components/RoleBadge'
import UsersTable from '@src/components/UsersTable'
import { userDataSelector, UserTypes } from '@src/redux/data/userSlice'
import { getAllInventory, GetAllInventoryDto, Inventory } from '@src/utils/api/inventoryApi'
import { CaesarWalletResponse, getWallet, getWalletById } from '@src/utils/api/walletApi'
import { PaginateFetchParameters, Paginated } from '@src/utils/types/PaginatedEntity'
import { ChangeEvent, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'
import useSWR from 'swr'
import FormLabel from '@src/components/FormLabel'

const EditInventory = dynamic(() => import('@src/components/pages/inventory/EditInventory'))
const CreateInventory = dynamic(() => import('@src/components/pages/inventory/CreateInventory'))

export default function AdminInventoryManagement() {
  const user = useSelector(userDataSelector)
  const router = useRouter()

  const [inventoryItems, setInventoryItems] = useState<Inventory[] | undefined>()
  const [inventoryPaginationParameters, setinventoryPaginationParameters] =
    useState<PaginateFetchParameters>({
      limit: 100,
      page: 0,
    })

  const [inventoryMetadata, setInventoryMetadata] = useState<
    Paginated<Inventory>['metadata'] | undefined
  >()

  const [moreOptionsOpen, setMoreOptionsOpen] = useState<boolean>(false)
  const [inventoryOptions, setInventoryOptions] = useState<
    Pick<GetAllInventoryDto, 'active' | 'admin'>
  >({
    active: undefined,
    admin: undefined,
  })
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
  }, [inventoryPaginationParameters, inventoryOptions])

  useEffect(() => {
    fetchInventory()
  }, [fetchInventory])

  const [addInventoryModalOpen, setAddInventoryModalOpen] = useState<boolean>(false)

  // const [updateInventoryModalOpen, setUpdateInventoryModalOpen] = useState<boolean>(false)
  const [editInventory, setEditInventory] = useState<{
    open: boolean
    inventoryId: null | string
  }>({
    open: false,
    inventoryId: null,
  })

  const setUpdateInventoryModalOpen = (arg: boolean) => {
    setEditInventory((prevState) => ({
      // ...prevState,
      open: arg,
      inventoryId: arg === false ? null : prevState.inventoryId,
    }))
  }
  const updateInventoryModalOpen = useMemo(() => editInventory.open, [editInventory])

  const isAdmin = useMemo(() => !!user?.admin_id, [user?.admin_id])

  const { data: caesarWalletOfAdmin } = useSWR(
    user?.admin_id ? ['admin' as UserTypes, user?.admin_id] : null,
    (...parameter) => getWallet(...parameter)
  )

  const moreAnchorEl = useRef<HTMLElement | undefined>()

  return (
    <Container>
      <Paper variant="outlined">
        <Box p={2}>
          <Box display="flex" justifyContent="space-between">
            <Box>
              {user?.admin_id && <RoleBadge uppercase>Admin</RoleBadge>}
              <Typography noWrap color="textSecondary" variant="h6">
                {user?.first_name}
              </Typography>
              <Typography variant="h4">Inventory Management</Typography>
              <Typography variant="body2" color="primary">
                Inventory this Admin owns to be sold to Subdistributor | DSP | Retailer
              </Typography>
            </Box>
            <Box>
              <IconButton
                onClick={() => {
                  setMoreOptionsOpen(true)
                }}
                innerRef={moreAnchorEl}
              >
                <MoreVert />
              </IconButton>
              <Menu
                anchorEl={moreAnchorEl.current}
                open={moreOptionsOpen}
                onClose={() => {
                  setMoreOptionsOpen(false)
                }}
              >
                <Box p={1}>
                  <Typography variant="body1">Inventory View Options</Typography>
                  <Box pt={1.5}>
                    <Divider />
                  </Box>
                  <Box display="flex" flexDirection="column">
                    <FormControlLabel
                      // value="end"
                      control={
                        <Checkbox
                          color="primary"
                          onChange={(e, checked) => {
                            setInventoryOptions((prevState) => ({
                              ...prevState,
                              admin: checked ? user?.admin_id : undefined,
                            }))
                          }}
                          checked={!!inventoryOptions.admin}
                        />
                      }
                      label={<Typography variant="body2">Show only Owned Inventory</Typography>}
                      labelPlacement="end"
                    />
                    <Divider />
                    <FormControl
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                      }}
                    >
                      <FormLabel
                        style={{
                          margin: '8px 0',
                        }}
                      >
                        <Typography variant="body1" color="textPrimary">
                          Show Inventory:
                        </Typography>
                      </FormLabel>
                      <RadioGroup
                        onChange={(e: ChangeEvent<HTMLInputElement>, value) => {
                          setInventoryOptions((prevState) => ({
                            ...prevState,
                            active: value === 'all' ? undefined : value === 'activeOnly',
                          }))
                        }}
                      >
                        <FormControlLabel
                          label={<Typography variant="body2">All</Typography>}
                          value="all"
                          control={<Radio color="primary" />}
                          checked={typeof inventoryOptions.active === 'undefined'}
                        />
                        <FormControlLabel
                          label={<Typography variant="body2">Active Only</Typography>}
                          value="activeOnly"
                          control={<Radio color="primary" />}
                          checked={
                            typeof inventoryOptions !== 'undefined' &&
                            inventoryOptions.active === true
                          }
                        />
                        <FormControlLabel
                          label={<Typography variant="body2">Inactive Only</Typography>}
                          value="inactiveOnly"
                          control={<Radio color="primary" />}
                          checked={
                            typeof inventoryOptions !== 'undefined' &&
                            inventoryOptions.active === false
                          }
                        />
                      </RadioGroup>
                    </FormControl>
                  </Box>
                </Box>
              </Menu>
            </Box>
          </Box>

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
            caesarId={caesarWalletOfAdmin?.id}
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
            adminOnly={isAdmin}
          />
        </ModalWrapper>
      </Paper>
    </Container>
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

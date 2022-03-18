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
import { LoadingScreen2 } from '@src/components/LoadingScreen'

const EditInventory = dynamic(() => import('@src/components/pages/inventory/EditInventory'))
const CreateInventory = dynamic(() => import('@src/components/pages/inventory/CreateInventory'))

export default function AccountInventoryManagement({ accountId }: { accountId: string }) {
  const user = useSelector(userDataSelector)
  const router = useRouter()
  const [acc, setAcc] = useState('dsp')
  const [loading, setLoading] = useState<boolean>(false)
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
    Pick<GetAllInventoryDto, 'active' | 'admin' | 'dsp' | 'subdistributor' | 'retailer'>
  >({
    active: undefined,
    admin: undefined,
    dsp: undefined,
    subdistributor: undefined,
    retailer: undefined,
  })
  useEffect(() => {
    if (accountId === user?.admin_id) {
      setInventoryOptions({ admin: accountId })
    }
    if (accountId === user?.dsp_id) {
      setInventoryOptions({ dsp: accountId })
    }
    if (accountId === user?.subdistributor_id) {
      setInventoryOptions({ subdistributor: accountId })
    }
    if (accountId === user?.retailer_id) {
      setInventoryOptions({ retailer: accountId })
    }
  }, [accountId, user?.admin_id, user?.dsp_id, user?.retailer_id, user?.subdistributor_id])
  const fetchInventory = useCallback(() => {
    setLoading(true)
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
      .finally(() => {
        setLoading(false)
      })
  }, [inventoryOptions, inventoryPaginationParameters])

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

  const isAdmin = useMemo(() => !!accountId, [accountId])

  const { data: caesarWalletOfAdmin } = useSWR(
    accountId ? ['admin' as UserTypes, accountId] : null,
    (...parameter) => getWallet(...parameter)
  )

  const moreAnchorEl = useRef<HTMLElement | undefined>()
  const [adminOnly, setAdminOnly] = useState<boolean>(false)
  console.log(accountId)
  return (
    <Paper variant="outlined">
      <Box p={2}>
        <Box display="flex" justifyContent="space-between">
          <Box>
            {accountId === user?.user_id && <RoleBadge uppercase>User</RoleBadge>}
            {accountId === user?.admin_id && <RoleBadge uppercase>Admin</RoleBadge>}
            {accountId === user?.subdistributor_id && (
              <RoleBadge uppercase>Subdistributor</RoleBadge>
            )}
            {accountId === user?.dsp_id && <RoleBadge uppercase>DSP</RoleBadge>}
            {accountId === user?.retailer_id && <RoleBadge uppercase>Retailer</RoleBadge>}
            <Typography noWrap color="textSecondary" variant="h6">
              {user?.first_name}
            </Typography>
            <Typography variant="h4">Inventory Management</Typography>
          </Box>
          {accountId === user?.admin_id && (
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
                    {accountId === user?.admin_id && (
                      <FormControlLabel
                        // value="end"
                        control={
                          <Checkbox
                            color="primary"
                            onChange={(e, checked) => {
                              setInventoryOptions((prevState) => ({
                                ...prevState,
                                admin: checked ? accountId : undefined,
                              }))
                            }}
                            checked={!!inventoryOptions.admin}
                          />
                        }
                        label={<Typography variant="body2">Show only Owned Inventory</Typography>}
                        labelPlacement="end"
                      />
                    )}
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
          )}
        </Box>
        {accountId === user?.admin_id && (
          <Box display="flex" justifyContent="flex-end">
            <Tooltip
              arrow
              placement="left"
              title={<Typography variant="subtitle2">Add New Inventory</Typography>}
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
        )}

        <Box my={2}>
          <Divider />
        </Box>
        <Grid container spacing={2}>
          <Grid xs={12} item>
            {!loading ? (
              <Box>
                {inventoryItems &&
                  inventoryMetadata &&
                  accountId === user?.admin_id &&
                  inventoryOptions.admin === undefined && (
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
                        setAdminOnly(true)
                      }}
                      formatTitle={{
                        caesar: 'Caesar Wallet Owner',
                        asset: 'Asset Name',
                        name: 'Inventory Name',
                      }}
                    />
                  )}

                {inventoryItems &&
                  inventoryMetadata &&
                  accountId === user?.admin_id &&
                  inventoryOptions.admin === accountId && (
                    <UsersTable
                      data={inventoryItems
                        .filter((ea) => ea.caesar.admin?.id === accountId)
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
                        setUpdateInventoryModalOpen(true)
                        setEditInventory((prevState) => ({
                          ...prevState,
                          inventoryId: inventory.id,
                        }))
                        setAdminOnly(true)
                      }}
                      formatTitle={{
                        caesar: 'Caesar Wallet Owner',
                        asset: 'Asset Name',
                        name: 'Inventory Name',
                      }}
                    />
                  )}
                {inventoryItems && inventoryMetadata && accountId === user?.subdistributor_id && (
                  <UsersTable
                    data={inventoryItems
                      .filter((ea) => ea.caesar.subdistributor?.id === accountId)
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
                      setUpdateInventoryModalOpen(true)
                      setEditInventory((prevState) => ({
                        ...prevState,
                        inventoryId: inventory.id,
                      }))
                      setAdminOnly(false)
                    }}
                    formatTitle={{
                      caesar: 'Caesar Wallet Owner',
                      asset: 'Asset Name',
                      name: 'Inventory Name',
                    }}
                  />
                )}
                {inventoryItems && inventoryMetadata && accountId === user?.dsp_id && (
                  <UsersTable
                    data={inventoryItems
                      .filter((ea) => ea.caesar.dsp?.id === accountId)
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
                      setUpdateInventoryModalOpen(true)
                      setEditInventory((prevState) => ({
                        ...prevState,
                        inventoryId: inventory.id,
                      }))
                      setAdminOnly(false)
                    }}
                    formatTitle={{
                      caesar: 'Caesar Wallet Owner',
                      asset: 'Asset Name',
                      name: 'Inventory Name',
                    }}
                  />
                )}
                {inventoryItems && inventoryMetadata && accountId === user?.retailer_id && (
                  <UsersTable
                    data={inventoryItems
                      .filter((ea) => ea.caesar.retailer?.id === accountId)
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
                      setUpdateInventoryModalOpen(true)
                      setEditInventory((prevState) => ({
                        ...prevState,
                        inventoryId: inventory.id,
                      }))
                      setAdminOnly(false)
                    }}
                    formatTitle={{
                      caesar: 'Caesar Wallet Owner',
                      asset: 'Asset Name',
                      name: 'Inventory Name',
                    }}
                  />
                )}
              </Box>
            ) : (
              <LoadingScreen2
                textProps={{
                  variant: 'h4',
                }}
              />
            )}
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
          {...(isAdmin && {
            isAdmin: true,
          })}
          adminOnly={adminOnly}
        />
      </ModalWrapper>
    </Paper>
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

import {
  Box,
  Checkbox,
  Container,
  Divider,
  Grid,
  IconButton,
  Menu,
  Paper,
  TableCell,
  TableRow,
  Tooltip,
  Typography,
} from '@material-ui/core'
import { AddCircleOutlined, MoreVert } from '@material-ui/icons'
import ModalWrapper from '@src/components/ModalWrapper'
import CreateAsset from '@src/components/pages/assets/CreateAsset'
import EditAsset from '@src/components/pages/assets/EditAsset'
import { PopUpMenu } from '@src/components/PopUpMenu'
import RoleBadge from '@src/components/RoleBadge'
import UsersTable from '@src/components/UsersTable'
import { userDataSelector } from '@src/redux/data/userSlice'
import { Asset, getAssets, GetAllAssetDto } from '@src/utils/api/assetApi'
import { useErrorNotification } from '@src/utils/hooks/useNotification'
import { Paginated, PaginateFetchParameters } from '@src/utils/types/PaginatedEntity'
import { useCallback, useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux'

export default function AdminAssetManagement() {
  const [addAssetModalOpen, setAddAssetModalOpen] = useState<boolean>(false)
  const [editAssetModalOpen, setEditAssetModalOpen] = useState<{
    state: boolean
    asset: Asset | undefined
  }>({ state: false, asset: undefined })
  const user = useSelector(userDataSelector)
  const [assets, setAssets] = useState<Asset[] | undefined>()

  const [paginatedParams, setPaginatedParams] = useState<PaginateFetchParameters>({
    page: 0,
    limit: 100,
  })

  const [getAllAssetOptions, setGetAllAssetOptions] = useState<GetAllAssetDto>({
    active: true,
  })
  const [assetMetadata, setAssetMetadata] = useState<Paginated<Asset>['metadata'] | undefined>()

  const dispatchError = useErrorNotification()

  const fetchAssets = useCallback(() => {
    getAssets({ ...paginatedParams, ...getAllAssetOptions })
      .then((res) => {
        console.log('fetching')
        setAssets(res.data)
        setAssetMetadata(res.metadata)
      })
      .catch((err) => {
        dispatchError(err)
      })
  }, [paginatedParams, getAllAssetOptions])

  const moreAnchorEl = useRef<HTMLElement | undefined>()
  const [assetMoreOptionsOpen, setAssetMoreOptionsOpen] = useState<boolean>(false)
  useEffect(() => {
    fetchAssets()
  }, [fetchAssets])

  return (
    <>
      <Container>
        <Paper variant="outlined">
          <Box p={2}>
            <Box display="flex" justifyContent="space-between">
              <Box>
                {user?.admin_id && <RoleBadge uppercase>Admin</RoleBadge>}
                <Typography noWrap color="textSecondary" variant="h6">
                  {user?.first_name}
                </Typography>
                <Typography variant="h4">Asset Management</Typography>
                <Typography variant="body2" color="primary">
                  Create Assets to be acquired by Admin and sold to different Account types
                </Typography>
              </Box>
              <Box>
                <IconButton
                  onClick={() => {
                    setAssetMoreOptionsOpen(true)
                  }}
                  innerRef={moreAnchorEl}
                >
                  <MoreVert />
                </IconButton>
                <Menu
                  anchorEl={moreAnchorEl.current}
                  open={assetMoreOptionsOpen}
                  onClose={() => {
                    setAssetMoreOptionsOpen(false)
                  }}
                >
                  <Box p={1}>
                    <Typography variant="body1">Asset View Options</Typography>
                    <Box pt={1.5}>
                      <Divider />
                    </Box>
                    <Box
                      display="flex"
                      alignItems="center"
                      justifyContent="space-between"
                      onClick={() => {
                        if (getAllAssetOptions.withDeleted === undefined) {
                          setGetAllAssetOptions((prevState) => ({
                            ...prevState,
                            withDeleted: true,
                          }))
                        } else {
                          const prevStateCopy = {
                            ...getAllAssetOptions,
                          }
                          delete prevStateCopy.withDeleted
                          setGetAllAssetOptions(prevStateCopy)
                        }
                      }}
                    >
                      <Typography color="primary" variant="body2" component="label">
                        Include Deleted Data
                      </Typography>
                      <Checkbox
                        checked={!(getAllAssetOptions.withDeleted === undefined)}
                        name="withDeleted"
                        color="primary"
                      />
                    </Box>
                    <Box
                      display="flex"
                      alignItems="center"
                      justifyContent="space-between"
                      onClick={() => {
                        setGetAllAssetOptions((prevState) => ({
                          ...prevState,
                          active: !prevState.active,
                        }))
                      }}
                    >
                      <Typography color="primary" variant="body2" component="label">
                        Show only Disabled Data
                      </Typography>
                      <Checkbox
                        name="withDeleted"
                        checked={!getAllAssetOptions.active}
                        color="primary"
                      />
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
                    setAddAssetModalOpen(true)
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
                  {assets && (
                    <UsersTable
                      data={assets}
                      limit={paginatedParams.limit}
                      page={paginatedParams.page}
                      total={assetMetadata?.total || 0}
                      setLimit={(limit: number) => {
                        setPaginatedParams((prevState) => ({
                          ...prevState,
                          limit,
                        }))
                      }}
                      setPage={(page: number) => {
                        setPaginatedParams((prevState) => ({
                          ...prevState,
                          page,
                        }))
                      }}
                      formatRow={{
                        srp_for_subd: 'SRP (Subd)',
                        srp_for_dsp: 'SRP (DSP)',
                        srp_for_retailer: 'SRP (Ret.)',
                        srp_for_user: 'SRP (User)',
                      }}
                      hiddenFields={['id', 'deleted_at', 'active', 'updated_at']}
                      onRowClick={(e, asset) => {
                        if (!asset.deleted_at) {
                          setEditAssetModalOpen(objectSpread('asset', asset))
                          setEditAssetModalOpen(objectSpread('state', true))
                        }
                      }}
                      // renderRow={(row, DefaultRender) => {
                      //   if (row.deleted_at) {
                      //     return (
                      //       <TableRow>
                      //         {Object.keys(row).map((ea) => (
                      //           <TableCell>{row[ea] as string}</TableCell>
                      //         ))}
                      //       </TableRow>
                      //     )
                      //   }
                      //   return (
                      //     <>
                      //       <DefaultRender />
                      //     </>
                      //   )
                      // }}
                    />
                  )}
                </Box>
              </Grid>
            </Grid>
          </Box>
        </Paper>
      </Container>
      <ModalWrapper
        open={addAssetModalOpen}
        containerSize="sm"
        onClose={() => setAddAssetModalOpen(false)}
      >
        <Box>
          <CreateAsset
            modal={() => {
              setAddAssetModalOpen(false)
            }}
            revalidateFunction={() => {
              fetchAssets()
            }}
          />
        </Box>
      </ModalWrapper>
      <ModalWrapper
        open={editAssetModalOpen.state && !!editAssetModalOpen.asset}
        containerSize="sm"
        onClose={() => setEditAssetModalOpen(objectSpread('state', false))}
      >
        <Box>
          {editAssetModalOpen.asset && (
            <EditAsset
              modal={() => setEditAssetModalOpen(objectSpread('state', false))}
              asset={editAssetModalOpen.asset}
              revalidateFunction={() => fetchAssets()}
            />
          )}
        </Box>
      </ModalWrapper>
    </>
  )
}

function objectSpread<T extends {}>(key: keyof T, value: unknown) {
  return (prevState: T) => ({
    ...prevState,
    [key]: value,
  })
}

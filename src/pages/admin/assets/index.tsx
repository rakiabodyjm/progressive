import {
  Box,
  Button,
  Container,
  Divider,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  TextFieldProps,
  Typography,
  TypographyProps,
} from '@material-ui/core'
import UserAutoComplete from '@src/components/UserAutoComplete'
import UsersTable from '@src/components/UsersTable'
import { addAsset, Asset } from '@src/redux/data/assetSlice'
import { userDataSelector } from '@src/redux/data/userSlice'
import { RootState } from '@src/redux/store'
import { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

export default function AdminAssetManagement() {
  const assets = useSelector((state: RootState) => state.assets)
  const dispatch = useDispatch()
  const [newAsset, setNewAsset] = useState<Asset>()
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>()
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
    timeoutRef.current = setTimeout(() => {
      setNewAsset(
        (prevState) =>
          ({
            ...prevState,
            [e.target.name]: e.target.value,
          } as Asset)
      )
    }, 200)
  }

  //   const validate = () => {
  //     const validators: Record<keyof Asset, () => string | null> = {}
  //   }
  const user = useSelector(userDataSelector)
  useEffect(() => {
    if (user) {
      setNewAsset(
        (prevState) =>
          ({
            ...prevState,
            created_by: user.user_id,
          } as Asset)
      )
    }
  }, [user])
  return (
    <Container
      style={{
        padding: 0,
        overflow: 'hidden',
      }}
    >
      <Box>
        <Typography
          variant="h3"
          style={{
            fontWeight: 700,
          }}
        >
          Asset Management
        </Typography>

        <Box mt={2}>
          <Paper variant="outlined">
            <Box p={2}>
              <Typography variant="h6" color="primary">
                Create an Asset
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Create an Asset to be transferred into accounts
              </Typography>
              <Divider
                style={{
                  margin: '16px 0',
                }}
              />
              <Grid spacing={2} container>
                <Grid item xs={4}>
                  <TypographyLabel>Asset Code</TypographyLabel>
                  <CustomTextField onChange={handleChange} placeholder="R-1000" name="code" />
                </Grid>
                <Grid item xs={8}>
                  <TypographyLabel>Asset Name</TypographyLabel>
                  <CustomTextField onChange={handleChange} placeholder="Regular Load" name="name" />
                </Grid>
              </Grid>
              <Grid spacing={2} justifyContent="space-between" container>
                <Grid item container xs={4} spacing={2}>
                  <Grid item xs={12}>
                    <TypographyLabel>Asset Price</TypographyLabel>
                    <CustomTextField
                      onChange={handleChange}
                      name="price"
                      placeholder="1000 Pesos"
                      type="number"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TypographyLabel>Quantity</TypographyLabel>
                    <CustomTextField
                      placeholder="pcs. | quantity"
                      name="quantity"
                      type="number"
                      onChange={handleChange}
                    />
                  </Grid>
                </Grid>
                <Grid item xs={8}>
                  <TypographyLabel>Description</TypographyLabel>
                  <CustomTextField
                    onChange={handleChange}
                    placeholder="REALM1000 Issued Regular Load 1000"
                    name="description"
                    multiline
                    minRows={5}
                    maxRows={5}
                  />
                </Grid>
              </Grid>
              <Box textAlign="center" p={2}>
                <Typography variant="h6">To</Typography>
              </Box>

              <Box>
                <UserAutoComplete
                  onChange={(user) => {
                    setNewAsset(
                      (prevState) =>
                        ({
                          ...prevState,
                          owner: user.id,
                        } as Asset)
                    )
                  }}
                />
              </Box>
              <Divider
                style={{
                  margin: `16px 0`,
                }}
              />
              <Box display="flex" justifyContent="flex-end">
                <Button
                  onClick={() => {
                    dispatch(addAsset(newAsset))
                  }}
                  disableElevation
                  variant="contained"
                  color="primary"
                >
                  Confirm
                </Button>
              </Box>
            </Box>
          </Paper>
        </Box>

        <Box mt={2}>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell align="left">Code</TableCell>
                  <TableCell align="left">Name</TableCell>
                  <TableCell align="left">Created By</TableCell>
                  <TableCell align="left">Owner</TableCell>
                  <TableCell align="left">Price</TableCell>
                  <TableCell align="left">Quantity</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {assets.map((row, index) => (
                  // eslint-disable-next-line react/no-array-index-key
                  <TableRow key={row.name + index}>
                    <TableCell component="th" scope="row">
                      {row.code}
                    </TableCell>
                    <TableCell align="left">{row.name}</TableCell>
                    <TableCell align="left">{row.created_by}</TableCell>
                    <TableCell align="left">{row.owner}</TableCell>
                    <TableCell align="left">{row.price}</TableCell>
                    <TableCell align="left">{row.quantity}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Box>
    </Container>
  )
}

const TypographyLabel = ({
  children,
  ...restProps
}: { children: TypographyProps['children'] } & TypographyProps<'label'>) => (
  <Typography
    display="block"
    color="primary"
    component="label"
    variant="body2"
    noWrap
    {...restProps}
  >
    {children}
  </Typography>
)
function CustomTextField<T extends Asset>({
  name,
  ...restProps
}: {
  name: keyof T & string
} & Omit<TextFieldProps, 'name'>) {
  return <TextField fullWidth variant="outlined" size="small" name={name} {...restProps} />
}

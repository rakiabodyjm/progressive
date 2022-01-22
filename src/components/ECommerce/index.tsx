import {
  Box,
  Button,
  ButtonBase,
  Grid,
  IconButton,
  List,
  makeStyles,
  Paper,
  TextField,
  Theme,
  Typography,
  useTheme,
} from '@material-ui/core'
import { Apps, ListAlt } from '@material-ui/icons'
import { setNotification, NotificationTypes } from '@src/redux/data/notificationSlice'
import { userDataSelector } from '@src/redux/data/userSlice'
import { getRetailers, getSubdistributor } from '@src/utils/api/subdistributorApi'
import userApi, { getUser, UserResponse } from '@src/utils/api/userApi'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import useSWR from 'swr'
import Image from 'next/image'

export default function ECommerce({ account }: { account: UserResponse | undefined }) {
  const [view, setView] = useState({
    rowView: true,
    gridView: false,
  })

  const { data: retailer, error } = useSWR(
    [account?.subdistributor?.id, 'subdistributor-retailers'],
    getRetailers
  )
  const [content, setContent] = useState(retailer)

  console.log(retailer)

  return (
    <div>
      <Paper
        style={{
          height: 'max-content',
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
                    <ListAlt fontSize="large" color={view.rowView ? 'primary' : undefined} />
                  </IconButton>
                </Grid>
                <Grid item>
                  <IconButton
                    onClick={() => {
                      setView({ rowView: false, gridView: true })
                    }}
                  >
                    <Apps fontSize="large" color={view.gridView ? 'primary' : undefined} />
                  </IconButton>
                </Grid>
              </Grid>
            </Grid>
          </Grid>

          <Grid flex-direction="rows" container spacing={2}>
            {view.rowView &&
              retailer?.data?.map((value) => (
                <Grid item xs={12} md={4} key={value.id}>
                  <Paper variant="outlined">
                    <Box p={2}>
                      <Grid container spacing={1}>
                        <Grid item xs={2}>
                          <Image src="/apple-touch-icon.png" width={100} height={100} />
                        </Grid>
                        <Grid item xs={10}>
                          <Grid container spacing={1}>
                            <Grid item xs={10} md={8}>
                              <Typography variant="h5">Title: {value.user.first_name} </Typography>
                            </Grid>
                            <Grid item xs={2} md={4}>
                              <Typography variant="h5" noWrap>
                                Price: {value.user.phone_number}
                              </Typography>
                            </Grid>
                            <Grid item xs={12}>
                              <Typography variant="body1" noWrap>
                                Seller: {value.user.last_name}
                              </Typography>
                            </Grid>
                            <Grid item xs={12}>
                              <Typography variant="body1" noWrap>
                                Quantity: {value.user.created_at}
                              </Typography>
                            </Grid>
                            <Grid item xs={12}>
                              <Typography variant="body1" noWrap>
                                Description: {value.user.id}
                              </Typography>
                            </Grid>
                          </Grid>
                        </Grid>
                      </Grid>
                    </Box>
                  </Paper>
                </Grid>
              ))}
            {view.gridView &&
              retailer?.data?.map((value) => (
                <Grid item xs={4} md={3} lg={2} key={value.id}>
                  <Paper variant="outlined">
                    <Box p={2}>
                      <Grid container justifyContent="center">
                        <Grid item xs={10}>
                          <Image src="/apple-touch-icon.png" width={150} height={150} />
                        </Grid>
                        <Grid item xs={12}>
                          <Typography variant="h6" noWrap>
                            Title: {value.user.first_name}
                          </Typography>
                        </Grid>
                        <Grid item xs={6}>
                          <Typography variant="body2" noWrap>
                            Price: {value.user.phone_number}
                          </Typography>
                        </Grid>
                        <Grid item xs={6}>
                          <Typography variant="body2" noWrap>
                            Qty: {value.user.created_at}
                          </Typography>
                        </Grid>
                      </Grid>
                    </Box>
                  </Paper>
                </Grid>
              ))}
          </Grid>
        </Box>
      </Paper>
    </div>
  )
}

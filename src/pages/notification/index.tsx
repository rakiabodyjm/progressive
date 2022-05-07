import { Box, Container, Divider, makeStyles, Paper, Theme, Typography } from '@material-ui/core'
import NotificationPageTable from '@src/components/NotficationPageTable'
import RoleBadge from '@src/components/RoleBadge'
import { useState } from 'react'
import { useSelector } from 'react-redux'
import { userDataSelector, UserTypes } from '@src/redux/data/userSlice'
import useGetCaesarOfUser from '@src/utils/hooks/useGetCaesarOfUser'

const useStyles = makeStyles((theme: Theme) => ({
  paperContainer: {
    padding: 10,
    width: '100%',
    overflow: 'hidden',
    [theme.breakpoints.down('xs')]: {
      maxWidth: 240,
      margin: 'auto',
    },
  },
}))

const disabledAccounts = ['admin', 'user'] as UserTypes[]

export default function NotificationPage() {
  const user = useSelector(userDataSelector)
  const [activeCaesar, setActiveCaesar] = useState<[UserTypes, string] | undefined>()
  const { data, account } = useGetCaesarOfUser({ disabledAccounts })

  const classes = useStyles()

  return (
    <Container maxWidth="lg" disableGutters>
      <Box
        style={{
          display: 'grid',
          gap: 16,
        }}
      >
        <Paper
          style={{
            padding: 16,
            flexDirection: 'column',
          }}
        >
          <Box p={2}>
            <Box>
              {activeCaesar && <RoleBadge uppercase>{activeCaesar[0]}</RoleBadge>}
              <Typography variant="h4">Notification</Typography>
              <Typography variant="body2" color="primary">
                Transactions Awaiting Approval
              </Typography>
              <Box my={2}>
                <Divider />
              </Box>
            </Box>
            <Box>
              {data &&
                data.map((role) => (
                  <Box key={role[0]} pb={2}>
                    <Paper className={classes.paperContainer}>
                      <RoleBadge uppercase>{role[0]}</RoleBadge>
                      <Box my={2}></Box>
                      <NotificationPageTable as={role[0]} caesar={role[1]} />
                    </Paper>
                  </Box>
                ))}
            </Box>
          </Box>
        </Paper>
      </Box>
    </Container>
  )
}

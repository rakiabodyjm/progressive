/* eslint-disable no-nested-ternary */
import {
  Box,
  Container,
  Divider,
  Paper,
  Tab,
  Tabs,
  Theme,
  Typography,
  useTheme,
} from '@material-ui/core'
import { grey } from '@material-ui/core/colors'
import { LoadingScreen2 } from '@src/components/LoadingScreen'
import { UserTypes, userDataSelector } from '@src/redux/data/userSlice'
import { getWallet } from '@src/utils/api/walletApi'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
/**
 *
 * Loads Available Caesar based on global user
 */
export default function CaesarTabs({
  onActiveCaesarChange,
  renderTitle,
}: {
  onActiveCaesarChange: (
    caesar: [UserTypes, string] | undefined,
    account?: [UserTypes, string]
  ) => void
  renderTitle?: JSX.Element
}) {
  const user = useSelector(userDataSelector)
  const [caesarTypes, setCaesarTypes] = useState<[UserTypes, string][]>([])
  const [activeCaesar, setActiveCaesar] = useState<[UserTypes, string] | undefined>()
  const theme: Theme = useTheme()
  const [loading, setLoading] = useState<boolean>(false)

  useEffect(() => {
    if (user && user.roles && user?.roles?.length > 0) {
      /**
       * verify if caeasar exists for each
       */
      const getWallets = () =>
        Promise.all(
          [...user.roles]
            /**
             * disable users for now
             */
            .filter((ea) => ea !== 'user')
            .map((role) =>
              getWallet({
                [role]: user[`${role}_id`],
              })
                .then((res) => [res.account_type, res.id] as [UserTypes, string])
                .catch((err) => [role, null])
            )
        ).then((final) => final.filter((ea) => !!ea[1]) as [UserTypes, string][])

      setLoading(true)
      getWallets()
        .then((res) => {
          setCaesarTypes(res)
          if (res.length > 0) {
            setActiveCaesar(res[0])
            onActiveCaesarChange(res[0], [res[0][0], user[`${res[0][0]}_id`] as string])
          }
        })
        .catch((err) => {
          console.log('No Caesars for', err)
        })
        .finally(() => {
          setLoading(true)
        })
    }
  }, [user])

  return (
    <>
      <Paper>
        <Box>
          {activeCaesar ? (
            <>
              <Box p={2} pb={0}>
                {renderTitle ? (
                  <>{renderTitle}</>
                ) : (
                  <Typography
                    style={{
                      fontWeight: 700,
                    }}
                    //   color="textSecondary"
                    align="center"
                    variant="body2"
                    color="primary"
                  >
                    Select Caesar Account
                  </Typography>
                )}

                <Tabs
                  indicatorColor="primary"
                  textColor="primary"
                  onChange={(_, value) => {
                    const result = caesarTypes.find((ea) => ea[0] === value)
                    setActiveCaesar(result)
                    if (result && user) {
                      onActiveCaesarChange(result, [result[0], user[`${result[0]}_id`] as string])
                    }
                  }}
                  value={activeCaesar[0]}
                  centered
                >
                  {caesarTypes.map(([caesarType]) => (
                    <Tab key={caesarType} value={caesarType} label={caesarType?.toUpperCase()} />
                  ))}
                </Tabs>
              </Box>
            </>
          ) : loading ? (
            <>
              <Paper>
                <LoadingScreen2
                  textProps={{
                    variant: 'h4',
                  }}
                />
              </Paper>
            </>
          ) : (
            <>
              <Paper
                style={{
                  background: theme.palette.type === 'dark' ? grey['900'] : grey['200'],
                }}
              >
                <Box p={1}>
                  <Typography
                    style={{
                      fontWeight: 700,
                    }}
                    color="textSecondary"
                    align="center"
                    variant="body2"
                  >
                    No Caesar Account Found
                  </Typography>
                </Box>
              </Paper>
            </>
          )}
        </Box>
      </Paper>
    </>
  )
}

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
import { UserTypesAndUser } from '@src/pages/admin/accounts'
import { userDataSelector } from '@src/redux/data/userSlice'
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
    caesar: [UserTypesAndUser, string] | undefined,
    account?: [UserTypesAndUser, string]
  ) => void
  renderTitle?: JSX.Element
}) {
  const user = useSelector(userDataSelector)
  const [caesarTypes, setCaesarTypes] = useState<[UserTypesAndUser, string][]>([])
  const [activeCaesar, setActiveCaesar] = useState<[UserTypesAndUser, string] | undefined>()
  const theme: Theme = useTheme()

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
                .then((res) => [res.account_type, res.id] as [UserTypesAndUser, string])
                .catch((err) => [role, null])
            )
        ).then((final) => final.filter((ea) => !!ea[1]) as [UserTypesAndUser, string][])

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
    }
  }, [user])

  return (
    <>
      <Paper>
        <Box>
          {/* {typeof tabTitle === 'string' ? (
          ) : (
            { tabTitle }
          )}
          {typeof tabSubTitle === 'string' ? (
            <Typography variant="body2" color="primary">
              {tabSubTitle}
            </Typography>
          ) : (
            { tabSubTitle }
          )} */}

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
                    <Tab
                      key={caesarType}
                      value={caesarType}
                      label={caesarType?.toUpperCase()}
                    ></Tab>
                  ))}
                </Tabs>
              </Box>
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

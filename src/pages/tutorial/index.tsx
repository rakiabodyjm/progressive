/* eslint-disable jsx-a11y/media-has-caption */
import { useEffect, useState } from 'react'
import {
  Box,
  Container,
  Paper,
  useTheme,
  Theme,
  Typography,
  Divider,
  IconButton,
  Collapse,
  AppBar,
} from '@material-ui/core'
import Hls from 'hls.js'
import KeyboardArrowDownOutlinedIcon from '@material-ui/icons/KeyboardArrowDownOutlined'
import { makeStyles } from '@material-ui/styles'
import logoImageSrc from '@public/assets/realm1000-ent-logo-white.png'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { useSelector } from 'react-redux'
import { userDataSelector } from '@src/redux/data/userSlice'

const useStyles = makeStyles((theme: Theme) => ({
  appBar: {
    height: 64,
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    background: theme.palette.secondary.main,
    paddingLeft: 16,
    paddingRight: 16,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
  },
  toolbar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
    [theme.breakpoints.down('sm')]: {
      padding: theme.spacing(2),
    },
    [theme.breakpoints.down('xs')]: {
      padding: 2,
    },
    minHeight: '90vh',
  },
}))
export default function TutorialPage() {
  const [src, setSrc] = useState('https://telco.ap.ngrok.io/public/telco-tut.m3u8')
  const [player, setPlayer] = useState<HTMLMediaElement | undefined | null>()

  const [hls, setHls] = useState<Hls | undefined>()

  useEffect(() => {
    if (player) {
      if (Hls.isSupported()) {
        // const hls = new Hls()
        setHls(new Hls())
      } else if (player.canPlayType('application/vnd.apple.mpegurl')) {
        player.src = src
        player.addEventListener('loadedmetadata', () => {
          player.play()
        })
      }
    }
    return () => {
      player?.removeEventListener('loadedmetadata', () => {
        console.log('Clean up')
      })
    }
  }, [src, player])

  useEffect(() => {
    console.log('hls', hls)
  }, [hls])

  const [open, setOpen] = useState<boolean>(false)

  useEffect(() => {
    if (!open) {
      hls?.stopLoad()
      player?.remove()
    } else if (hls && player) {
      hls.loadSource(src)
      hls.attachMedia(player)
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        player.play()
      })
    }
  }, [open, hls, player, src])
  const theme: Theme = useTheme()

  //   const playerRef = useRef<HTMLVideoElement | undefined>()
  const classes = useStyles()
  const router = useRouter()
  const isAuthenticated = useSelector(userDataSelector)

  return (
    <>
      {!isAuthenticated && (
        <>
          <AppBar position="fixed" className={classes.appBar}>
            <a
              href="/"
              onClick={(e) => {
                e.preventDefault()
                router.push('/')
              }}
              style={{
                // height: '100%',
                position: 'relative',
                height: theme.spacing(7),
                width: theme.spacing(7),
                zIndex: theme.zIndex.drawer + 100,
              }}
            >
              <Image src={logoImageSrc} alt="REALM1000 ENT" layout="fill" objectFit="contain" />
            </a>
            <Box></Box>
          </AppBar>

          <div className={classes.toolbar} />
        </>
      )}

      <Container maxWidth="sm" style={{ margin: 'auto' }}>
        <Box className={classes.content}>
          <Paper>
            <Box p={2}>
              <Typography variant="h4" color="primary">
                Telco Tutorials
              </Typography>
              <Divider
                style={{
                  margin: '16px 0',
                }}
              />
              <Paper>
                <Box
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                  }}
                  p={2}
                >
                  <Box>
                    <Typography variant="body1">Telco Cash Transfer Tutorial Video</Typography>
                    <Typography variant="caption" color="textSecondary">
                      Presented By:{' '}
                      <span style={{ color: theme.palette.primary.main }}>Jake Durante</span>{' '}
                    </Typography>
                  </Box>
                  <Box>
                    <IconButton
                      style={{
                        ...(open && {
                          transform: 'rotate(180deg)',
                        }),
                      }}
                      onClick={() => {
                        setOpen((prev) => !prev)
                      }}
                    >
                      <KeyboardArrowDownOutlinedIcon color="primary" />
                    </IconButton>
                  </Box>
                </Box>
              </Paper>
            </Box>
            <Collapse unmountOnExit in={open}>
              <Box p={2}>
                <video
                  ref={(ref) => setPlayer(ref)}
                  src={src}
                  controls
                  autoPlay
                  //   width={1080}
                  //   height={2400}
                  width="100%"
                  height={player?.offsetWidth ? player?.offsetWidth / 0.45 : '100%'}
                  color={theme.palette.primary.main}
                />
              </Box>
            </Collapse>
          </Paper>
        </Box>
      </Container>
    </>
  )
}

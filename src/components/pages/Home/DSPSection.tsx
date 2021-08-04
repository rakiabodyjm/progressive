import { makeStyles, Typography } from '@material-ui/core'
import LocationOnIcon from '@material-ui/icons/LocationOn'
import dspsJson from '@src/data/dsps.json'
import GSAPAnimate from '@src/utils/GSAPAnimate'
import { useEffect, useMemo } from 'react'
import { useInView } from 'react-intersection-observer'
// dsps as {
//   name: string
//   areas: string[]
// }
const useStyles = makeStyles((theme) => ({
  dspSection: {
    marginTop: theme.spacing(4),
    maxWidth: 1200,
    margin: 'auto',
  },
  // sectionTitle: {},
  // sectionSubTitle: {},
  dspRibbon: {
    position: 'relative',
    left: -20,
    top: -40,
    display: 'flex',
    overflow: 'hidden',
  },
  dspTitle: {
    padding: 8,
    paddingRight: 64,
    paddingLeft: 24,
    clipPath: 'polygon(0% 0%, 0% 100%, calc(100% - 64px) 100%, 100% 0%)',
    width: 'max-content',
    background: 'var(--primary-dark)',
  },
  dspTriangle: {
    width: 64,
    height: 24,
    background: 'var(--secondary-main)',
    clipPath: 'polygon(0% 100%, 80% 100%, 50% 0%)',
    position: 'relative',
    left: -34,
    top: -2,
    zIndex: -1,
  },

  dspsContainer: {
    marginTop: theme.spacing(8),
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    [theme.breakpoints.down('sm')]: {
      // gridTemplateColumns: 'minmax(1fr, 240px)',
      gridTemplateColumns: 'minmax(240px, 1fr)',
    },
  },
  color: {
    height: 48,
    background: 'var(--primary-dark)',
    position: 'relative',
    width: 'calc(100% + 32px)',
    bottom: -16,
    left: -16,
    right: 0,
    zIndex: -1,
    clipPath: 'polygon(0% 100%, 100% 100%, 100% 0%)',
  },
  accent: {
    height: 64,
    // background: 'var(--secondary-main)',
    position: 'absolute',
    width: 'calc(50% + 32px)',
    bottom: -16,
    left: -16,
    right: 0,
    zIndex: -2,
    // clipPath: 'polygon(0% 100%, 100% 100%, 100% 0%)',
    clipPath: 'polygon(0% 0%, 0% 100%, 100% 100%)',
  },
}))
export default function DSPSection() {
  const classes = useStyles()
  const dsps = useMemo(() => dspsJson, [])
  // const dsps = useMemo(
  //   () =>
  //     dspsJson.reduce((accumulator, dspData, index) => {
  //       const dspTemp = { ...dspData }
  //       if (dspTemp.areas.length > 6) {
  //         dspTemp.areas
  //       }

  //       dspTemp.areas = [[...dspTemp.areas]]
  //       return [...accumulator, { ...dspTemp }]
  //     }, []),
  //   []
  // )

  // const dsps = dspsJson.map(ea => ({
  //   ...ea,
  //   areas: ea.areas.reduce((acc, area) => {
  //       if()

  //   },[])
  // }))
  const animate = useMemo(() => new GSAPAnimate('.animate-dsp'), [])
  const { ref, inView } = useInView({
    threshold: 0.2,
  })

  useEffect(() => {
    if (inView) {
      animate.fadeIn({
        opacity: 1,
        ease: 'bounce.out',
      })
    } else {
      animate.fadeOut({
        opacity: 0,
        ease: 'bounce.out',
      })
    }
  }, [inView, animate])

  return (
    <div ref={ref} className={classes.dspSection}>
      <div>
        <Typography
          style={{
            fontWeight: 600,
            color: 'var(--primary-dark)',
          }}
          variant="h3"
        >
          DSP Agents
        </Typography>
        <Typography
          style={{
            color: 'var(--secondary-dark)',
          }}
          variant="h6"
        >
          To reload or inquire, you can directly contact the following DSP’s with their details
        </Typography>
      </div>
      <div className={classes.dspsContainer}>
        {dsps
          .sort((a, b) => b.areas.length - a.areas.length)
          .map((dsp) => (
            <div
              key={dsp.dsp}
              className="animate-dsp"
              style={{
                padding: 16,
              }}
            >
              {/* <div key={dsp.dsp}>{JSON.stringify(dsp)}</div> */}

              <div
                style={{
                  position: 'relative',
                  padding: 16,
                  borderRadius: 8,
                  border: '4px solid var(--secondary-main)',
                }}
              >
                <div className={classes.dspRibbon}>
                  <div className={classes.dspTitle}>
                    <Typography
                      style={{
                        display: 'inline',
                        fontWeight: 600,
                      }}
                      variant="h4"
                    >
                      {dsp.dsp}
                    </Typography>
                  </div>
                  <div className={classes.dspTriangle}></div>
                </div>
                <div
                  style={{
                    marginTop: -32,
                  }}
                >
                  <Typography
                    style={{
                      display: 'inline',
                      color: 'var(--primary-dark)',
                      fontWeight: 700,
                    }}
                    variant="h4"
                    noWrap
                  >
                    CONTACT NUMBER:
                  </Typography>

                  <Typography
                    variant="h4"
                    component="a"
                    href={`tel:${dsp.number}`}
                    style={{
                      marginLeft: 8,
                      verticalAlign: 'center',
                      fontWeight: 600,
                      transform: 'scale(0.8)',
                    }}
                  >
                    {dsp.number}
                  </Typography>
                </div>
                <div
                  style={{
                    display: 'flex',
                  }}
                >
                  <Typography
                    style={{
                      display: 'block',
                      color: 'var(--primary-dark)',
                      fontWeight: 700,
                    }}
                    variant="h4"
                  >
                    AREAS:
                  </Typography>
                  <div
                    style={{
                      marginLeft: 32,
                      flexGrow: 1,
                    }}
                  >
                    <Typography
                      style={{
                        display: 'block',
                        visibility: 'hidden',
                      }}
                      variant="h4"
                    >
                      AREAS:
                    </Typography>
                    {/**
                     * Max number of areas into 6
                     */}
                    <div
                      style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(2, 1fr)',
                      }}
                    >
                      {dsp.areas.map((ea) => (
                        <span
                          key={ea}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            padding: 4,
                          }}
                        >
                          <LocationOnIcon
                            style={{
                              color: 'var(--primary-dark)',
                            }}
                          />
                          <Typography
                            style={{
                              display: 'inline',
                              lineHeight: 1,
                            }}
                            variant="h6"
                          >
                            {ea}
                          </Typography>
                        </span>
                      ))}
                    </div>

                    {/* {dsp.areas.map((ea, index) => (
                      <Typography variant="h6">{ea}</Typography>
                    ))} */}
                  </div>
                </div>
                <div
                  style={{
                    position: 'relative',
                  }}
                >
                  <div className={classes.color}></div>
                  <div
                    style={{
                      background: dsp.color,
                    }}
                    className={classes.accent}
                  />
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  )
}

import { Box, Theme, Typography } from '@material-ui/core'
import { CSSProperties, makeStyles } from '@material-ui/styles'
import RoomIcon from '@material-ui/icons/Room'
import ContactPhoneIcon from '@material-ui/icons/ContactPhone'

const useStyles = makeStyles((theme: Theme) => ({
  detailsWrapper: {
    position: 'relative',
    '&:after': {
      content: "''",
      position: 'absolute',
      width: '100%',
      height: '100%',
      top: 0,
      left: 0,
      zIndex: -1,
      background: theme.palette.secondary.main,
      clipPath: 'polygon(0% 0%, 0% 100%, 100% calc(100% - 64px), 100% 64px)',
    },
  },
  details: {
    // padding: 64,
    padding: '64px 0px',
    maxWidth: 1200,
    margin: 'auto',
    color: theme.palette.background.paper,
  },

  content: {
    '& .header': {
      '& .title': {
        fontWeight: 600,
      },
    },
    '& > *': {
      marginTop: 8,
    },
    '& .content': {
      textTransform: 'uppercase',

      '& .key': {
        fontWeight: 700,
        lineHeight: 1.2,
      },
      '& .value': {
        fontWeight: 700,
        color: theme.palette.primary.dark,
      },
    },
    '& .details': {
      '& .icon': {
        color: theme.palette.primary.dark,
      },
      '& .key': {
        fontWeight: 700,
        textTransform: 'uppercase',
        marginLeft: 8,
        lineheight: 1,
      },
      '& .value': {
        textTransform: 'none',
        fontWeight: 500,
      },
    },
  },
}))

const Details = () => {
  const classes = useStyles()
  return (
    <div className={classes.detailsWrapper}>
      <div className={classes.details}>
        <div className={classes.content}>
          <div className="header">
            <Typography className="title" variant="h3">
              DETAILS
            </Typography>
          </div>
          <div className="content">
            {contents.map((ea) => (
              <Box display="flex" key={ea.key}>
                <Typography variant="h6" className="key">
                  {ea.key}: <span className="value">{ea.value}</span>
                </Typography>
                {/* <Typography variant="h6" className="value">
                {ea.value}
              </Typography> */}
              </Box>
            ))}
          </div>
          <div className="details">
            {details.map(({ icon: Icon, ...ea }) => (
              <Box display="flex" key={ea.key}>
                <Icon className="icon" />
                <Typography className="key">
                  {ea.key}: <span className="value">{ea.value}</span>
                </Typography>
              </Box>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Details

const contents = [
  { key: 'Territorial Sub Distributor', value: 'Realm 1000 Enterprise Inc., Philippines' },
  { key: 'Authorized Distributor Sales Personnel', value: 'Realm 1000 Ent Inc' },
]

const details = [
  {
    key: 'Office Address',
    value: '4550 Sampaloc Street., Santolan Road, Gen. T. De Leon, Valenzuela City',
    icon: (props) => <RoomIcon {...props} />,
  },
  {
    key: 'Contact Number',
    value: '0929-839-8225 / 0915-150-9818',
    icon: (props) => <ContactPhoneIcon {...props} />,
  },
]

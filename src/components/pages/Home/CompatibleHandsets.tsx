import { ButtonBase, Typography, Paper, Box, Collapse } from '@material-ui/core'
import { useState } from 'react'
import { AddCircle, RemoveCircle } from '@material-ui/icons'

const CompatibleHandsets = () => {
  const [expanded, setExpanded] = useState([])
  return (
    <div>
      <Typography
        variant="h6"
        style={{
          marginBottom: 16,
        }}
        component="p"
      >
        These are the Compatible Handsets by Manufacturer and Series
      </Typography>
      {supportedSeries.map((manufacturer) => (
        <div key={manufacturer.name}>
          <Paper
            style={{
              marginBottom: 16,
              overflow: 'hidden',
              // border: '1px solid var(--secondary-main)',
            }}
            // variant="outlined"
          >
            <ButtonBase
              style={{
                // width: '100%',
                padding: 16,
                textAlign: 'left',
                justifyContent: 'flex-start',
              }}
              className="header"
              onClick={() => {
                setExpanded((prevState) => {
                  if (prevState.includes(manufacturer.name)) {
                    return [...prevState].filter((fi) => fi !== manufacturer.name)
                  }
                  return [...prevState, manufacturer.name]
                })
              }}
            >
              <Box
                width="100%"
                display="flex"
                alignItems="center"
                // color="primary"
                color="var(--primary-dark)"
                justifyContent="space-between"
              >
                <Typography variant="h6" component="p">
                  {manufacturer.name}
                </Typography>
                {expanded.includes(manufacturer.name) ? <RemoveCircle /> : <AddCircle />}
              </Box>
            </ButtonBase>
            <Collapse in={expanded.includes(manufacturer.name)}>
              <div
                style={{
                  padding: 16,
                }}
              >
                {manufacturer.series?.map((series) => (
                  <div key={series.name}>
                    <Typography variant="body1">{series.name}</Typography>
                    <PhoneLists phones={series?.phones} />
                  </div>
                )) || <PhoneLists phones={manufacturer.phones} />}
              </div>
            </Collapse>
          </Paper>
        </div>
      ))}
    </div>
  )
}

const PhoneLists = ({ phones }: { phones: string[] }) => (
  <ul
    style={{
      listStyleType: 'none',
    }}
  >
    {phones.map((seriesPhone) => (
      <li key={seriesPhone}>
        <Typography variant="subtitle1">{seriesPhone}</Typography>
      </li>
    ))}
  </ul>
)

const features = [
  '25GB High Speed Data',
  'Unlimited Texts to all mobile networks',
  'Unlimited DITO-to-DITO Calls',
  '300 mins of calls to other mobile networks',
]
const notes =
  'Your SIM and promo must be activated within 30 days from delivery. The promo will not activate beyond the 30-day delivery period. Your DITO SIM Card may only be used on a compatible mobile device that can make voice calls and send SMS and within the areas covered by the DITO Network'

interface Phones {
  name: string
  phones: string[]
}

interface PhonesWithSeries {
  name: string
  series?: Phones[]
  phones?: string[]
}

const supportedSeries: PhonesWithSeries[] = [
  {
    name: 'Cherry Mobile',
    series: [
      {
        name: 'Aqua Series',
        phones: ['Aqua S9', 'Aqua S9 Lite', 'Aqua S9 Max'],
      },
      {
        name: 'Flare Series',
        phones: [
          'Flare S8',
          'Flare S8 Max',
          'Flare S8 Lite',
          'Flare S8 Pro',
          'Flare Y20',
          'Flare Y5',
        ],
      },
    ],
  },
  {
    name: 'Huawei',
    series: [
      {
        name: 'Nova Series',
        phones: ['Nova 5T', 'Nova 7', 'Nova 7 SE', 'Nova 7i'],
      },
      {
        name: 'Mate Series',
        phones: ['Mate 30', 'Mate 30 Pro', 'Mate 30 Pro 5G', 'Mate 40 Pro', 'Mate 40'],
      },
      {
        name: 'P Series',
        phones: ['P30', 'P30 Pro', 'P40 ', 'P40 Pro'],
      },
      {
        name: 'Y Series',
        phones: ['Y7a', 'Y7p', 'Y9s', 'Y9 Prime 2019'],
      },
    ],
  },
  { name: 'Infinix', phones: ['Note 8'] },
  {
    name: 'MyPhone',
    phones: [
      'MyT6s',
      'MyWX1 Plus',
      'MyWX2',
      'MyWX2 Pro',
      'MyXi1 Plus',
      'MyXi1 Pro',
      'MyXi3',
      'MyX12',
      'MyT8',
    ],
  },
  {
    name: 'Oppo',
    series: [
      {
        name: 'A Series',
        phones: [' A12', 'A15', 'A15s', 'A31', 'A52', 'A53', 'A54', 'A74', 'A74 5G', 'A92', 'A94'],
      },
      {
        name: 'Reno Series',
        phones: ['Reno 3 Pro', 'Reno 4', 'Reno 4z', 'Reno 5', 'Reno 5g'],
      },
    ],
  },
  {
    name: 'REALMI',
    series: [
      {
        name: 'C Series',
        phones: ['C11', 'C12', 'C15', 'C15 Qualcomm'],
      },
      {
        name: '6 Series',
        phones: ['Realme 6', 'Realme 6 Pro', 'Realme 6i'],
      },
      {
        name: '7 Series',
        phones: ['Realme 7 Pro', 'Realme 7i'],
      },
    ],
  },
  {
    name: 'Samsung',
    series: [
      {
        name: 'Galaxy Series',
        phones: [
          'Galaxy S20',
          'Galaxy S20 Ultra',
          'Galaxy S20+',
          'Galaxy Fold 2',
          'Galaxy S21 5G',
          'Galaxy S21+ 5G',
          'Galaxy S21 Ultra 5G',
        ],
      },
      {
        name: 'A Series',
        phones: ['A02s', 'A32', 'A50s', 'A52 5G', 'A32 5G'],
      },
      {
        name: 'Note Series',
        phones: ['Note 20', 'Note 20 Ultra 5G'],
      },
    ],
  },
  {
    name: 'TCL',
    phones: ['Plex ', '1SE', '10 Plus'],
  },
  {
    name: 'TECNO',
    series: [
      {
        name: 'Camon Series',
        phones: ['CAMON 16', 'CAMON 17p'],
      },
      {
        name: 'Spark Series',
        phones: ['Spark 6', 'Spark 6 Go', 'Spark 7', 'Spark 7 Pro'],
      },
      {
        name: 'Others',
        phones: ['POVA'],
      },
    ],
  },
  {
    name: 'VIVO',
    series: [
      {
        name: 'V Series',
        phones: ['V Series', 'V11', 'V11i', 'V15', 'V15 Pro', 'V17 Pro', 'V19 Neo'],
      },
      {
        name: 'Y Series',
        phones: [
          'Y11',
          'Y17',
          'Y19',
          'Y20i',
          'Y30',
          'Y81',
          'Y85',
          'Y91',
          'Y91c',
          'Y91i',
          'Y95',
          'Y12',
          'Y15',
          'Y31',
          'Y20S G',
        ],
      },
      {
        name: 'S Series',
        phones: ['S1', 'S1 Pro'],
      },
      {
        name: 'X Series',
        phones: ['X50 Pro', 'X21', 'X50'],
      },
      {
        name: 'Others',
        phones: ['NEX3'],
      },
    ],
  },
  {
    name: 'Xiaomi',
    phones: ['Redmi 9A'],
  },
]
// const supportedMobiles = []
export default CompatibleHandsets

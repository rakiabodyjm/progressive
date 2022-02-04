import { Collapse, List } from '@material-ui/core'
import {
  AccountTree,
  ContactPhone,
  Dashboard,
  PersonPinCircle,
  Assignment,
} from '@material-ui/icons'
import { nanoid } from '@reduxjs/toolkit'
import RenderListItem from '@src/components/NavigationLayout/Drawer/RenderListItem'
import RenderSubListItem from '@src/components/NavigationLayout/Drawer/RenderSubListItem'
import { userDataSelector } from '@src/redux/data/userSlice'
import { useMemo, useState } from 'react'
import { useSelector } from 'react-redux'

const subdMenuItems = [
  {
    title: 'DSPs',
    icon: <PersonPinCircle />,
    url: '/dsp',
  },
  {
    title: 'Retailers',
    icon: <ContactPhone />,
    url: '/subdistributor/retailer',
  },
]

const dspMenuItems = [
  {
    title: 'Retailers',
    icon: <ContactPhone />,
    url: '/dsp/retailer',
    // id: 'dspRetailer',
  },
]

const collapseSubdDspRetailers = [
  {
    title: 'Subdistributor',
    icon: <AccountTree style={{ fontSize: 18 }} />,
    url: '/subdistributor/retailer',
    // id: 'collapseSubdRetailers',
  },
  {
    title: 'DSP',
    icon: <PersonPinCircle style={{ fontSize: 18 }} />,
    url: '/dsp/retailer',
    // id: 'collapseDspRetailers',
  },
]

/**
 * has subdistributor and
 * dsp account
 */
const subdAndDspMenu: (SingleMainMenuItemType | MultipleMainMenuItemType)[] = [
  {
    title: 'DSPs',
    icon: <PersonPinCircle />,
    url: '/dsp',
  },
  {
    title: 'Retailers',
    icon: <ContactPhone />,
    subMenu: [
      {
        title: 'as Subd',
        url: '/subdistributor/retailer',
        icon: <AccountTree />,
      },
      {
        title: 'as DSP',
        url: '/dsp/retailer',
        icon: <PersonPinCircle />,
      },
    ],
  },
]
type SingleMainMenuItemType = {
  title: string
  icon: JSX.Element
  url: string
}

export type MultipleMainMenuItemType = {
  title: string
  icon: JSX.Element
  subMenu: SingleMainMenuItemType[]
}

export default function MainMenuItems({ open }: { open: boolean }) {
  const user = useSelector(userDataSelector)
  const mainMenuItems = useMemo(() => {
    if (user) {
      let returnMenuItems: (SingleMainMenuItemType | MultipleMainMenuItemType)[] = [
        {
          title: 'Dashboard',
          icon: <Dashboard />,
          url: '/',
        },
        {
          title: 'Inventory',
          icon: <Assignment />,
          url: '/inventory',
        },
      ]

      if (user.subdistributor_id && !user.dsp_id) {
        returnMenuItems = [...returnMenuItems, ...subdMenuItems]
      }
      if (user.dsp_id && !user.subdistributor_id) {
        returnMenuItems = [...returnMenuItems, ...dspMenuItems]
      }

      if (user.retailer_id) {
        returnMenuItems = [...returnMenuItems]
      }

      if (user.dsp_id && user.subdistributor_id) {
        returnMenuItems = [...returnMenuItems, ...subdAndDspMenu]
      }

      return returnMenuItems.filter(
        (filter, index, array) => array.map((ea) => ea.title).indexOf(filter.title) === index
      )
    }
    return []
  }, [user])

  return (
    <List>
      {mainMenuItems.map((each) => {
        if ((each as MultipleMainMenuItemType)?.subMenu) {
          return (
            <RenderSubListItem key={nanoid()} {...(each as MultipleMainMenuItemType)} open={open} />
          )
        }
        return (
          <RenderListItem
            key={(each as SingleMainMenuItemType).url}
            open={open}
            {...(each as SingleMainMenuItemType)}
          />
        )
      })}
    </List>
  )
}

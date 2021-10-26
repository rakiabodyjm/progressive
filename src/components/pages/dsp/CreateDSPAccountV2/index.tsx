import { Box, Divider, Grid, Paper, TextField, Theme, Typography } from '@material-ui/core'
import { makeStyles } from '@material-ui/styles'
import CreateDSPAccount from '@src/components/pages/dsp/CreateDSPAccount'
import SimpleMultipleAutoComplete from '@src/components/SimpleMultipleAutoComplete'
import { createDspAcconut, CreateDspAccount } from '@src/utils/api/dspApi'
import { MapIdResponseType, SearchMap, searchMap } from '@src/utils/api/mapIdApi'
import React, { useEffect, useState } from 'react'
import validator from 'validator'
const useStyles = makeStyles((theme: Theme) => ({
  formLabel: {
    color: theme.palette.primary.main,
  },
  errorLabel: {
    color: theme.palette.error.main,
  },
}))
export default function CreateDSPAccountV2() {
  const [newDspAccount, setNewDspAccount] = useState<CreateDspAccount>({
    area_id: [],
    dsp_code: '',
    e_bind_number: '',
    subdistributor: '',
    user: '',
  })

  const [errors, setErrors] = useState<Record<keyof CreateDspAccount, string | null>>({
    area_id: null,
    dsp_code: null,
    e_bind_number: null,
    subdistributor: null,
    user: null,
  })
  const classes = useStyles()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewDspAccount((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }))
  }

  const [isSubmitted, setIsSubmitted] = useState<boolean>(false)

  useEffect(() => {
    console.log(errors)
  }, [errors])

  return (
    <Paper variant="outlined">
      <Box p={2}>
        <Typography color="primary" variant="h6">
          Create New DSP Account
        </Typography>

        <Typography color="textSecondary" variant="body2">
          Complete the form to create a new DSP Account
        </Typography>
        <Divider
          style={{
            margin: '16px 0',
          }}
        />
        <Grid spacing={2} container>
          <Grid item xs={4}>
            <Typography className={classes.formLabel} component="label" variant="body2">
              DSP Code
            </Typography>

            <TextField
              variant="outlined"
              name="dsp_code"
              onChange={handleChange}
              fullWidth
              size="small"
              value={newDspAccount.dsp_code}
            />

            <Typography
              style={{ display: !isSubmitted ? 'none' : undefined }}
              className={classes.errorLabel}
              component="label"
              variant="caption"
            >
              *{errors.dsp_code && errors.dsp_code}
            </Typography>
          </Grid>
          <Grid item xs={8}>
            <Typography className={classes.formLabel} component="label" variant="body2">
              E Bind Number
            </Typography>
            <TextField
              variant="outlined"
              name="e_bind_number"
              onChange={handleChange}
              fullWidth
              size="small"
              value={newDspAccount.e_bind_number}
            />
            <Typography
              style={{ display: !isSubmitted ? 'none' : undefined }}
              className={classes.errorLabel}
              component="label"
              variant="caption"
            >
              *{errors.e_bind_number && errors.e_bind_number}
            </Typography>
          </Grid>
          <Grid item xs={8}>
            <Typography className={classes.formLabel} component="label" variant="body2">
              Area IDs
            </Typography>
            <SimpleMultipleAutoComplete
              /**
               * Initial value needed by searchMap async function
               */
              initialQuery={{ limit: 100, page: 0, search: '' } as SearchMap}
              /**
               * searchMap async function with the initialQuery as 'q'
               */
              fetcher={(q) => searchMap(q).then((res) => res)}
              /**
               * onChange event of AutoComplete
               */
              onChange={(areaIds: MapIdResponseType[]) => {
                setNewDspAccount((prevState) => ({
                  ...prevState,
                  area_id: areaIds.map((ea) => ea.area_id),
                }))
              }}
              /**
               * This is how options are previewed as selections
               */
              getOptionLabel={(option) => `${option.area_name}, ${option.parent_name}`}
              /**
               * This is how options are previewed as selected
               */
              tagLabel={(option) => `${option.area_name}`}
              /**
               * setting the query parameter according to keyboard onChange event
               */
              querySetter={(previousQuery, keryboardEvent) => ({
                ...previousQuery,
                search: keryboardEvent,
              })}
              /**
               * equality test for AutoComplete to know which options are selected
               */
              getOptionSelected={(value1, value2) => value1.area_id === value2.area_id}
            />
          </Grid>
        </Grid>
      </Box>
    </Paper>
  )
}

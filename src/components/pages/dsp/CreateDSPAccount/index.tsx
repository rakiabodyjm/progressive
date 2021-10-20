import { Box, Divider, Paper, Typography } from '@material-ui/core'
import AutoFormRenderer, {
  RenderAutocomplete,
  RenderTextField,
} from '@src/components/AutoFormRenderer'
import { useCallback } from 'react'

export default function CreateDSPAccount({ subdistributorId }) {
  const onChange = useCallback<RenderTextField['onChange']>(() => {}, [])
  return (
    <Paper variant="outlined">
      <Box p={2}>
        <Typography variant="h6" color="primary">
          Create DSP Account
        </Typography>
        <Typography variant="body2" color="textSecondary">
          Create DSP Account for Subdistributor
        </Typography>
        <Divider
          style={{
            marginTop: 8,
            marginBottom: 8,
          }}
        />
        <Box>
          {/* <AutoFormRenderer
            fields={fields({
              onChange,
              value: '',
            })}
          /> */}
        </Box>
      </Box>
    </Paper>
  )
}

const fields = ({
  onChange,
  value,
}: {
  onChange: RenderTextField['onChange']
  value: any
}): (RenderTextField | RenderAutocomplete)[] => [
  {
    label: 'First Name',
    name: 'first_name',
    type: 'input',
    onChange,
    value,
  },
  //   {
  //     type: 'autocomplete',
  //   },
]
// const fields: RenderTextField[] = [
//   {
//     label: 'First Name',
//     name: 'first_name',
//     type: 'input',
//     onChange:
//   },
// ]

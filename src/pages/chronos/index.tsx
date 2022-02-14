import { Box, Container, Divider, Paper, Typography } from '@material-ui/core'
import { userDataSelector } from '@src/redux/data/userSlice'
import { useState } from 'react'
import { useSelector } from 'react-redux'
import { KeyboardTimePicker, MuiPickersUtilsProvider } from '@material-ui/pickers'
import 'date-fns'
import DateFnsUtils from '@date-io/date-fns'
type Time = 'time in' | 'time out' | 'lunch in' | 'lunch out'

export default function ChronosIndexPage() {
  const user = useSelector(userDataSelector)
  const [time, setTime] = useState<Time>('time in')
  const [date, setDate] = useState<Date>(new Date())
  return (
    <MuiPickersUtilsProvider utils={DateFnsUtils}>
      <Container maxWidth="sm">
        <Paper>
          <Box p={2}>
            <Box>
              <Typography
                style={{
                  fontWeight: 600,
                }}
                variant="h4"
              >
                {time.toUpperCase()}
              </Typography>
              <Typography variant="body2" color="primary">
                Input daily time records for recording
              </Typography>
            </Box>
            <Box my={2}>
              <Divider />
            </Box>
            <Box p={2}>
              <KeyboardTimePicker
                margin="dense"
                label="Time Picker"
                value={date}
                onChange={(dateValue) => {
                  if (dateValue) {
                    setDate(dateValue)
                  }
                }}
                KeyboardButtonProps={{
                  'aria-label': 'change time',
                }}
                variant="static"
              />
            </Box>
          </Box>
        </Paper>
      </Container>
    </MuiPickersUtilsProvider>
  )
}

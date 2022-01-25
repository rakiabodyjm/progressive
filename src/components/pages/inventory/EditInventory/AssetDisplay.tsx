import { Box, Divider, Grid, Paper, Typography } from '@material-ui/core'
import FormLabel from '@src/components/FormLabel'
import { Asset } from '@src/utils/api/assetApi'

export default function AssetDisplay({ selectedAsset }: { selectedAsset: Asset }) {
  return (
    <Grid container spacing={1}>
      <Grid item xs={12}>
        <Paper variant="outlined">
          <Box height="100%" p={2}>
            <Typography variant="body1" color="primary">
              Asset
            </Typography>
            <Typography variant="caption" color="textSecondary">
              Original Name, Description and Pricing
            </Typography>

            <Box my={1}>
              <Divider />
            </Box>

            <Grid container spacing={1}>
              <Grid item xs={12}>
                <FormLabel variant="body2">Name:</FormLabel>
                <FormLabel color="inherit" variant="caption">
                  {renderNullOrSelect(selectedAsset?.name)}
                </FormLabel>
              </Grid>
              <Grid item xs={12}>
                <FormLabel variant="body2">Description:</FormLabel>
                <FormLabel color="inherit" variant="caption">
                  {renderNullOrSelect(
                    selectedAsset?.description && `${selectedAsset?.description.slice(0, 95)}...`
                  )}
                </FormLabel>
              </Grid>
              <Grid item xs={12}>
                <FormLabel variant="body2">Unit Price:</FormLabel>
                <FormLabel color="inherit" variant="caption">
                  {renderNullOrSelect(selectedAsset?.unit_price)}
                </FormLabel>
              </Grid>

              <Grid item xs={6}>
                <FormLabel variant="body2">SRP Subd:</FormLabel>
                <FormLabel color="inherit" variant="caption">
                  {renderNullOrSelect(selectedAsset?.srp_for_subd)}
                </FormLabel>
              </Grid>
              <Grid item xs={6}>
                <FormLabel variant="body2">SRP DSP:</FormLabel>
                <FormLabel color="inherit" variant="caption">
                  {renderNullOrSelect(selectedAsset?.srp_for_dsp)}
                </FormLabel>
              </Grid>
              <Grid item xs={6}>
                <FormLabel variant="body2">SRP Retailer:</FormLabel>
                <FormLabel color="inherit" variant="caption">
                  {renderNullOrSelect(selectedAsset?.srp_for_retailer)}
                </FormLabel>
              </Grid>
              <Grid item xs={6}>
                <FormLabel variant="body2">SRP User:</FormLabel>
                <FormLabel color="inherit" variant="caption">
                  {renderNullOrSelect(selectedAsset?.srp_for_user)}
                </FormLabel>
              </Grid>
            </Grid>
          </Box>
        </Paper>
      </Grid>
    </Grid>
  )
}

function renderNullOrSelect(arg: string | number | undefined): string | number | JSX.Element {
  if (!arg) {
    return (
      <Typography component="i" variant="caption" color="textSecondary">
        Loading...
      </Typography>
    )
  }
  return arg
}

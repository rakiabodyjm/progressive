export interface OTPData {
  id: string
  from: string
  to: string
  request_id?: string
  verified?: boolean
}

export type OTPTypes = {
  message: string
  otp: OTPData
}

export type OtpRequestTypes = {
  to: string
  cash_transfer?: string
}

import { Typography } from '@material-ui/core'
import FormLabel from '@src/components/FormLabel'
import SimpleAutoComplete from '@src/components/SimpleAutoComplete'
import { CaesarWalletResponse, searchWallet } from '@src/utils/api/walletApi'
import { CaesarBank, TransferType } from '@src/utils/types/CashTransferTypes'
import axios from 'axios'
import { useState } from 'react'

type DepositType = {
  from: CaesarWalletResponse['id']
  caesar_bank_to: CaesarBank['id']
  as: CashTransferAs
  amount: number
}

export default function CashTransferForm({
  caesarBankData,
  caesar,
}: {
  caesarBankData: CaesarBank
  caesar: CaesarWalletResponse
}) {
  const [formValues, setFormValues] = useState<
    {
      caesar_bank_to?: CaesarBank['id']
      caesar_bank_from?: CaesarBank['id']
      to?: CaesarWalletResponse['id']
      from?: CaesarWalletResponse['id']
      amount: number
      transfer_type: TransferType['id']
      as: CashTransferAs
      // transfer_type: 2
    }[]
  >([])
  const setFormValueOf =
    (index: number) => (key: keyof typeof formValues[number], value: string | number | unknown) => {
      setFormValues((prev) => {
        const copyPrev = [...prev]

        copyPrev[index] = {
          ...copyPrev[index],
          [key]: value,
        }

        return copyPrev
      })
    }

  // const forms: () => [{}] = (formNumber: number) => [[{}, {}], []]
  return (
    <>
      <FormLabel>Transfer From</FormLabel>
      <Typography>{caesarBankData.description}</Typography>

      <FormLabel>Transfer To:</FormLabel>
    </>
  )
}

const searchCaesarBank = (searchString?: string) =>
  axios
    .get(`/cash-transfer/caesar-bank`, {
      ...(searchString && {
        params: {
          search: searchString,
        },
      }),
    })
    .then((res) => res.data.data as CaesarBank[])

const ToCaesarBankAutoComplete = ({
  caesarBankData,
  onChange,
}: {
  caesarBankData: CaesarBank
  onChange: (...params: any) => void
}) => (
  <SimpleAutoComplete<CaesarBank, string | undefined>
    initialQuery={undefined}
    fetcher={(params) =>
      searchCaesarBank(params).then((res) => res.filter((ea) => ea.id !== caesarBankData.id))
    }
    getOptionLabel={(option) => `${option.id} | ${option.description}`}
    getOptionSelected={(val1, val2) => val1.id === val2.id}
    onChange={onChange}
    querySetter={(param) => param}
  />
)

const ToCaesarAutoComplete = ({
  caesar,
  onChange,
}: {
  caesar?: CaesarWalletResponse
  onChange: () => void
}) => (
  <SimpleAutoComplete<CaesarWalletResponse, string | undefined>
    initialQuery={undefined}
    fetcher={(params) =>
      searchWallet({
        limit: 100,
        page: 0,
        searchQuery: params,
      }).then((res) => res.data.filter((ea) => (caesar ? ea.id !== caesar.id : true)))
    }
    getOptionLabel={(option) => `${option.id} | ${option.description}`}
    getOptionSelected={(val1, val2) => val1.id === val2.id}
    onChange={onChange}
    querySetter={(param) => param}
  />
)

export enum CashTransferAs {
  DEPOSIT = 'DEPOSIT',
  TRANSFER = 'TRANSFER',
  WITHDRAW = 'WITHDRAW',
  LOAN = 'LOAN',
  LOAN_PAYMENT = 'LOAN PAYMENT',
  INTEREST = 'INTEREST',
  BANK_FEES = 'BANK FEES',
}

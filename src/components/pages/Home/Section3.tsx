import { ButtonBase, Theme, Typography } from '@material-ui/core'
import { makeStyles } from '@material-ui/styles'
import AddCircleIcon from '@material-ui/icons/AddCircle'
import RemoveCircleIcon from '@material-ui/icons/RemoveCircle'
import { useCallback, useState } from 'react'
const useStyles = makeStyles((theme: Theme) => ({
  section: {
    maxWidth: 1200,
    margin: 'auto',
    '& .sectionTitle': {
      marginTop: 64,
      textTransform: 'uppercase',
      width: 'max-content',
      margin: 'auto',

      fontWeight: 700,
    },
    '& .divider': {
      height: 2,
      //   background: 'red',
      background: theme.palette.secondary.dark,
      width: 240,
      margin: 'auto',
      marginTop: 16,
      marginBottom: 32,
    },
  },
  content: {},
  faq: {
    marginBottom: 16,
  },
  faqBar: {
    background: theme.palette.secondary.main,
    padding: 8,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    color: theme.palette.primary.light,
    '& .question': {
      textTransform: 'uppercase',
      color: theme.palette.primary.dark,
      fontWeight: 600,
    },
    '& .icon': {
      color: theme.palette.primary.dark,
      fontSize: 26,
      marginRight: 16,
    },
  },
  faqContent: {
    padding: 8,
    '& .answer': {
      fontFamily: 'Raleway, sans-serif',
      lineHeight: 1.4,
    },
  },
}))

const Section3 = () => {
  const classes = useStyles()
  const [expanded, setExpanded] = useState<string[]>([])

  const isExpanded: (args: string) => boolean = useCallback((item) => expanded.includes(item), [
    expanded,
  ])
  return (
    <div className={classes.section}>
      <Typography className="sectionTitle" noWrap variant="h3" component="p">
        FAQs
      </Typography>
      <div className="divider" />
      <div className={classes.content}>
        {FAQs.map((faq) => (
          <>
            <div className={classes.faq}>
              <ButtonBase className={classes.faqBar}>
                <Typography className="question" variant="h5">
                  {faq.question}
                </Typography>

                <AddCircleIcon className="icon" />
              </ButtonBase>

              <div className={classes.faqContent}>
                <Typography className="answer" variant="h6">
                  {faq.answer}
                </Typography>
              </div>
            </div>
          </>
        ))}
      </div>
    </div>
  )
}

const FAQs = [
  {
    question: 'How do I activate my internet settings?',
    answer:
      'DITO Sim will automatically activate once you access any of the following: data internet, send message or via call. Once you successfully activated it, you will receive a welcome message that confirms the activation. They will also send you the link where to download the app and initialize the password. It also displays the promo detail that comes with your sim. If you still have no access to internet, it is because your phone is not in their compatible list. You can try changing your device APN settings',
  },
  {
    question: 'How do I check my current balance?',
    answer:
      'Using the DITO Mobile App, you can check your load balance right away. Login to DITO App using your Mobile Number and the password you initially set. The app will also show you when will your load expire.',
  },
  {
    question: 'How do I purchase DITO Load?',
    answer:
      'To load your DITO Sim, you need to open DITO App. From here, go to LOAD then select the amount that you want to top-up. At checkout, you need to pick the payment method as mentioned above and click PAY to proceed. After a couple of seconds, you already have successfully loaded your account.',
  },
  {
    question: 'DITO Sim Expiration',
    answer:
      'The promo must be availed and activated within 30 days from the date the DITO Sim was succesfully delivered. The SIM Card shall expire of not activated within 1 year of purchase',
  },
]

export default Section3

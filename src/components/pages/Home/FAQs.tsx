import { ButtonBase, Collapse, Theme, Typography } from '@material-ui/core'
import { makeStyles } from '@material-ui/styles'
import AddCircleIcon from '@material-ui/icons/AddCircle'
import RemoveCircleIcon from '@material-ui/icons/RemoveCircle'
import { memo, useCallback, useState } from 'react'
const useStyles = makeStyles((theme: Theme) => ({
  section: {
    maxWidth: 1200,
    margin: 'auto',
    '& .sectionTitle': {
      marginTop: 64,
      textTransform: 'uppercase',
      //   width: 'max-content',
      textAlign: 'center',
      margin: 'auto',

      fontWeight: 700,
    },

    '& .divider': {
      height: 2,
      background: theme.palette.secondary.dark,
      width: 180,
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
    padding: 16,
    display: 'flex',
    borderRadius: 4,
    overflow: 'hidden',
    justifyContent: 'space-between',
    height: '100%',
    position: 'relative',
    width: '100%',
    alignItems: 'inherit',
    color: theme.palette.primary.main,
    '& .question': {
      textTransform: 'uppercase',
      color: theme.palette.primary.dark,
      fontWeight: 600,
      lineHeight: 1,
      textAlign: 'left',
    },

    '& .icon': {
      color: theme.palette.background.paper,
      fontSize: 24,
      position: 'absolute',
      top: '50%',
      transform: 'translateY(-50%)',
      right: 8,
      zIndex: 1,
    },

    '& .icon-container': {
      width: '10%',
      minWidth: 100,
      position: 'relative',
      '&::after': {
        content: "''",
        position: 'absolute',
        top: -16,
        right: -16,
        bottom: -16,
        left: 0,
        background: theme.palette.primary.dark,
        clipPath: 'polygon(100% 0%, 80% 0,  0% 100%, 100% 100%)',
      },
    },
  },
  faqContent: {
    padding: 8,
    '& .answer': {
      fontFamily: 'Raleway, sans-serif',
      lineHeight: 1.4,
      textIndent: 40,
    },
  },
}))

const Section3 = () => {
  const classes = useStyles()
  const [expanded, setExpanded] = useState<number[]>([])

  // eslint-disable-next-line no-unused-vars
  const isExpanded: (args: number) => boolean = useCallback((item) => expanded.includes(item), [
    expanded,
  ])
  // eslint-disable-next-line no-unused-vars
  const toggleExpanded: (args: number) => void = useCallback(
    (item) =>
      setExpanded((prevState) => {
        if (prevState.includes(item)) {
          return [...prevState].filter((fi) => fi !== item)
        }
        return [...prevState, item]
      }),
    [setExpanded]
  )
  return (
    <>
      <a href="/#faq" id="faq" className="anchor" />
      <div className={classes.section}>
        <Typography className="sectionTitle" noWrap variant="h3" component="p">
          FAQs
        </Typography>
        <div className="divider" />
        <div className={classes.content}>
          {FAQs.map((faq, index) => (
            <FAQItem
              key={faq.answer}
              index={index}
              faq={faq}
              isExpanded={isExpanded}
              toggleExpanded={toggleExpanded}
            />
          ))}
        </div>
      </div>
    </>
  )
}
const FAQItemOriginal = ({ isExpanded, toggleExpanded, index, faq }) => {
  const classes = useStyles()

  return (
    <div className={classes.faq}>
      <ButtonBase
        onClick={() => {
          toggleExpanded(index)
        }}
        className={classes.faqBar}
      >
        <Typography className="question" variant="h5">
          {faq.question}
        </Typography>
        <div className="icon-container"></div>
        {isExpanded(index) ? (
          <RemoveCircleIcon className="icon" />
        ) : (
          <AddCircleIcon className="icon" />
        )}
      </ButtonBase>

      <Collapse in={isExpanded(index)}>
        <div className={classes.faqContent}>
          <Typography className="answer" variant="h6">
            {faq.answer}
          </Typography>
        </div>
      </Collapse>
    </div>
  )
}
const FAQItem = memo(FAQItemOriginal)

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

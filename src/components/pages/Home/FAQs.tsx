import { ButtonBase, Collapse, Theme, Typography, Paper } from '@material-ui/core'
import { makeStyles } from '@material-ui/styles'
// import AddCircleIcon from '@material-ui/icons/AddCircle'
// import RemoveCircleIcon from '@material-ui/icons/RemoveCircle'
import { AddCircle, RemoveCircle } from '@material-ui/icons'
import { memo, useCallback, useEffect, useState, useMemo } from 'react'
import ContactPhoneIcon from '@material-ui/icons/ContactPhone'
import { useInView } from 'react-intersection-observer'
import { GSAPAnimate } from '@src/components/pages/Home/PromoPackages'
import CompatibleHandsets from './CompatibleHandsets'

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
    padding: 8,
  },
  faqBar: {
    background: theme.palette.secondary.main,
    padding: 16,
    display: 'flex',
    // borderRadius: 4,
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
    position: 'relative',
    top: -4,
    background: 'var(--gray)',
    padding: 16,
    border: '1px solid rgba(0,0,0,0.12)',
    borderRadius: 8,
    '& .answer': {
      // fontFamily: 'Raleway, sans-serif',
      fontWeight: 400,
      lineHeight: 1.4,
      // letterSpacing: 1,
      textIndent: 40,
    },
  },
}))

const FAQ = () => {
  const classes = useStyles()
  const [expanded, setExpanded] = useState<number[]>([0])

  // eslint-disable-next-line no-unused-vars
  const isExpanded: (args: number) => boolean = useCallback(
    (item) => expanded.includes(item),
    [expanded]
  )
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
      <a href="/#faq" id="faq" className="anchor">
        FAQs
      </a>
      <div className={classes.section}>
        <Typography className="sectionTitle" noWrap variant="h3" component="p">
          FAQs
        </Typography>
        <div className="divider" />
        <div className={classes.content}>
          {FAQs.map((faq, index) => (
            <FAQItem
              key={faq.question}
              index={index}
              faq={faq}
              isExpanded={isExpanded}
              toggleExpanded={toggleExpanded}
              className="fadeIn"
            />
          ))}
        </div>
      </div>
    </>
  )
}
const FAQItemOriginal = ({ isExpanded, toggleExpanded, index, faq, ...restProps }) => {
  const classes = useStyles()

  const { ref, inView } = useInView()

  const animate = useMemo(() => new GSAPAnimate(`.animate-${index}`), [])

  useEffect(() => {
    if (inView) {
      animate.fadeIn({
        opacity: 1,
      })
    } else {
      animate.fadeOut({
        opacity: 0,
      })
    }
  }, [inView])
  return (
    <div {...restProps} ref={ref} className={`${classes.faq} animate-${index}`}>
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
        {isExpanded(index) ? <RemoveCircle className="icon" /> : <AddCircle className="icon" />}
      </ButtonBase>

      <Collapse in={isExpanded(index)}>
        <div className={classes.faqContent}>
          {typeof faq.answer === 'string' && (
            <Typography className="answer" variant="h6">
              {faq.answer}
            </Typography>
          )}
          {typeof faq.answer === 'function' && <faq.answer />}
        </div>
      </Collapse>
    </div>
  )
}
const FAQItem = memo(FAQItemOriginal)

const FAQs = [
  {
    question: 'Is my phone DITO Compatible?',
    // answer: () => <Typography>hello world</Typography>,
    answer: () => <CompatibleHandsets />,
  },
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
    question: 'How do I purchase Load?',
    // answer:
    //   'To load your DITO Sim, you need to open DITO App. From here, go to LOAD then select the amount that you want to top-up. At checkout, you need to pick the payment method as mentioned above and click PAY to proceed. After a couple of seconds, you already have successfully loaded your account.',
    answer: () => (
      <>
        <Typography className="answer" variant="h6">
          To topup / load your DITO Retailer SIM, you can directly contact us through:
        </Typography>

        <Paper
          variant="outlined"
          style={{
            padding: 16,
            margin: 'auto',
            marginTop: 16,
          }}
        >
          <Typography
            style={{
              display: 'flex',
              alignItems: 'center',
            }}
            variant="h6"
          >
            <ContactPhoneIcon
              style={{
                marginRight: 8,
                color: 'var(--primary-dark)',
              }}
            />
            <Typography component="span">Contact Numbers:</Typography>
            <Typography
              component="a"
              href="tel:09913708684"
              style={{
                marginLeft: 16,
                color: 'var(--primary-dark)',
              }}
            >
              09913708684
            </Typography>
            <Typography
              style={{
                margin: '0px 16px',
              }}
            >
              |
            </Typography>

            <Typography
              style={{
                color: 'var(--primary-dark)',
              }}
              href="tel:09913920547"
              component="a"
            >
              09913920547
            </Typography>
          </Typography>
        </Paper>
      </>
    ),
    // answer: 'To topup your DITO Retailer SIM, contact '
  },
  {
    question: 'DITO Sim Expiration',
    answer:
      'The promo must be availed and activated within 30 days from the date the DITO Sim was succesfully delivered. The SIM Card shall expire if not activated within 1 year of purchase',
  },
]

export default FAQ

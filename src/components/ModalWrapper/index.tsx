import { Backdrop, Container, ContainerProps, Fade, Modal } from '@material-ui/core'

export default function ModalWrapper({
  open,
  onClose,
  containerSize,
  children,
  ...restProps
}: {
  open: boolean
  onClose: () => void
  children: JSX.Element
  containerSize?: ContainerProps['maxWidth']
}) {
  return (
    <Modal
      open={open}
      onClose={(_, reason) => {
        if (reason !== 'backdropClick') {
          onClose()
        }
      }}
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 500,
      }}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
      {...restProps}
    >
      <Fade in={open}>
        <Container
          maxWidth={containerSize}
          style={{
            padding: 0,
            maxHeight: '90vh',
            overflowY: 'auto',
          }}
        >
          {children}
        </Container>
      </Fade>
    </Modal>
  )
}

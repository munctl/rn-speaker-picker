import {ReactNode} from "react"
import {Modal, ModalProps, View} from "react-native"
import {StyledSafeAreaView} from "../../styled/StyledSafeAreaView"
import {SafeAreaProvider} from "react-native-safe-area-context";

export interface ListModalProps extends ModalProps {
  withModal?: boolean
  children: ReactNode
  outerClassName?: string
  innerClassName?: string
}

export function CountryModal({
                               children,
                               withModal = true,
                               outerClassName = "flex-1",
                               innerClassName = "flex-1 dark:bg-zinc-900 bg-zinc-100",
                               ...props
                             }: ListModalProps) {
  const content = (
    <View className={innerClassName}>{children}</View>
  )
  return withModal ? (
    <Modal {...props}>
      <SafeAreaProvider>
      <StyledSafeAreaView className={outerClassName}>
        {content}
      </StyledSafeAreaView>
      </SafeAreaProvider>
    </Modal>
  ) : (
    content
  )
}

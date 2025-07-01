import { ReactNode, useContext, useEffect } from "react"
import { Modal, ModalProps, Platform, SafeAreaView } from "react-native"
import { AnimatedModal } from "./AnimatedModal"
import { CountryModalContext } from "./CountryModalProvider"

export function CountryModal({
	children,
	withModal,
	disableNativeModal,
	...props
}: ModalProps & {
	children: ReactNode
	withModal?: boolean
	disableNativeModal?: boolean
}) {
	const { teleport } = useContext(CountryModalContext)

	const content = <SafeAreaView className="flex-1">{children}</SafeAreaView>
	useEffect(() => {
		if (disableNativeModal) {
			teleport!(<AnimatedModal {...props}>{content}</AnimatedModal>)
		}
	}, [disableNativeModal])
	if (withModal) {
		if (Platform.OS === "web") return <Modal {...props}>{content}</Modal>
		if (disableNativeModal) return null
		return <Modal {...props}>{content}</Modal>
	}
	return content
}

CountryModal.defaultProps = {
	animationType: "slide",
	animated: true,
	withModal: true,
	disableNativeModal: false,
}

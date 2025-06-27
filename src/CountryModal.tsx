import { ReactNode, useContext, useEffect } from "react"
import { ModalProps, Platform, SafeAreaView, StyleSheet } from "react-native"
import { AnimatedModal } from "./AnimatedModal"
import { CountryModalContext } from "./CountryModalProvider"
import { useTheme } from "./CountryTheme"
import { Modal } from "./Modal"

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
})

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
	const { backgroundColor } = useTheme()
	const { teleport } = useContext(CountryModalContext)
	const content = (
		<SafeAreaView style={[styles.container, { backgroundColor }]}>
			{children}
		</SafeAreaView>
	)
	useEffect(() => {
		if (disableNativeModal) {
			teleport!(<AnimatedModal {...props}>{content}</AnimatedModal>)
		}
	}, [disableNativeModal])
	if (withModal) {
		if (Platform.OS === "web") {
			return <Modal {...props}>{content}</Modal>
		}
		if (disableNativeModal) {
			return null
		}
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

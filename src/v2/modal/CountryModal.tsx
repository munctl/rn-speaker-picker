import { ReactNode, useContext, useEffect } from "react"
import { Modal, ModalProps, Platform, SafeAreaView } from "react-native"
import { AnimatedModal } from "./AnimatedModal"
import { CountryModalContext } from "./CountryModalProvider"

export interface ListModalProps extends ModalProps {
	withModal?: boolean
	children: ReactNode
	outerClassName?: string
	innerClassName?: string
}

export function CountryModal({
	children,
	withModal = true,
	outerClassName = "",
	innerClassName = "flex-1 dark:bg-zinc-900 bg-zinc-100",
	...props
}: ListModalProps) {
	const content = (
		<SafeAreaView className={innerClassName}>{children}</SafeAreaView>
	)
	return withModal ? (
		<Modal {...props} className={outerClassName}>
			{content}
		</Modal>
	) : (
		content
	)
}

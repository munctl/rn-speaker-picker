import { ReactNode, useEffect } from "react"
import { Animated, Dimensions, StyleSheet } from "react-native"

const { height } = Dimensions.get("window")

const duration = 300
const useNativeDriver = true

interface Props {
	visible?: boolean
	children: ReactNode
}

export function AnimatedModal({ children, visible = false }: Props) {
	const translateY = new Animated.Value(height)

	const showModal = Animated.timing(translateY, {
		toValue: 0,
		duration,
		useNativeDriver,
	}).start

	const hideModal = Animated.timing(translateY, {
		toValue: height,
		duration,
		useNativeDriver,
	}).start

	useEffect(() => {
		if (visible) {
			showModal()
		} else {
			hideModal()
		}
	}, [visible])

	return (
		<Animated.View
			style={{
				...StyleSheet.absoluteFillObject,
				transform: [{ translateY }],
			}}
			className="z-[99]"
		>
			{children}
		</Animated.View>
	)
}

import React, { ReactNode } from "react"
import {
	ImageSourcePropType,
	ImageStyle,
	StyleProp,
	View,
	ViewStyle,
} from "react-native"
import { StyledMaterialIcon } from "./styled/StyledMaterialIcons"

interface HeaderModalProps {
	withFilter?: boolean
	withCloseButton?: boolean
	closeButtonImage?: ImageSourcePropType
	closeButtonStyle?: StyleProp<ViewStyle>
	closeButtonImageStyle?: StyleProp<ImageStyle>
	onClose(): void
	renderFilter(props: HeaderModalProps): ReactNode
}
export function HeaderModal(props: HeaderModalProps) {
	const { withFilter, withCloseButton, onClose, renderFilter } = props
	return (
		<View className="flex-row gap-x-2 items-center mx-1 mb-2">
			{withCloseButton && (
				<StyledMaterialIcon
					name="close"
					size={18}
					onPress={onClose}
					className="rounded-md bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 p-3"
				/>
			)}
			{withFilter && renderFilter(props)}
		</View>
	)
}

HeaderModal.defaultProps = {
	withCloseButton: true,
}

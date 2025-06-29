import React, { ReactNode } from "react"
import {
	ImageSourcePropType,
	ImageStyle,
	StyleProp,
	View,
	ViewStyle,
} from "react-native"
import { StyledMaterialIcon } from "../styled/StyledMaterialIcons"

interface HeaderModalProps {
	withSearch?: boolean
	withCloseButton?: boolean
	closeButtonImage?: ImageSourcePropType
	closeButtonStyle?: StyleProp<ViewStyle>
	closeButtonImageStyle?: StyleProp<ImageStyle>
	iconClassName?: string
	onClose(): void
	renderSearch(): ReactNode
}

/***
 * The header of the speaker picker modal, containing the search bar and close button.
 * @param {Object} props
 * @param {boolean} props.withSearch - Whether to include a search bar in the header.
 * @param {boolean} props.withCloseButton - Whether to include a close button in the header.
 * @param {function} props.onClose - Callback function to handle closing the modal.
 * @param {function} props.renderSearch - Function to render the search bar.
 * @param {string} props.iconClassName - Additional class names for the close button icon.
 * @return {ReactNode} The rendered ModalHeader component.
 ***/
export function ModalHeader({
	withSearch,
	withCloseButton,
	onClose,
	renderSearch,
	iconClassName,
	...props
}: HeaderModalProps): ReactNode {
	return (
		<View className="flex-row gap-x-2 items-center mx-1 mb-2" {...props}>
			{withCloseButton && (
				<StyledMaterialIcon
					name="close"
					size={18}
					onPress={onClose}
					className={`rounded-md bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 p-3 ${iconClassName}`}
				/>
			)}
			{withSearch && renderSearch()}
		</View>
	)
}

ModalHeader.defaultProps = {
	withCloseButton: true,
}

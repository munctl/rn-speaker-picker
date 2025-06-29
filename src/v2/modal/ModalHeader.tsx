import React, { ReactNode } from "react"
import { View } from "react-native"
import { StyledMaterialIcon } from "../../styled/StyledMaterialIcons"
import { GestureHandlerRootView, Pressable } from "react-native-gesture-handler"
import { StyledPressable } from "../../styled/StyledPressable"

interface HeaderModalProps {
	withSearch?: boolean
	withCloseButton?: boolean
	iconClassName?: string
	wrapperClassName?: string
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
 * @param {string} props.wrapperClassName - Class names for the wrapper of the close button.
 * @return {ReactNode} The rendered ModalHeader component.
 ***/
export function ModalHeader({
	withSearch = true,
	withCloseButton = true,
	onClose,
	renderSearch,
	iconClassName = "text-zinc-600 dark:text-zinc-400",
	wrapperClassName = "rounded-md bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 active:bg-zinc-200 dark:active:bg-zinc-700 size-12 flex items-center justify-center",
	...props
}: HeaderModalProps): ReactNode {
	return (
		<View
			className={`flex-row gap-x-2 items-center mx-1 mb-2 ${(withCloseButton || withSearch) && "min-h-12"}`}
			{...props}
		>
			{withCloseButton && (
				<View>
					<GestureHandlerRootView>
						<StyledPressable onPress={onClose} className={wrapperClassName}>
							<StyledMaterialIcon
								name="close"
								size={18}
								className={iconClassName}
							/>
						</StyledPressable>
					</GestureHandlerRootView>
				</View>
			)}
			{withSearch && renderSearch()}
		</View>
	)
}

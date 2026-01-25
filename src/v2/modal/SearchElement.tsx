import { TextInput, TextInputProps } from "react-native"

export const SearchElement = (props: TextInputProps) => {
	const inputTestID = props.testID ?? "text-input-country-filter"
	const inputNativeID = props.nativeID ?? inputTestID
	const accessibilityLabel = props.accessibilityLabel ?? inputTestID

	return (
		<TextInput
			testID={inputTestID}
			nativeID={inputNativeID}
			accessibilityLabel={accessibilityLabel}
			autoCorrect={false}
			autoFocus={props.autoFocus ?? false}
			className="h-12 rounded-md bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-100 px-2 flex-grow"
			placeholder={props.placeholder ?? "Enter a name..."}
			{...props}
		/>
	)
}

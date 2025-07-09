import { TextInput, TextInputProps } from "react-native"

export const SearchElement = (props: TextInputProps) => {
	return (
		<TextInput
			testID="text-input-country-filter"
			autoCorrect={false}
			autoFocus={props.autoFocus ?? false}
			className="h-12 rounded-md bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-100 px-2 flex-grow"
			placeholder="Enter a name..."
			{...props}
		/>
	)
}

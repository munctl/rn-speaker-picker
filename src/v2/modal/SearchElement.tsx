import { TextInput, TextInputProps } from "react-native"

export type CountryFilterProps = TextInputProps

export const SearchElement = (props: CountryFilterProps) => {
	return (
		<TextInput
			testID="text-input-country-filter"
			autoCorrect={false}
			className="h-12 rounded-md bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-100 px-2 flex-grow"
			placeholder="Enter a name..."
			{...props}
		/>
	)
}

SearchElement.defaultProps = {
	autoFocus: false,
	placeholder: "Enter a name...",
}

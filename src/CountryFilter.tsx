import { TextInput, TextInputProps } from "react-native"
import { useTheme } from "./CountryTheme"

export type CountryFilterProps = TextInputProps

export const CountryFilter = (props: CountryFilterProps) => {
	const { filterPlaceholderTextColor } = useTheme()
	return (
		<TextInput
			testID="text-input-country-filter"
			autoCorrect={false}
			placeholderTextColor={filterPlaceholderTextColor}
			className="h-12 rounded-md bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-100 px-2 flex-grow"
			placeholder="Enter a name..."
			{...props}
		/>
	)
}

CountryFilter.defaultProps = {
	autoFocus: false,
	placeholder: "Enter a name...",
}

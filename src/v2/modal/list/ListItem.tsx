import React, { ReactNode } from "react"
import { Text, TouchableOpacity, View } from "react-native"
import { Flag } from "../../../Flag"
import { Country } from "../../../types"
import getSuffix from "../../../utils/getSuffix"

interface ListItemProps {
	country: Country
	withFlag: boolean
	withCallingCode: boolean
	withCurrency: boolean
	onSelect(country: Country): void
}

/***
 * ListItem component to display a country with optional flag and suffix information.
 * @param {Object} props
 * @param {Country} props.country - The country object containing details like name, calling code, and currency.
 * @param {boolean} props.withFlag - Whether to display the country's flag.
 * @param {boolean} props.withCallingCode - Whether to display the calling code.
 * @param {boolean} props.withCurrency - Whether to display the currency information.
 * @param {function} props.onSelect - Callback function to handle country selection.
 * @returns {ReactNode} The rendered ListItem component.
 ***/
export default function ListItem({
	country,
	withFlag,
	onSelect,
	withCallingCode,
	withCurrency,
	...props
}: ListItemProps): ReactNode {
	const countryName =
		typeof country.name === "string" ? country.name : country.name.common

	const suffix = getSuffix({
		...{ withCurrency, withCallingCode },
		callingCode: country.callingCode.join("/"),
		currency: country.currency.join("/"),
	})

	return (
		<TouchableOpacity
			className="bg-zinc-100 dark:bg-zinc-800 px-1 py-4 mb-2 rounded-md"
			testID={`country-selector-${country.cca2}`}
			onPress={() => onSelect(country)}
			{...props}
		>
			<View className="flex flex-row items-center gap-2">
				{withFlag && (
					<Flag countryCode={country.cca2} flagSize={16} className="h-4" />
				)}
				<View>
					<Text
						numberOfLines={2}
						ellipsizeMode="tail"
						className="text-zinc-800 dark:text-zinc-100"
					>
						{countryName} {suffix}
					</Text>
				</View>
			</View>
		</TouchableOpacity>
	)
}

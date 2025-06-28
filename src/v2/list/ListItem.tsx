import React from "react"
import { Text, TouchableOpacity, View } from "react-native"
import { Flag } from "../../Flag"
import { Country } from "../../types"
import getSuffix from "../../utils/getSuffix"

interface ListItemProps {
	country: Country
	withFlag: boolean
	withEmoji: boolean
	withCallingCode: boolean
	withCurrency: boolean
	onSelect(country: Country): void
}

export default function ListItem(props: ListItemProps) {
	const { country, withFlag, withEmoji, onSelect } = props
	const countryName =
		typeof country.name === "string" ? country.name : country.name.common

	const suffix = getSuffix({
		...props,
		callingCode: country.callingCode.join("/"),
		currency: country.currency.join("/"),
	})

	return (
		<TouchableOpacity
			className="bg-zinc-200 dark:bg-zinc-800 px-2 my-1 rounded-md"
			key={country.cca2}
			testID={`country-selector-${country.cca2}`}
			onPress={() => onSelect(country)}
		>
			<View className="py-4 flex flex-row items-center gap-2">
				{withFlag && (
					<Flag {...{ withEmoji, countryCode: country.cca2, flagSize: 30 }} />
				)}
				<View>
					<Text numberOfLines={2} ellipsizeMode="tail" className="">
						{countryName} {suffix}
					</Text>
				</View>
			</View>
		</TouchableOpacity>
	)
}

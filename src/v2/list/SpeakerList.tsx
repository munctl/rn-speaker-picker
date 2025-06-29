import { FlatListProps, View } from "react-native"
import { Country } from "../../types"
import { AlphabetScrollList } from "./AlphabetScrollList"
import React from "react"
import ListItem from "./ListItem"
import ListHeader from "./ListHeader"
import { useContext } from "../../CountryContext"
import * as assert from "node:assert"

interface SpeakerListProps {
	data: Country[]
	searchTerm?: string
	filterFocus?: boolean
	withFlag: boolean
	withEmoji: boolean
	withAlphaFilter: boolean
	withCallingCode: boolean
	withCurrency: boolean
	flatListProps?: FlatListProps<Country>
	onSelect(country: Country): void
}

export default function SpeakerList({
	data,
	searchTerm,
	withAlphaFilter,
	withFlag,
	withEmoji,
	withCurrency,
	withCallingCode,
	onSelect,
}: SpeakerListProps) {
	const { search } = useContext()
	return (
		<View className="flex-1 flex-row content-between mx-1">
			<View className="grow">
				<AlphabetScrollList<Country>
					{...{ withAlphaFilter }}
					getItemKey={(item) => item.name.toString()}
					renderSectionHeader={(item) => <ListHeader {...{ item }} />}
					renderItem={(item) => (
						<ListItem
							{...{
								onSelect,
								withCallingCode,
								withCurrency,
								withEmoji,
								withFlag,
							}}
							country={item}
						/>
					)}
					sections={(() => {
						const groups: Record<string, Country[]> = {}

						search(searchTerm, data).forEach((d) => {
							const name = d.name.toString()
							if (!name) return

							const firstChar = name[0]
							if (!groups[firstChar]) groups[firstChar] = []
							groups[firstChar].push(d)
						})
						// Sort the section titles by Unicode order
						return Object.keys(groups)
							.sort((a, b) => a.localeCompare(b))
							.map((ch) => ({ title: ch, data: groups[ch] }))
					})()}
				/>
			</View>
		</View>
	)
}

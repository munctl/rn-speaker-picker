import { FlatListProps, Text, TouchableOpacity, View } from "react-native"
import { Country } from "../../types"
import { AlphabetScrollList } from "./AlphabetScrollList"

interface SpeakerListProps {
	data: Country[]
	filter?: string
	filterFocus?: boolean
	withFlag: boolean
	withEmoji: boolean
	withAlphaFilter: boolean
	withCallingCode: boolean
	withCurrency: boolean
	flatListProps?: FlatListProps<Country>
	onSelect(country: Country): void
}

export default function SpeakerList(props: SpeakerListProps) {
	const {
		data,
		withAlphaFilter,
		withEmoji,
		withFlag,
		withCallingCode,
		withCurrency,
		onSelect,
		filter,
		flatListProps,
		filterFocus,
	} = props

	return (
		<View className="flex-1 flex-row content-between mx-1">
			<View className="grow">
				<AlphabetScrollList<Country>
					{...{ withAlphaFilter }}
					getItemKey={(item) => item.name.toString()}
					renderSectionHeader={(item) => (
						<Text className="mb-2 p-1 bg-zinc-200 dark:bg-zinc-700 text-zinc-700 dark:text-zinc-200 rounded-md font-bold">
							{item}
						</Text>
					)}
					renderItem={(item) => (
						<TouchableOpacity onPress={() => onSelect(item)}>
							<Text className="py-2 px-1 mb-2 bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-100 rounded-md">
								{item.name.toString()}
							</Text>
						</TouchableOpacity>
					)}
					sections={(() => {
						const groups: Record<string, Country[]> = {}
						data.forEach((d) => {
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

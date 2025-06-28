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
			<View className="w-screen">
				<AlphabetScrollList
					getItemKey={(item: string) => item}
					renderSectionHeader={(item) => (
						<Text className="mb-2 p-1 bg-zinc-200 dark:bg-zinc-700 text-zinc-700 dark:text-zinc-200 rounded-md font-bold">
							{item}
						</Text>
					)}
					renderItem={(item) => (
						<TouchableOpacity>
							<Text className="py-2 px-1 mb-2 bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-100 rounded-md">
								{item}
							</Text>
						</TouchableOpacity>
					)}
					sections={(() => {
						const groups: Record<string, string[]> = {}
						data.forEach((d) => {
							const name = d.name.toString()
							if (!name) return
							// Use the first Unicode character
							const firstChar = name[0]
							if (!groups[firstChar]) groups[firstChar] = []
							groups[firstChar].push(name)
						})
						// Sort the section titles by Unicode order
						return Object.keys(groups)
							.sort((a, b) => a.localeCompare(b))
							.map((char) => ({ title: char, data: groups[char] }))
					})()}
				/>
			</View>
		</View>
	)
}

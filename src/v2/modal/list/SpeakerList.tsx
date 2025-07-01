import { View } from "react-native"
import { useContext } from "../../../CountryContext"
import { Country } from "../../../types"
import {
	AlphabetScrollList,
	AlphabetScrollListProps,
} from "./AlphabetScrollList"
import ListHeading from "./ListHeading"
import ListItem from "./ListItem"

export interface SpeakerListProps {
	data: Country[]
	searchTerm?: string
	filterFocus?: boolean
	withFlag: boolean
	withAlphaFilter: boolean
	withCallingCode: boolean
	withCurrency: boolean
	onSelect(country: Country): void

	wrapperClassName?: string
	speakerList?: AlphabetScrollListProps<Country>

	rest?: any
}

export function SpeakerList({
	data,
	searchTerm,
	withAlphaFilter,
	withFlag,
	withCurrency,
	withCallingCode,
	onSelect,
	speakerList,
	wrapperClassName = "flex-1 flex-row content-between mx-1",
	...rest
}: SpeakerListProps) {
	const { search } = useContext()
	return (
		<View {...rest} className={wrapperClassName}>
			<View className="grow">
				<AlphabetScrollList<Country>
					getItemKey={(item) => item.name.toString()}
					renderSectionHeader={(item) => <ListHeading {...{ item }} />}
					renderItem={(item) => (
						<ListItem
							{...{
								onSelect,
								withCallingCode,
								withCurrency,
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
					{...{ withAlphaFilter, ...speakerList }}
				/>
			</View>
		</View>
	)
}

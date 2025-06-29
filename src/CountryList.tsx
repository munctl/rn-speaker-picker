import { FlashList } from "@shopify/flash-list"
import React, { memo, useEffect, useRef, useState } from "react"
import {
	Dimensions,
	FlatListProps,
	ScrollView,
	Text,
	TouchableOpacity,
	View,
} from "react-native"
import { useContext } from "./CountryContext"
import { CountryText } from "./CountryText"
import { useTheme } from "./CountryTheme"
import { Flag } from "./Flag"
import { Country } from "./types"
import { AlphabetList } from "./v2/modal/list/AlphabetList"
import SpeakerList from "./v2/modal/list/SpeakerList"

interface LetterProps {
	letter: string
	scrollTo(letter: string): void
}
const Letter = ({ letter, scrollTo }: LetterProps) => {
	const { activeOpacity } = useTheme()

	return (
		<TouchableOpacity
			testID={`letter-${letter}`}
			key={letter}
			onPress={() => scrollTo(letter)}
			{...{ activeOpacity }}
		>
			<View className="justify-center items-center">
				<Text className="text-center">{letter}</Text>
			</View>
		</TouchableOpacity>
	)
}

interface CountryItemProps {
	country: Country
	withFlag?: boolean
	withEmoji?: boolean
	withCallingCode?: boolean
	withCurrency?: boolean
	onSelect(country: Country): void
}
const CountryItem = (props: CountryItemProps) => {
	const { activeOpacity, flagSize } = useTheme()
	const {
		country,
		onSelect,
		withFlag,
		withEmoji,
		withCallingCode,
		withCurrency,
	} = props
	const extraContent: string[] = []
	if (
		withCallingCode &&
		country.callingCode &&
		country.callingCode.length > 0
	) {
		extraContent.push(`+${country.callingCode.join("|")}`)
	}
	if (withCurrency && country.currency && country.currency.length > 0) {
		extraContent.push(country.currency.join("|"))
	}
	const countryName =
		typeof country.name === "string" ? country.name : country.name.common

	return (
		<TouchableOpacity
			className="bg-zinc-200 dark:bg-zinc-800 px-2 my-1 rounded-md"
			key={country.cca2}
			testID={`country-selector-${country.cca2}`}
			onPress={() => onSelect(country)}
			{...{ activeOpacity }}
		>
			<View className="py-4 flex flex-row items-center gap-2">
				{withFlag && (
					<Flag
						{...{ withEmoji, countryCode: country.cca2, flagSize: flagSize! }}
					/>
				)}
				<View>
					<CountryText numberOfLines={2} ellipsizeMode="tail">
						{countryName}
						{extraContent.length > 0 && ` (${extraContent.join(", ")})`}
					</CountryText>
				</View>
			</View>
		</TouchableOpacity>
	)
}
CountryItem.defaultProps = {
	withFlag: true,
	withCallingCode: false,
}

const MemoCountryItem = memo<CountryItemProps>(CountryItem)

interface CountryListProps {
	data: Country[]
	filter?: string
	filterFocus?: boolean
	withFlag?: boolean
	withEmoji?: boolean
	withAlphaFilter?: boolean
	withCallingCode?: boolean
	withCurrency?: boolean
	flatListProps?: FlatListProps<Country>
	onSelect(country: Country): void
}

const ItemSeparatorComponent = () => {
	return (
		<View className="border-b border-b-zinc-800/20 dark:border-b-zinc-100/20 w-full" />
	)
}

const { height } = Dimensions.get("window")

export function CountryList(props: CountryListProps) {
	return null

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

	const flatListRef = useRef<FlashList<Country>>(null)
	const [letter, setLetter] = useState<string>("")
	const { itemHeight } = useTheme()
	const indexLetter = data
		.map((country: Country) => (country.name as string).slice(0, 1))
		.join("")

	const scrollTo = (letter: string, animated: boolean = true) => {
		const index = indexLetter.indexOf(letter)
		setLetter(letter)
		if (flatListRef.current) {
			flatListRef.current.scrollToIndex({ animated, index })
		}
	}
	const onScrollToIndexFailed = () => {
		if (flatListRef.current) {
			flatListRef.current.scrollToEnd()
			scrollTo(letter)
		}
	}
	const { search, getLetters } = useContext()
	const letters = getLetters(data)
	useEffect(() => {
		if (data && data.length > 0 && filterFocus && !filter) {
			scrollTo(letters[0], false)
		}
	}, [filterFocus])

	const initialNumToRender = Math.round(height / (itemHeight || 1))
	return (
		<View className="flex-1 flex-row content-between mx-1">
			<FlashList
				ref={flatListRef}
				testID="list-countries"
				keyboardShouldPersistTaps="handled"
				automaticallyAdjustContentInsets={false}
				scrollEventThrottle={1}
				// @ts-ignore
				renderItem={(item) => (
					<MemoCountryItem
						country={item.item}
						withEmoji={withEmoji}
						withFlag={withFlag}
						onSelect={onSelect}
						withCurrency={withCurrency}
						withCallingCode={withCallingCode}
					/>
				)}
				{...{
					data: search(filter, data),
					keyExtractor: (item: Country) => item?.cca2,
					onScrollToIndexFailed,
					ItemSeparatorComponent,
					initialNumToRender,
				}}
				{...flatListProps}
			/>
			{withAlphaFilter && (
				<ScrollView
					scrollEnabled={false}
					contentContainerClassName="flex-1 bg-transparent items-center justify-between"
					className="flex-grow-0 pl-4 pr-3"
					keyboardShouldPersistTaps="always"
				>
					{letters.map((letter) => (
						<Letter key={letter} {...{ letter, scrollTo }} />
					))}
				</ScrollView>
			)}
		</View>
	)
}

CountryList.defaultProps = {
	filterFocus: undefined,
}

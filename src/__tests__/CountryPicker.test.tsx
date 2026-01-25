import React from "react"
import { fireEvent, render, waitFor } from "@testing-library/react-native"
import { Text, TextInput, TouchableOpacity, View } from "react-native"
import { CountryContext, CountryContextParam } from "../CountryContext"
import { CountryPicker, CountryPickerProps } from "../CountryPicker"
import { Country } from "../types"

jest.mock("../v2/modal/CountryModal", () => {
	const { View } = require("react-native")
	return {
		CountryModal: ({ children, visible }: any) => (
			<View accessibilityLabel={visible ? "modal-open" : "modal-closed"}>
				{children}
			</View>
		),
	}
})

jest.mock("../v2/modal/ModalHeader", () => {
	const { View, TouchableOpacity, Text } = require("react-native")
	return {
		ModalHeader: ({ renderSearch, onClose, withCloseButton }: any) => (
			<View>
				{renderSearch?.()}
				{withCloseButton && (
					<TouchableOpacity testID="close-button" onPress={onClose}>
						<Text>Close</Text>
					</TouchableOpacity>
				)}
			</View>
		),
	}
})

jest.mock("../v2/modal/SearchElement", () => {
	const { TextInput } = require("react-native")
	return {
		SearchElement: ({ value, onChangeText, placeholder }: any) => (
			<TextInput
				testID="search-input"
				value={value}
				placeholder={placeholder}
				onChangeText={onChangeText}
			/>
		),
	}
})

jest.mock("../v2/modal/list/SpeakerList", () => {
	const { View, Text, TouchableOpacity } = require("react-native")
	return {
		SpeakerList: ({ data, onSelect, searchTerm, withAlphaFilter }: any) => (
			<View testID="speaker-list">
				<Text testID="search-term">{searchTerm}</Text>
				<Text testID="alpha-filter">{withAlphaFilter ? "alpha-on" : "alpha-off"}</Text>
				{data.map((country: any) => (
					<TouchableOpacity
						key={country.cca2}
						testID={`item-${country.cca2}`}
						onPress={() => onSelect?.(country)}
					>
						<Text>{country.name}</Text>
					</TouchableOpacity>
				))}
			</View>
		),
	}
})

const mockCountries: Country[] = [
	{
		cca2: "US",
		name: "United States",
		callingCode: ["1"],
		currency: ["USD"],
		flag: "🇺🇸",
		region: "Americas",
		subregion: "North America",
	},
	{
		cca2: "BR",
		name: "Brazil",
		callingCode: ["55"],
		currency: ["BRL"],
		flag: "🇧🇷",
		region: "Americas",
		subregion: "South America",
	},
]

const createContextValue = (): CountryContextParam & {
	getCountriesAsync: jest.Mock
} => ({
	translation: "common",
	getCountryNameAsync: jest.fn(),
	getImageFlagAsync: jest.fn(),
	getCountriesAsync: jest.fn().mockResolvedValue(mockCountries),
	getCountryCallingCodeAsync: jest.fn(),
	getCountryCurrencyAsync: jest.fn(),
	getLetters: jest.fn(),
	search: jest.fn(),
	getCountryInfoAsync: jest
		.fn()
		.mockResolvedValue({ countryName: "United States", currency: "USD", callingCode: "1" }),
})

const renderPicker = (
	props: Partial<CountryPickerProps> = {},
	contextValue: CountryContextParam & { getCountriesAsync: jest.Mock } = createContextValue(),
) => {
	const { trigger, ...rest } = props
	return render(
		<CountryContext.Provider value={contextValue}>
			<CountryPicker
				{...rest}
				trigger={{ id: "country-picker-trigger", ...(trigger || {}) }}
			/>
		</CountryContext.Provider>,
	)
}

describe("CountryPicker", () => {
	it("shows placeholder text when no country is selected", async () => {
		const context = createContextValue()
		const { getByText } = renderPicker({}, context)
		await waitFor(() => expect(context.getCountriesAsync).toHaveBeenCalled())
		expect(getByText("Tap to select a country")).toBeTruthy()
	})

	it("opens the modal when trigger is pressed and calls onOpen", async () => {
		const onOpen = jest.fn()
		const context = createContextValue()
		const { getByTestId, getByLabelText } = renderPicker({ onOpen }, context)

		await waitFor(() => expect(context.getCountriesAsync).toHaveBeenCalled())
		fireEvent.press(getByTestId("country-picker-trigger"))

		await waitFor(() => {
			expect(onOpen).toHaveBeenCalled()
			expect(getByLabelText("modal-open")).toBeTruthy()
		})
	})

	it("filters list via search and closes after selection", async () => {
		const onSelect = jest.fn()
		const context = createContextValue()
		const { getByTestId, findByText, getByLabelText } = renderPicker(
			{ onSelect, withSearch: true, list: { withAlphaFilter: true }, modal: { withModal: false, children: undefined } },
			context,
		)

		await waitFor(() => expect(context.getCountriesAsync).toHaveBeenCalled())
		await findByText("United States")

		fireEvent.changeText(getByTestId("search-input"), "bra")

		await waitFor(() => {
			expect(getByTestId("search-term").props.children).toBe("bra")
			expect(getByTestId("alpha-filter").props.children).toBe("alpha-off")
		})

		fireEvent.press(getByTestId("item-US"))

		expect(onSelect).toHaveBeenCalledWith(
			expect.objectContaining({ cca2: "US", name: "United States" }),
		)

		await waitFor(() => expect(getByLabelText("modal-closed")).toBeTruthy())
	})
})

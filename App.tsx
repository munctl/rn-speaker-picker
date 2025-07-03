import React, { useEffect, useState } from "react"
import {
	View,
	ScrollView,
	Switch,
	Text,
	TouchableOpacity,
	SafeAreaView,
	StatusBar,
} from "react-native"
import CountryPicker, {
	type Country,
	type CountryCode,
	CountryModalProvider,
} from "./src"
import "./src/assets/global.css"
import { colorScheme } from "nativewind"
import { TriggerProps } from "./src/v2/types/Props"
import {
	SafeAreaProvider,
} from "react-native-safe-area-context"

interface OptionProps {
	title: string
	value: boolean
	onValueChange(value: boolean): void
}
const Option = ({ value, onValueChange, title }: OptionProps) => (
	<View className="flex-row gap-x-2 items-center">
		<Switch {...{ value, onValueChange }} />
		<Text className="dark:text-zinc-100 text-zinc-800 text-lg">{title}</Text>
	</View>
)

/***
 Demo
 ***/
export default function App() {
	const [triggerProps, setTriggerProps] = useState<
		Required<
			Pick<
				TriggerProps,
				"withFlag" | "withCountryName" | "withCallingCode" | "withCurrency"
			>
		>
	>({
		withFlag: true,
		withCountryName: true,
		withCallingCode: false,
		withCurrency: false,
	})
	const [countryCode, setCountryCode] = useState<CountryCode>()
	const [country, setCountry] = useState<Country>()

	const [withFlag, setWithFlag] = useState(true)
	const [withSearch, setWithSearch] = useState(true)
	const [withCloseButton, setWithCloseButton] = useState(true)
	const [withAlphaFilter, setWithAlphaFilter] = useState(true)
	const [withCallingCode, setWithCallingCode] = useState(false)
	const [withCurrency, setWithCurrency] = useState(false)
	const [withTrigger, setWithTrigger] = useState(true)
	const [visible, setVisible] = useState(false)
	const [dark, setDark] = useState(false)
	const [disableNativeModal, setDisableNativeModal] = useState(false)
	const onSelect = (country: Country) => {
		setCountryCode(country.cca2)
		setCountry(country)
	}

	useEffect(() => {
		colorScheme.set(dark ? "dark" : "light")
	}, [dark])

	return (
		<SafeAreaProvider className="bg-zinc-100 dark:bg-zinc-900">
			<SafeAreaView>
				<CountryModalProvider>
					<StatusBar />
					<ScrollView className="px-2">
						<View>
							<Text className="mb-4 text-2xl font-semibold text-black dark:text-white">
								Speaker Picker Demo
							</Text>
							<View className="flex gap-y-2 mb-4">
								<Text className="text-lg font-medium text-zinc-800 dark:text-zinc-100">
									Trigger Settings
								</Text>
								<Option
									title="Flag"
									value={triggerProps.withFlag}
									onValueChange={(v) => {
										setTriggerProps((prevState) => ({
											...prevState,
											withFlag: v,
										}))
									}}
								/>
								<Option
									title="Country Name"
									value={triggerProps.withCountryName}
									onValueChange={(v) => {
										setTriggerProps((prevState) => ({
											...prevState,
											withCountryName: v,
										}))
									}}
								/>
								<Option
									title="Currency"
									value={triggerProps.withCurrency}
									onValueChange={(v) => {
										setTriggerProps((prevState) => ({
											...prevState,
											withCurrency: v,
										}))
									}}
								/>
								<Option
									title="Calling Code"
									value={triggerProps.withCallingCode}
									onValueChange={(v) => {
										setTriggerProps((prevState) => ({
											...prevState,
											withCallingCode: v,
										}))
									}}
								/>
							</View>
							<View className="flex gap-y-2 mb-4">
								<Text className="text-lg font-medium text-zinc-800 dark:text-zinc-100">
									Modal Settings
								</Text>
								<Option
									title="Flag"
									value={withFlag}
									onValueChange={setWithFlag}
								/>
								<Option
									title="Search Bar"
									value={withSearch}
									onValueChange={setWithSearch}
								/>
								<Option
									title="Close Button"
									value={withCloseButton}
									onValueChange={setWithCloseButton}
								/>
								<Option
									title="Calling Code"
									value={withCallingCode}
									onValueChange={setWithCallingCode}
								/>
								<Option
									title="Currency"
									value={withCurrency}
									onValueChange={setWithCurrency}
								/>
								<Option
									title="Alpha Filter Code"
									value={withAlphaFilter}
									onValueChange={setWithAlphaFilter}
								/>
								<Option
									title="Native Modal"
									value={!disableNativeModal}
									onValueChange={(e) => setDisableNativeModal(!e)}
								/>
								<Option
									title="Modal"
									value={withTrigger}
									onValueChange={setWithTrigger}
								/>
							</View>
							<View className="flex gap-y-2 mb-4">
								<Text className="text-lg font-medium text-zinc-800 dark:text-zinc-100">
									Theme Settings
								</Text>
								<Option
									title="Dark Theme"
									value={dark}
									onValueChange={setDark}
								/>
							</View>
							<CountryPicker
								trigger={{
									wrapperClassName: "mx-auto",
									id: "country-picker-trigger",
									...triggerProps,
								}}
								{...{
									countryCode,
									withSearch,
									excludeCountries: ["FR"],
									withFlag,
									withAlphaFilter,
									withCallingCode,
									withCurrency,
									withTrigger,
									withCloseButton,
									onSelect,
									disableNativeModal,
									preferredCountries: ["US", "GB"],
									modalProps: { visible },
									onClose: () => setVisible(false),
									onOpen: () => setVisible(true),
								}}
							/>
							<Text className="text-zinc-800 dark:text-zinc-100 text-center">
								Press on the flag to open the modal.
							</Text>
							<Text className="text-zinc-500 dark:text-zinc-400 my-2 text-center">
								or
							</Text>
							<TouchableOpacity
								className="bg-zinc-200 p-2 rounded-md"
								onPress={() => setVisible((prev) => !prev)}
							>
								<Text className="text-xl text-center">
									Tap to open the modal externally via useState.
								</Text>
							</TouchableOpacity>
							{country !== null && (
								<Text className="bg-zinc-200 dark:bg-zinc-800 border border-zinc-500 text-zinc-600 dark:text-zinc-300 mt-4 p-2 mb-8">
									{JSON.stringify(country, null, 2) ??
										"Select a country to show JSON data."}
								</Text>
							)}
						</View>
					</ScrollView>
				</CountryModalProvider>
			</SafeAreaView>
		</SafeAreaProvider>
	)
}

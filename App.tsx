import React, { useEffect, useState } from "react"
import { Button, ScrollView, Switch, Text } from "react-native"
import CountryPicker, {
	type Country,
	type CountryCode,
	CountryModalProvider,
	DARK_THEME,
} from "./src"
import { Row } from "./src/Row"
import "./src/assets/global.css"
import { useColorScheme } from "nativewind"

interface OptionProps {
	title: string
	value: boolean
	onValueChange(value: boolean): void
}
const Option = ({ value, onValueChange, title }: OptionProps) => (
	<Row fullWidth>
		<Text className="dark:text-zinc-100 text-zinc-800">{title}</Text>
		<Switch {...{ value, onValueChange }} />
	</Row>
)

export default function App() {
	const [countryCode, setCountryCode] = useState<CountryCode>("US")
	const [country, setCountry] = useState<Country>()
	const [withCountryNameButton, setWithCountryNameButton] =
		useState<boolean>(true)
	const [withCurrencyButton, setWithCurrencyButton] = useState<boolean>(false)
	const [withFlagButton, setWithFlagButton] = useState<boolean>(true)
	const [withCallingCodeButton, setWithCallingCodeButton] =
		useState<boolean>(false)
	const [withFlag, setWithFlag] = useState<boolean>(true)
	const [withEmoji, setWithEmoji] = useState<boolean>(false)
	const [withFilter, setWithFilter] = useState<boolean>(true)
	const [withCloseButton, setWithCloseButton] = useState<boolean>(true)
	const [withAlphaFilter, setWithAlphaFilter] = useState<boolean>(false)
	const [withCallingCode, setWithCallingCode] = useState<boolean>(false)
	const [withCurrency, setWithCurrency] = useState<boolean>(false)
	const [withModal, setWithModal] = useState<boolean>(true)
	const [visible, setVisible] = useState<boolean>(false)
	const [dark, setDark] = useState<boolean>(false)
	const [allowFontScaling, setFontScaling] = useState<boolean>(true)
	const [disableNativeModal, setDisableNativeModal] = useState<boolean>(false)
	const onSelect = (country: Country) => {
		setCountryCode(country.cca2)
		setCountry(country)
	}
	const switchVisible = () => setVisible(!visible)

	const { setColorScheme } = useColorScheme()
	useEffect(() => {
		setColorScheme(dark ? "dark" : "light")
	}, [dark])

	return (
		<CountryModalProvider>
			<ScrollView
				className="py-24 bg-zinc-100 dark:bg-zinc-900"
				contentContainerClassName="justify-center items-center"
			>
				<Text className="mb-4 text-2xl font-semibold text-black dark:text-white">
					Speaker Picker Demo
				</Text>
				<Option
					title="Country Name on Button"
					value={withCountryNameButton}
					onValueChange={setWithCountryNameButton}
				/>
				<Option
					title="Currency on Button"
					value={withCurrencyButton}
					onValueChange={setWithCurrencyButton}
				/>
				<Option
					title="Calling Code on Button"
					value={withCallingCodeButton}
					onValueChange={setWithCallingCodeButton}
				/>
				<Option title="Flag" value={withFlag} onValueChange={setWithFlag} />
				<Option
					title="Font Scaling"
					value={allowFontScaling}
					onValueChange={setFontScaling}
				/>
				<Option title="Emoji" value={withEmoji} onValueChange={setWithEmoji} />
				<Option
					title="Filter"
					value={withFilter}
					onValueChange={setWithFilter}
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
				<Option title="Modal" value={withModal} onValueChange={setWithModal} />
				<Option title="Dark Theme" value={dark} onValueChange={setDark} />
				<Option
					title="Flag Button"
					value={withFlagButton}
					onValueChange={setWithFlagButton}
				/>
				<CountryPicker
					theme={dark ? DARK_THEME : {}}
					{...{
						allowFontScaling,
						countryCode,
						withFilter,
						excludeCountries: ["FR"],
						withFlag,
						withCurrencyButton,
						withCallingCodeButton,
						withCountryNameButton,
						withAlphaFilter,
						withCallingCode,
						withCurrency,
						withEmoji,
						withModal,
						withFlagButton,
						withCloseButton,
						onSelect,
						disableNativeModal,
						preferredCountries: ["US", "GB"],
						modalProps: { visible },
						onClose: () => setVisible(false),
						onOpen: () => setVisible(true),
					}}
				/>
				<Text className="text-zinc-800 dark:text-zinc-100">
					Press on the flag to open the modal.
				</Text>
				<Button
					title={"Open the modal from outside using visible props"}
					onPress={switchVisible}
				/>
				{country !== null && (
					<Text className="bg-zinc-200 dark:bg-zinc-800 border border-zinc-500 text-zinc-600 dark:text-zinc-300 w-96 mt-4 p-2 mb-8">
						{JSON.stringify(country, null, 0) ??
							"Select a country to show JSON data."}
					</Text>
				)}
			</ScrollView>
		</CountryModalProvider>
	)
}

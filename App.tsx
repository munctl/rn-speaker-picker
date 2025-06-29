import { useEffect, useState } from "react"
import { Button, ScrollView, Switch, Text } from "react-native"
import CountryPicker, {
	type Country,
	type CountryCode,
	CountryModalProvider,
	DARK_THEME,
} from "./src"
import { Row } from "./src/Row"
import "./src/assets/global.css"
import { colorScheme } from "nativewind"

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
	const [withCountryNameButton, setWithCountryNameButton] = useState(true)
	const [withCurrencyButton, setWithCurrencyButton] = useState(false)
	const [withFlagButton, setWithFlagButton] = useState(true)
	const [withCallingCodeButton, setWithCallingCodeButton] = useState(false)
	const [withFlag, setWithFlag] = useState(true)
	const [withEmoji, setWithEmoji] = useState(false)
	const [withSearch, setWithSearch] = useState(true)
	const [withCloseButton, setWithCloseButton] = useState(true)
	const [withAlphaFilter, setWithAlphaFilter] = useState(false)
	const [withCallingCode, setWithCallingCode] = useState(false)
	const [withCurrency, setWithCurrency] = useState(false)
	const [withModal, setWithModal] = useState(true)
	const [visible, setVisible] = useState(false)
	const [dark, setDark] = useState(false)
	const [disableNativeModal, setDisableNativeModal] = useState(false)
	const onSelect = (country: Country) => {
		setCountryCode(country.cca2)
		setCountry(country)
	}
	const switchVisible = () => setVisible(!visible)

	useEffect(() => {
		colorScheme.set(dark ? "dark" : "light")
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
				<Option title="Emoji" value={withEmoji} onValueChange={setWithEmoji} />
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
						countryCode,
						withSearch,
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
					title="Open the modal externally via useState."
					onPress={switchVisible}
				/>
				{country !== null && (
					<Text className="bg-zinc-200 dark:bg-zinc-800 border border-zinc-500 text-zinc-600 dark:text-zinc-300 w-96 mt-4 p-2 mb-8">
						{JSON.stringify(country, null, 2) ??
							"Select a country to show JSON data."}
					</Text>
				)}
			</ScrollView>
		</CountryModalProvider>
	)
}

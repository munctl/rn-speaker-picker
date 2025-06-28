import { ComponentProps, ReactNode, useEffect, useState } from "react"
import {
	FlatListProps,
	ImageSourcePropType,
	ImageStyle,
	ModalProps,
	StyleProp,
	ViewStyle,
} from "react-native"
import { useContext } from "./CountryContext"
import { CountryFilter, CountryFilterProps } from "./CountryFilter"
import { CountryModal } from "./CountryModal"
import { FlagButton } from "./FlagButton"
import { HeaderModal } from "./HeaderModal"
import { Country, CountryCode, FlagType, Region, Subregion } from "./types"
import SpeakerList from "./v2/list/SpeakerList"

interface State {
	visible: boolean
	countries: Country[]
	filter?: string
	filterFocus?: boolean
}

interface RenderFlagButtonProps extends ComponentProps<typeof FlagButton> {
	renderFlagButton?(props: ComponentProps<typeof FlagButton>): ReactNode
}

interface RenderCountryFilterProps
	extends ComponentProps<typeof CountryFilter> {
	renderCountryFilter?(props: ComponentProps<typeof CountryFilter>): ReactNode
}

const renderFlagButton = (props: RenderFlagButtonProps): ReactNode =>
	props.renderFlagButton ? (
		props.renderFlagButton(props)
	) : (
		<FlagButton {...props} />
	)

const renderFilter = (props: RenderCountryFilterProps): ReactNode =>
	props.renderCountryFilter ? (
		props.renderCountryFilter(props)
	) : (
		<CountryFilter {...props} />
	)

interface CountryPickerProps {
	allowFontScaling?: boolean
	countryCode?: CountryCode
	region?: Region
	subregion?: Subregion
	countryCodes?: CountryCode[]
	excludeCountries?: CountryCode[]
	preferredCountries?: CountryCode[]
	modalProps?: ModalProps
	filterProps?: CountryFilterProps
	flatListProps?: FlatListProps<Country>
	withEmoji?: boolean
	withCountryNameButton?: boolean
	withCurrencyButton?: boolean
	withCallingCodeButton?: boolean
	withFlagButton?: boolean
	withCloseButton?: boolean
	withFilter?: boolean
	withAlphaFilter?: boolean
	withCallingCode?: boolean
	withCurrency?: boolean
	withFlag?: boolean
	withModal?: boolean
	disableNativeModal?: boolean
	visible?: boolean
	placeholder?: string
	containerButtonStyle?: StyleProp<ViewStyle>
	closeButtonImage?: ImageSourcePropType
	closeButtonStyle?: StyleProp<ViewStyle>
	closeButtonImageStyle?: StyleProp<ImageStyle>
	renderFlagButton?(props: ComponentProps<typeof FlagButton>): ReactNode
	renderCountryFilter?(props: ComponentProps<typeof CountryFilter>): ReactNode
	onSelect(country: Country): void
	onOpen?(): void
	onClose?(): void
}

export function CountryPicker(props: CountryPickerProps) {
	const {
		allowFontScaling,
		countryCode,
		region,
		subregion,
		countryCodes,
		renderFlagButton: renderButton,
		renderCountryFilter,
		filterProps,
		modalProps,
		flatListProps,
		onSelect,
		withEmoji,
		withFilter,
		withCloseButton,
		withCountryNameButton,
		withCallingCodeButton,
		withCurrencyButton,
		containerButtonStyle,
		withAlphaFilter,
		withCallingCode,
		withCurrency,
		withFlag,
		withModal,
		disableNativeModal,
		withFlagButton,
		onClose: handleClose,
		onOpen: handleOpen,
		closeButtonImage,
		closeButtonStyle,
		closeButtonImageStyle,
		excludeCountries,
		placeholder,
		preferredCountries,
	} = props
	const [state, setState] = useState<State>({
		visible: props.visible || false,
		countries: [],
		filter: "",
		filterFocus: false,
	})
	const { translation, getCountriesAsync } = useContext()
	const { visible, filter, countries, filterFocus } = state

	useEffect(() => {
		if (state.visible !== props.visible) {
			setState({ ...state, visible: props.visible || false })
		}
	}, [props.visible])

	const onOpen = () => {
		setState({ ...state, visible: true })
		if (handleOpen) {
			handleOpen()
		}
	}
	const onClose = () => {
		setState({ ...state, filter: "", visible: false })
		if (handleClose) {
			handleClose()
		}
	}

	const setFilter = (filter: string) => setState({ ...state, filter })
	const setCountries = (countries: Country[]) =>
		setState({ ...state, countries })
	const onSelectClose = (country: Country) => {
		onSelect(country)
		onClose()
	}
	const onFocus = () => setState({ ...state, filterFocus: true })
	const onBlur = () => setState({ ...state, filterFocus: false })
	const flagProp = {
		allowFontScaling,
		countryCode,
		withEmoji,
		withCountryNameButton,
		withCallingCodeButton,
		withCurrencyButton,
		withFlagButton,
		renderFlagButton: renderButton,
		onOpen,
		containerButtonStyle,
		placeholder: placeholder || "Select Country",
	}

	useEffect(() => {
		let cancel = false
		getCountriesAsync(
			withEmoji ? FlagType.EMOJI : FlagType.FLAT,
			translation,
			region,
			subregion,
			countryCodes,
			excludeCountries,
			preferredCountries,
			withAlphaFilter,
		)
			.then((countries) => (cancel ? null : setCountries(countries)))
			.catch(console.warn)

		return () => {
			cancel = true
		}
	}, [translation, withEmoji])

	return (
		<>
			{withModal && renderFlagButton(flagProp)}
			<CountryModal
				{...{ visible, withModal, disableNativeModal, ...modalProps }}
				onRequestClose={onClose}
				onDismiss={onClose}
			>
				<HeaderModal
					{...{
						withFilter,
						onClose,
						closeButtonImage,
						closeButtonImageStyle,
						closeButtonStyle,
						withCloseButton,
					}}
					renderFilter={(props) =>
						renderFilter({
							...props,
							allowFontScaling,
							renderCountryFilter,
							onChangeText: setFilter,
							value: filter,
							onFocus,
							onBlur,
							...filterProps,
						})
					}
				/>
				<SpeakerList
					withCurrency={withCurrency ?? defaults.withCurrency}
					withFlag={withFlag ?? defaults.withFlag}
					withEmoji={withEmoji ?? defaults.withEmoji}
					withCallingCode={withCallingCode ?? defaults.withCallingCode}
					{...{
						onSelect: onSelectClose,
						data: countries,
						letters: [],
						withAlphaFilter:
							(withAlphaFilter ?? defaults.withAlphaFilter) && filter === "",
						filter,
						filterFocus,
						flatListProps,
					}}
				/>
			</CountryModal>
		</>
	)
}

const defaults: {
	withCallingCode: boolean
	withEmoji: boolean
	withFlag: boolean
	withCurrency: boolean
	withAlphaFilter: boolean
} = {
	withCallingCode: false,
	withEmoji: false,
	withFlag: true,
	withCurrency: false,
	withAlphaFilter: true,
}

CountryPicker.defaultProps = {
	withModal: true,
	withAlphaFilter: false,
	withCallingCode: false,
	placeholder: "Select Country",
	allowFontScaling: true,
}

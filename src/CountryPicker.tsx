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
import { SearchElement, CountryFilterProps } from "./v2/modal/SearchElement"
import { CountryModal } from "./v2/modal/CountryModal"
import { FlagButton, ModalTrigger } from "./v2/trigger/FlagButton"
import { Country, CountryCode, FlagType, Region, Subregion } from "./types"
import { SpeakerList } from "./v2/modal/list/SpeakerList"
import { ModalHeader } from "./v2/modal/ModalHeader"
import { TriggerProps } from "./v2/types/Props"

interface State {
	visible: boolean
	countries: Country[]
	searchTerm?: string
	filterFocus?: boolean
}

interface RenderCountryFilterProps
	extends ComponentProps<typeof SearchElement> {
	renderCountryFilter?(props: ComponentProps<typeof SearchElement>): ReactNode
}

const renderSearch = (props: RenderCountryFilterProps): ReactNode =>
	props.renderCountryFilter ? (
		props.renderCountryFilter(props)
	) : (
		<SearchElement {...props} />
	)

interface CountryPickerProps {
	trigger?: TriggerProps
	countryCode?: CountryCode
	region?: Region
	subregion?: Subregion
	countryCodes?: CountryCode[]
	excludeCountries?: CountryCode[]
	preferredCountries?: CountryCode[]
	modalProps?: ModalProps
	filterProps?: CountryFilterProps
	flatListProps?: FlatListProps<Country>
	withCloseButton?: boolean
	withSearch?: boolean
	withAlphaFilter?: boolean
	withCallingCode?: boolean
	withCurrency?: boolean
	withFlag?: boolean
	withTrigger?: boolean
	disableNativeModal?: boolean
	visible?: boolean
	placeholder?: string
	additional?: Country[]
	containerButtonStyle?: StyleProp<ViewStyle>
	closeButtonImage?: ImageSourcePropType
	closeButtonStyle?: StyleProp<ViewStyle>
	closeButtonImageStyle?: StyleProp<ImageStyle>
	renderFlagButton?(props: ComponentProps<typeof FlagButton>): ReactNode
	renderCountryFilter?(props: ComponentProps<typeof SearchElement>): ReactNode
	onSelect(country: Country): void
	onOpen?(): void
	onClose?(): void
}
/***
 * The main CountryPicker component that allows users to select a country from a modal.
 * @param {CountryPickerProps} props - The properties for the CountryPicker component.
 * @returns {ReactNode} The rendered CountryPicker component.
 ***/
export function CountryPicker(props: CountryPickerProps): ReactNode {
	const {
		region,
		trigger,
		subregion,
		countryCodes,
		countryCode,
		renderCountryFilter,
		filterProps,
		modalProps,
		flatListProps,
		onSelect,
		withSearch,
		withCloseButton,
		withAlphaFilter,
		withCallingCode,
		withCurrency,
		withFlag,
		withTrigger,
		disableNativeModal,
		onClose: handleClose,
		onOpen: handleOpen,
		closeButtonImage,
		closeButtonStyle,
		closeButtonImageStyle,
		excludeCountries,
		preferredCountries,
		additional,
	} = props

	const [state, setState] = useState<State>({
		visible: props.visible || false,
		countries: [],
		searchTerm: "",
		filterFocus: false,
	})
	const { translation, getCountriesAsync } = useContext()
	const { visible, searchTerm, countries, filterFocus } = state

	useEffect(() => {
		if (state.visible !== props.visible) {
			setState({ ...state, visible: props.visible || false })
		}
	}, [props.visible])

	const onOpen = () => {
		setState({ ...state, visible: true })
		if (handleOpen) handleOpen()
	}
	const onClose = () => {
		setState({ ...state, searchTerm: "", visible: false })
		if (handleClose) handleClose()
	}

	const setSearchTerm = (searchTerm: string) =>
		setState({ ...state, searchTerm })
	const setCountries = (countries: Country[]) =>
		setState({ ...state, countries })
	const onSelectClose = (country: Country) => {
		onSelect(country)
		onClose()
	}
	const onFocus = () => setState({ ...state, filterFocus: true })
	const onBlur = () => setState({ ...state, filterFocus: false })

	useEffect(() => {
		let ran = false
		if (ran) return
		getCountriesAsync(
			FlagType.FLAT,
			translation,
			region,
			subregion,
			countryCodes,
			excludeCountries,
			preferredCountries,
			withAlphaFilter,
		)
			.then((countries) => setCountries([...countries, ...(additional ?? [])]))
			.catch(console.warn)

		return () => {
			ran = true
		}
	}, [translation])

	return (
		<>
			{withTrigger && <ModalTrigger {...{ onOpen, countryCode, ...trigger }} />}
			<CountryModal
				withModal={withTrigger}
				{...{ visible, disableNativeModal, ...modalProps }}
				onRequestClose={onClose}
				onDismiss={onClose}
			>
				<ModalHeader
					{...{
						onClose,
						closeButtonImage,
						closeButtonImageStyle,
						closeButtonStyle,
						withCloseButton,
						withSearch,
					}}
					renderSearch={() =>
						renderSearch({
							...props,
							renderCountryFilter,
							onChangeText: setSearchTerm,
							value: searchTerm,
							onFocus,
							onBlur,
							...filterProps,
						})
					}
				/>
				<SpeakerList
					withCurrency={withCurrency ?? defaults.withCurrency}
					withFlag={withFlag ?? defaults.withFlag}
					withCallingCode={withCallingCode ?? defaults.withCallingCode}
					{...{
						onSelect: onSelectClose,
						data: countries,
						letters: [],
						withAlphaFilter:
							(withAlphaFilter ?? defaults.withAlphaFilter) &&
							searchTerm?.length === 0,
						searchTerm,
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
	withFlag: boolean
	withCurrency: boolean
	withAlphaFilter: boolean
} = {
	withCallingCode: false,
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

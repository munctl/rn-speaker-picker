import { ComponentProps, ReactNode, useEffect, useState } from "react"
import {FlatListProps, TextInputProps} from "react-native"
import { useContext } from "./CountryContext"
import { Country, CountryCode, FlagType, Region, Subregion } from "./types"
import { CountryModal, ListModalProps } from "./v2/modal/CountryModal"
import { SpeakerList, SpeakerListProps } from "./v2/modal/list/SpeakerList"
import { ModalHeader } from "./v2/modal/ModalHeader"
import { SearchElement } from "./v2/modal/SearchElement"
import { FlagButton, ModalTrigger } from "./v2/trigger/FlagButton"
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

export interface CountryPickerProps {
	trigger?: TriggerProps
	list?: Omit<Partial<SpeakerListProps>, "data" | "onSelect">
	modal?: ListModalProps
	countries?: {
		showOnly?: CountryCode[] | string[]
		preferred?: CountryCode[] | string[]
		excluded?: CountryCode[] | string[]
		additional?: Country[]
	}
	countryCode?: CountryCode
	region?: Region
	subregion?: Subregion
	filterProps?: TextInputProps
	flatListProps?: FlatListProps<Country>
	withCloseButton?: boolean
	withSearch?: boolean
	withTrigger?: boolean
	visible?: boolean
	placeholder?: string
	renderFlagButton?(props: ComponentProps<typeof FlagButton>): ReactNode
	renderCountryFilter?(props: ComponentProps<typeof SearchElement>): ReactNode
	onSelect?(country: Country): void
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
		list,
		modal,
		countries,
		subregion,
		countryCode,
		renderCountryFilter,
		filterProps,
		flatListProps,
		onSelect,
		withSearch,
		withCloseButton,
		withTrigger = true,
		onClose: handleClose,
		onOpen: handleOpen,
	} = props

	const [state, setState] = useState<State>({
		visible: props.visible || false,
		countries: [],
		searchTerm: "",
		filterFocus: false,
	})
	const { translation, getCountriesAsync } = useContext()
	const { visible, searchTerm, countries: countriesState, filterFocus } = state

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
			countries?.showOnly as CountryCode[],
			countries?.excluded as CountryCode[],
			countries?.preferred as CountryCode[],
			list?.withAlphaFilter,
		)
			.then((res) => setCountries([...res, ...(countries?.additional ?? [])]))
			.catch(console.warn)

		return () => {
			ran = true
		}
	}, [translation])

	return (
		<>
			{withTrigger && (
				<ModalTrigger
					{...{ onOpen, countryCode, ...trigger }}
					testID="country-picker-trigger"
				/>
			)}
			<CountryModal
				withModal={withTrigger}
				{...{ visible, ...modal }}
				onRequestClose={onClose}
				onDismiss={onClose}
			>
				<ModalHeader
					{...{
						onClose,
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
					{...{
						...list,
						onSelect: onSelectClose,
						data: countriesState,
						withAlphaFilter:
							(list?.withAlphaFilter ?? true) && searchTerm?.length === 0,
						searchTerm,
						filterFocus,
						flatListProps,
					}}
				/>
			</CountryModal>
		</>
	)
}

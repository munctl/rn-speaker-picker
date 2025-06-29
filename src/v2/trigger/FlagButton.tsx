import { memo, type ReactNode, useEffect, useState } from "react"
import { Text, TouchableOpacity, View } from "react-native"
import { useContext } from "../../CountryContext"
import { Flag } from "../../Flag"
import getSuffix from "../../utils/getSuffix"
import { TriggerProps } from "../types/Props"

/***
 * Render function for the component that opens the picker modal.
 * @param {TriggerProps} props - The properties for the ModalTrigger component.
 * @returns {ReactNode} The rendered ModalTrigger component.
 ***/
export function ModalTrigger(props: TriggerProps): ReactNode {
	return props.render ? props.render(props) : <FlagButton {...props} />
}

const TriggerInner = memo(
	({
		countryCode,
		withCountryName,
		withCurrency = false,
		withCallingCode = false,
		withFlag = true,
		flagSize = 24,
		placeholder = "Tap to select a country",
		textClassName = "text-lg text-zinc-800 dark:text-zinc-100",
		...props
	}: TriggerProps) => {
		const { translation, getCountryInfoAsync } = useContext()
		const [state, setState] = useState({
			countryName: "",
			currency: "",
			callingCode: "",
		})
		const { countryName, currency, callingCode } = state
		useEffect(() => {
			if (countryCode) {
				getCountryInfoAsync({ countryCode, translation })
					.then(setState)
					.catch(console.warn)
			}
		}, [countryCode, withCountryName, withCurrency, withCallingCode])

		return (
			<View className="flex-row flex-wrap items-center gap-2" {...props}>
				{countryCode ? (
					withFlag && <Flag {...{ countryCode, withFlag, flagSize }} />
				) : (
					<Text className={textClassName}>{placeholder}</Text>
				)}

				<Text className={textClassName}>
					{withCountryName && countryName && `${countryName} `}
					{getSuffix({
						...{ callingCode, currency, withCurrency, withCallingCode },
						parentheses: withCountryName,
					})}
				</Text>
			</View>
		)
	},
)

export function FlagButton({
	withCallingCode,
	withCurrency,
	withFlag,
	withCountryName,
	onOpen,
	placeholder,
	textClassName,
	wrapperClassName,
	countryCode,
	flagSize,
	...rest
}: TriggerProps) {
	return (
		<TouchableOpacity onPress={onOpen}>
			<View {...rest} className={wrapperClassName}>
				<TriggerInner
					{...{
						countryCode,
						withCountryName,
						withCallingCode,
						withCurrency,
						withFlag,
						flagSize,
						placeholder,
						textClassName,
					}}
				/>
			</View>
		</TouchableOpacity>
	)
}

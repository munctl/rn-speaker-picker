import React, { useState, useEffect, ReactNode, memo } from "react"
import {
	TouchableOpacity,
	StyleSheet,
	View,
	StyleProp,
	ViewStyle,
	TextProps,
} from "react-native"
import { CountryCode } from "./types"
import { Flag } from "./Flag"
import { useContext } from "./CountryContext"
import { CountryText } from "./CountryText"
import { useTheme } from "./CountryTheme"
import getSuffix from "./utils/getSuffix"
import { TriggerProps } from "./CountryPicker"

const styles = StyleSheet.create({
	container: {
		alignItems: "flex-start",
		justifyContent: "flex-start",
	},
	containerWithEmoji: {
		marginTop: 0,
	},
	containerWithoutEmoji: {
		marginTop: 5,
	},
	something: { fontSize: 16 },
})

type FlagWithSomethingProp = Pick<
	FlagButtonProps,
	| "countryCode"
	| "withEmoji"
	| "withCountryNameButton"
	| "withCurrencyButton"
	| "withCallingCodeButton"
	| "withFlagButton"
	| "placeholder"
> & { flagSize: number; allowFontScaling?: boolean; textClassName?: string }

const FlagText = (props: TextProps & { children: ReactNode }) => (
	<CountryText {...props} style={styles.something} />
)

const FlagWithSomething = memo(
	({
		allowFontScaling,
		countryCode,
		withEmoji,
		withCountryNameButton,
		withCurrencyButton,
		withCallingCodeButton,
		withFlagButton,
		flagSize,
		placeholder,
		textClassName,
		...props
	}: FlagWithSomethingProp) => {
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
		}, [
			countryCode,
			withCountryNameButton,
			withCurrencyButton,
			withCallingCodeButton,
		])

		return (
			<View className="flex-row flex-wrap items-center gap-2">
				{countryCode ? (
					<Flag {...{ withEmoji, countryCode, withFlagButton, flagSize }} />
				) : (
					<FlagText allowFontScaling={allowFontScaling}>{placeholder}</FlagText>
				)}

				{withCountryNameButton && countryName ? (
					<FlagText
						allowFontScaling={allowFontScaling}
						className={textClassName}
					>
						{countryName + " "}
					</FlagText>
				) : null}
				<FlagText allowFontScaling={allowFontScaling} className={textClassName}>
					{getSuffix({
						...{ callingCode, currency },
						withCurrency: withCurrencyButton!,
						withCallingCode: withCallingCodeButton!,
					})}
				</FlagText>
			</View>
		)
	},
)

export interface FlagButtonProps {
	allowFontScaling?: boolean
	withEmoji?: boolean
	withCountryNameButton?: boolean
	withCurrencyButton?: boolean
	withCallingCodeButton?: boolean
	withFlagButton?: boolean
	containerButtonStyle?: StyleProp<ViewStyle>
	countryCode?: CountryCode
	placeholder: string
	onOpen?(): void
}

export function FlagButton({
	allowFontScaling,
	withEmoji,
	withCountryNameButton,
	withCallingCodeButton,
	withCurrencyButton,
	withFlagButton,
	countryCode,
	containerButtonStyle,
	onOpen,
	placeholder,
	textClassName,
	wrapperClassName,
	...props
}: FlagButtonProps & TriggerProps) {
	const { flagSizeButton: flagSize } = useTheme()
	return (
		<TouchableOpacity
			activeOpacity={0.7}
			onPress={onOpen}
			{...props}
			className={wrapperClassName}
		>
			<View
				style={[
					styles.container,
					withEmoji ? styles.containerWithEmoji : styles.containerWithoutEmoji,
					containerButtonStyle,
				]}
			>
				<FlagWithSomething
					{...{
						allowFontScaling,
						countryCode,
						withEmoji,
						withCountryNameButton,
						withCallingCodeButton,
						withCurrencyButton,
						withFlagButton,
						flagSize: flagSize!,
						placeholder,
						textClassName,
					}}
				/>
			</View>
		</TouchableOpacity>
	)
}

FlagButton.defaultProps = {
	withEmoji: true,
	withCountryNameButton: false,
	withCallingCodeButton: false,
	withCurrencyButton: false,
	withFlagButton: true,
}

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
> & { flagSize: number; allowFontScaling?: boolean }

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
			<View className="flex-row flex-wrap items-center">
				{countryCode ? (
					<Flag {...{ withEmoji, countryCode, withFlagButton, flagSize }} />
				) : (
					<FlagText allowFontScaling={allowFontScaling}>{placeholder}</FlagText>
				)}

				{withCountryNameButton && countryName ? (
					<FlagText allowFontScaling={allowFontScaling}>
						{countryName + " "}
					</FlagText>
				) : null}
				<FlagText allowFontScaling={allowFontScaling}>
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
}: FlagButtonProps) {
	const { flagSizeButton: flagSize } = useTheme()
	return (
		<TouchableOpacity activeOpacity={0.7} onPress={onOpen}>
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

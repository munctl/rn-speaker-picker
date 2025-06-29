import { memo } from "react"
import { useAsync } from "react-async-hook"
import {
	ActivityIndicator,
	Image,
	PixelRatio,
	StyleSheet,
	Text,
	View,
} from "react-native"
import { useContext } from "./CountryContext"
import { Emoji } from "./Emoji"
import { CountryCode } from "./types"

const styles = StyleSheet.create({
	container: {
		justifyContent: "center",
		alignItems: "center",
		width: 30,
	},
	emojiFlag: {
		alignItems: "center",
		justifyContent: "center",
		borderWidth: 1 / PixelRatio.get(),
		borderColor: "transparent",
		backgroundColor: "transparent",
	},
	imageFlag: {
		resizeMode: "contain",
		width: 25,
		height: 19,
		borderWidth: 1 / PixelRatio.get(),
		opacity: 0.8,
	},
})

interface FlagType {
	countryCode: CountryCode
	withEmoji?: boolean
	withFlagButton?: boolean
	flagSize: number
}

const ImageFlag = memo(({ countryCode, flagSize }: FlagType) => {
	const { getImageFlagAsync } = useContext()
	const asyncResult = useAsync(getImageFlagAsync, [countryCode])
	if (asyncResult.loading) {
		return <ActivityIndicator size={"small"} />
	}
	return (
		<Image
			resizeMode={"contain"}
			style={[
				styles.imageFlag,
				{ borderColor: "transparent", height: flagSize },
			]}
			source={{ uri: asyncResult.result }}
		/>
	)
})

/*const EmojiFlag = memo(({ countryCode, flagSize }: FlagType) => {
	const { getEmojiFlagAsync } = useContext()
	const asyncResult = useAsync(getEmojiFlagAsync, [countryCode])

	if (asyncResult.loading) {
		return <ActivityIndicator size={"small"} />
	}
	return (
		<Text
			style={[styles.emojiFlag, { fontSize: flagSize }]}
			allowFontScaling={false}
		>
			<Emoji {...{ name: asyncResult.result! }} />
		</Text>
	)
})*/

export function Flag({
	countryCode,
	withFlagButton,
	flagSize,
	...props
}: FlagType) {
	return (
		<View style={styles.container} {...props}>
			<ImageFlag {...{ countryCode, flagSize }} />
		</View>
	)
}

Flag.defaultProps = {
	withEmoji: true,
	withFlagButton: true,
}

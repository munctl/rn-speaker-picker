import { memo } from "react"
import { useAsync } from "react-async-hook"
import { ActivityIndicator, Image, View } from "react-native"
import { useContext } from "./CountryContext"
import { CountryCode } from "./types"

interface FlagType {
	countryCode: CountryCode
	flagSize: number
	[key: string]: any // Allow additional props
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
			style={{ height: flagSize }}
			className="w-8 object-contain"
			source={{ uri: asyncResult.result }}
		/>
	)
})

export function Flag({ countryCode, flagSize, ...others }: FlagType) {
	return (
		<View {...others}>
			<ImageFlag {...{ countryCode, flagSize }} />
		</View>
	)
}

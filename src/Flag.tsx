import React, { memo } from "react"
import { useAsync } from "react-async-hook"
import { ActivityIndicator, Image, View, ViewProps } from "react-native"
import { useCountryContext } from "./CountryContext"
import { CountryCode } from "./types"

interface FlagProps extends ViewProps {
	countryCode: CountryCode
	flagSize: number
}

const ImageFlag: React.FC<FlagProps> = memo(({ countryCode, flagSize }) => {
	const { getImageFlagAsync } = useCountryContext()
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

export const Flag: React.FC<FlagProps> = ({ countryCode, flagSize, ...others }) => {
	return (
		<View {...others}>
			<ImageFlag {...{ countryCode, flagSize }} />
		</View>
	)
}

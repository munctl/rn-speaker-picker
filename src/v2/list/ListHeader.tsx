import React from "react"
import { Text, TouchableOpacity, View } from "react-native"
import { Flag } from "../../Flag"
import { Country } from "../../types"
import getSuffix from "../../utils/getSuffix"

export default function ListHeader({ item }: { item: string }) {
	return (
		<Text className="mb-2 p-1 bg-zinc-200 dark:bg-zinc-700 text-zinc-700 dark:text-zinc-200 rounded-md font-bold">
			{item}
		</Text>
	)
}

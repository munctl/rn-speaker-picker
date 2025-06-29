import React, { ReactNode } from "react"
import { Text, TouchableOpacity, View } from "react-native"
import { Flag } from "../../../Flag"
import { Country } from "../../../types"
import getSuffix from "../../../utils/getSuffix"

/***
 * Header component for a list, displaying the name of the section.
 * @param {Object} props
 * @param {string} props.item - The name of the section to display.
 * @returns {ReactNode} The rendered ListHeading component.
 ***/
export default function ListHeading({ item }: { item: string }): ReactNode {
	return (
		<Text className="mb-2 p-1 bg-zinc-200 dark:bg-zinc-700 text-zinc-700 dark:text-zinc-200 rounded-md font-bold">
			{item}
		</Text>
	)
}

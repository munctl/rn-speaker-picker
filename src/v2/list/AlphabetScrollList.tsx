import { FlashList } from "@shopify/flash-list"
import { ReactElement, useMemo, useRef } from "react"
import { LayoutChangeEvent, Text, TouchableOpacity, View } from "react-native"
import {
	Gesture,
	GestureDetector,
	GestureHandlerRootView,
	GestureUpdateEvent,
	PanGestureHandlerEventPayload,
} from "react-native-gesture-handler"
import { runOnJS, useSharedValue } from "react-native-reanimated"

export interface CustomAlphabetScrollListProps {
	withAlphaFilter?: boolean
	withHeaders?: boolean
}

interface Section<T> {
	title: string
	data: T[]
}

interface AlphabetScrollListProps<T> {
	sections: Section<T>[]
	renderItem: (item: T) => ReactElement
	renderSectionHeader: (title: string) => ReactElement
	getItemKey: (item: T) => string
	onSectionChange?: (section: string) => void
	style?: any
}

export function AlphabetScrollList<T>({
	sections,
	renderItem,
	renderSectionHeader,
	getItemKey,
	onSectionChange,
	withAlphaFilter,
	withHeaders,
	...props
}: AlphabetScrollListProps<T> & CustomAlphabetScrollListProps) {
	const flashListRef = useRef<FlashList<T | string>>(null)
	const containerY = useSharedValue(0)
	const containerHeightRef = useSharedValue(0)

	const sectionTitles = useMemo(() => sections.map((s) => s.title), [sections])

	const flatData: (string | T)[] = []
	const stickyHeaderIndices: number[] = []
	sections.forEach((section) => {
		stickyHeaderIndices.push(flatData.length)
		flatData.push(section.title)
		flatData.push(...section.data)
	})

	const isSectionHeader = (i: any) => sectionTitles.includes(i)
	const getSectionHeaderIndex = (title: string) =>
		flatData.findIndex((i) => i === title)

	function scrollToSection(index: number) {
		if (index >= 0 && index < sections.length) {
			const headerIndex = getSectionHeaderIndex(sections[index].title)
			if (headerIndex !== -1 && flashListRef.current) {
				flashListRef.current.scrollToIndex({
					index: headerIndex,
					animated: true,
					viewPosition: 0,
				})
				onSectionChange?.(sections[index].title)
			}
		}
	}

	const onGestureEvent = (
		event: GestureUpdateEvent<PanGestureHandlerEventPayload>,
	) => {
		const y = event.absoluteY
		const containerHeight = containerHeightRef.get() - containerY.get()
		const letterHeight = containerHeight / sections.length || 1
		let index = Math.floor(y / letterHeight)
		if (index < 0) index = 0
		if (index >= sections.length) index = sections.length - 1
		runOnJS(scrollToSection)(index)
	}

	const onContainerLayout = (e: LayoutChangeEvent) => {
		containerY.set(e.nativeEvent.layout.y)
		containerHeightRef.set(e.nativeEvent.layout.height)
	}

	const pan = Gesture.Pan().onUpdate(onGestureEvent)

	return (
		<View className="flex-1" {...props}>
			<FlashList
				ref={flashListRef}
				className="flex-1"
				data={flatData}
				keyExtractor={(item, i) =>
					isSectionHeader(item) ? `header-${item}-${i}` : getItemKey(item as T)
				}
				renderItem={({ item }) =>
					isSectionHeader(item)
						? withHeaders === false
							? null
							: renderSectionHeader(item as string)
						: renderItem(item as T)
				}
				stickyHeaderIndices={stickyHeaderIndices}
				getItemType={(item) =>
					isSectionHeader(item) ? "sectionHeader" : "row"
				}
			/>
			{withAlphaFilter !== false && (
				<View
					className="absolute right-0 top-0 bottom-0 py-2 px-1 justify-center"
					onLayout={onContainerLayout}
				>
					<GestureHandlerRootView>
						<GestureDetector gesture={pan}>
							<View className="flex-1 justify-center">
								{sections.map((section, i) => (
									<TouchableOpacity
										key={section.title}
										onPress={() => scrollToSection(i)}
									>
										<Text className="text-sm py-0.5 px-1 text-zinc-800 dark:text-zinc-200 ">
											{section.title}
										</Text>
									</TouchableOpacity>
								))}
							</View>
						</GestureDetector>
					</GestureHandlerRootView>
				</View>
			)}
		</View>
	)
}

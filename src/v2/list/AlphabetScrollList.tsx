import React, { ReactElement, useMemo, useRef } from "react"
import { View, Text, TouchableOpacity, LayoutChangeEvent } from "react-native"
import {
	Gesture,
	GestureDetector,
	GestureHandlerRootView,
	GestureUpdateEvent,
	PanGestureChangeEventPayload,
	PanGestureHandlerEventPayload,
} from "react-native-gesture-handler"
import { FlashList } from "@shopify/flash-list"
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
	const letterTops = useRef<number[]>([])
	const containerY = useSharedValue(0)
	const containerHeightRef = useSharedValue(0)

	// Memoize section titles for fast lookup
	const sectionTitles = useMemo(() => sections.map((s) => s.title), [sections])

	// Flatten sections for FlashList
	const flatData: (string | T)[] = []
	const stickyHeaderIndices: number[] = []
	sections.forEach((section) => {
		stickyHeaderIndices.push(flatData.length)
		flatData.push(section.title)
		flatData.push(...section.data)
	})

	// Helper: is section header
	const isSectionHeader = (item: any) => sectionTitles.includes(item)
	// Helper: get header index in flatData
	const getSectionHeaderIndex = (title: string) =>
		flatData.findIndex((item) => item === title)

	// Scroll to section by index
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

	// Pan gesture for alpha filter
	const onGestureEvent = (
		event: GestureUpdateEvent<PanGestureHandlerEventPayload>,
	) => {
		// Use absoluteY for more reliable finger position
		const y = event.absoluteY - containerY.get()
		const containerHeight = containerHeightRef.get()
		const letterHeight = containerHeight / sections.length || 1
		let index = Math.floor(y / letterHeight)
		if (index < 0) index = 0
		if (index >= sections.length) index = sections.length - 1
		runOnJS(scrollToSection)(index)
	}

	// Layout handlers
	const onContainerLayout = (e: LayoutChangeEvent) => {
		containerY.set(e.nativeEvent.layout.y)
		containerHeightRef.set(e.nativeEvent.layout.height)
	}
	const onLetterLayout = (index: number, e: LayoutChangeEvent) => {
		letterTops.current[index] = e.nativeEvent.layout.y
	}

	const pan = Gesture.Pan().onUpdate(onGestureEvent)

	return (
		<View className="flex-1" {...props}>
			<FlashList
				ref={flashListRef}
				className="flex-1"
				data={flatData}
				keyExtractor={(item, idx) =>
					isSectionHeader(item)
						? `header-${item}-${idx}`
						: getItemKey(item as T)
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
					className="absolute right-0 top-0 bottom-0 py-2 px-1 h-full justify-center"
					style={{ height: "100%" }}
					onLayout={onContainerLayout}
				>
					<GestureHandlerRootView>
						<GestureDetector gesture={pan}>
							<View className="flex-1 justify-center">
								{sections.map((section, i) => (
									<TouchableOpacity
										key={section.title}
										onPress={() => scrollToSection(i)}
										activeOpacity={0.6}
										onLayout={(e) => onLetterLayout(i, e)}
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

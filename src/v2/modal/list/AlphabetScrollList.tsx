import { FlashList } from "@shopify/flash-list"
import { ReactElement, RefObject, useMemo, useRef } from "react"
import { LayoutChangeEvent, Text, TouchableOpacity, View } from "react-native"
import {
	Gesture,
	GestureDetector,
	GestureHandlerRootView,
	GestureUpdateEvent,
	PanGestureHandlerEventPayload,
} from "react-native-gesture-handler"
import { runOnJS, useSharedValue } from "react-native-reanimated"

interface Section<T> {
	title: string
	data: T[]
}

export interface AlphabetScrollListProps<T> {
	sections: Section<T>[]
	renderItem: (item: T) => ReactElement
	renderSectionHeader: (title: string) => ReactElement
	getItemKey: (item: T) => string

	withAlphaFilter?: boolean
	withHeaders?: boolean

	alphaFilter?: {
		wrapperClassName?: string
		textClassName?: string
		onSectionChange?: (section: string) => void
	}
	[key: string]: any
}

export function AlphabetScrollList<T>({
	sections,
	renderItem,
	renderSectionHeader,
	getItemKey,
	withAlphaFilter = true,
	withHeaders = true,
	alphaFilter,
	...rest
}: AlphabetScrollListProps<T>) {
	const flashListRef = useRef<FlashList<T | string>>(null)

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

	return (
		<View className="flex-1" {...rest}>
			<FlashList estimatedItemSize={48}
				ref={flashListRef}
				className="flex-1"
				data={flatData}
				keyExtractor={(item, i) =>
					isSectionHeader(item) ? `header-${item}-${i}` : getItemKey(item as T)
				}
				renderItem={({ item }) =>
					isSectionHeader(item)
						? withHeaders
							? renderSectionHeader(item as string)
							: null
						: renderItem(item as T)
				}
				stickyHeaderIndices={stickyHeaderIndices}
				getItemType={(item) =>
					isSectionHeader(item) ? "sectionHeader" : "row"
				}
			/>
			{withAlphaFilter && (
				<AlphaFilter<T>
					{...{
						...alphaFilter,
						getSectionHeaderIndex,
						sections,
						flashListRef,
					}}
				/>
			)}
		</View>
	)
}

function AlphaFilter<T>({
	wrapperClassName = "items-center py-1 my-auto bg-zinc-400/20 dark:bg-zinc-600/20 rounded-md",
	textClassName = "text-sm py-0.5 px-2 text-zinc-800 dark:text-zinc-200",
	sections,
	getSectionHeaderIndex,
	onSectionChange,
	flashListRef,
}: {
	wrapperClassName?: string
	textClassName?: string
	sections: Section<T>[]
	getSectionHeaderIndex: (title: string) => number
	onSectionChange?: (section: string) => void
	flashListRef: RefObject<FlashList<string | T> | null>
}) {
	const containerY = useSharedValue(0)
	const containerHeight = useSharedValue(0)

	function scrollToSection(index: number) {
		if (index >= 0 && index < sections.length) {
			const headerIndex = getSectionHeaderIndex(sections[index].title)
			if (headerIndex !== -1 && flashListRef?.current) {
				flashListRef?.current.scrollToIndex({
					index: headerIndex,
					animated: true,
					viewPosition: 0,
				})
				onSectionChange?.(sections[index].title)
			}
		}
	}

	function onGestureEvent(
		event: GestureUpdateEvent<PanGestureHandlerEventPayload>,
	) {
		const y = Math.max(0, event.absoluteY - containerY.get())
		const letterHeight = containerHeight.get() / sections.length || 1
		let index = Math.floor(y / letterHeight)
		if (index < 0) index = 0
		if (index >= sections.length) index = sections.length - 1
		runOnJS(scrollToSection)(index)
	}
	function onContainerLayout(e: LayoutChangeEvent) {
		containerY.set(e.nativeEvent.layout.y)
		containerHeight.set(e.nativeEvent.layout.height)
	}
	const pan = Gesture.Pan().onUpdate(onGestureEvent)
	return (
		<View className="absolute right-0 h-full">
			<GestureHandlerRootView>
				<GestureDetector gesture={pan}>
					<View className={wrapperClassName} onLayout={onContainerLayout}>
						{sections.map((section, i) => (
							<TouchableOpacity
								key={section.title}
								onPress={() => scrollToSection(i)}
							>
								<Text className={textClassName}>{section.title}</Text>
							</TouchableOpacity>
						))}
					</View>
				</GestureDetector>
			</GestureHandlerRootView>
		</View>
	)
}

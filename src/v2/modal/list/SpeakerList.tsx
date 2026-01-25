import {View} from "react-native"
import {useCountryContext} from "../../../CountryContext"
import {Country} from "../../../types"
import {
  AlphabetScrollList,
  AlphabetScrollListProps,
} from "./AlphabetScrollList"
import ListHeading from "./ListHeading"
import ListItem from "./ListItem"
import {useMemo} from "react";

export interface SpeakerListProps {
  data: Country[]
  searchTerm?: string
  filterFocus?: boolean
  withFlag?: boolean
  withAlphaFilter?: boolean
  withCallingCode?: boolean
  withCurrency?: boolean

  onSelect(country: Country): void

  wrapperClassName?: string
  speakerList?: AlphabetScrollListProps<Country>

  [key: string]: unknown
}

export function SpeakerList({
                              data,
                              searchTerm,
                              withAlphaFilter = true,
                              withFlag = true,
                              withCurrency = false,
                              withCallingCode = false,
                              onSelect,
                              speakerList,
                              wrapperClassName = "flex-1 flex-row content-between mx-1",
                              ...rest
                            }: SpeakerListProps) {
  const {search} = useCountryContext()

  const sections = useMemo(() => {
    const groups: Record<string, Country[]> = {}

    search(searchTerm, data).forEach((d) => {
      const name = d.name.toString()
      if (!name) return

      const firstChar = name[0]
      if (!groups[firstChar]) groups[firstChar] = []
      groups[firstChar].push(d)
    })
    // Sort the section titles by Unicode order
    return Object.keys(groups)
      .sort((a, b) => a.localeCompare(b))
      .map((ch) => ({title: ch, data: groups[ch]}))
  }, [data, searchTerm, search]);

  return (
    <View {...rest} className={wrapperClassName}>
      <View className="grow">
        <AlphabetScrollList<Country>
          getItemKey={(item) => item.name.toString()}
          renderSectionHeader={(item) => <ListHeading {...{item}} />}
          renderItem={(item) => (
            <ListItem
              {...{
                onSelect,
                withCallingCode,
                withCurrency,
                withFlag,
              }}
              country={item}
            />
          )}
          sections={sections}
          {...{withAlphaFilter, ...speakerList}}
        />
      </View>
    </View>
  )
}

import SimpleAutoComplete from '@src/components/SimpleAutoComplete'
import { MapIdResponseType, SearchMap, searchMap } from '@src/utils/api/mapIdApi'

export default function MapIdAutoComplete({
  onChange,
  mutateOptions,
}: {
  onChange: (arg: MapIdResponseType) => void
  mutateOptions?: (arg: MapIdResponseType[]) => MapIdResponseType[]
}) {
  return (
    <SimpleAutoComplete<MapIdResponseType, SearchMap>
      initialQuery={{ limit: 100, page: 0, search: '' }}
      querySetter={(prevState, inputValue) => ({
        ...prevState,
        search: inputValue,
      })}
      fetcher={(q) => searchMap(q as SearchMap).catch((err) => [] as MapIdResponseType[])}
      onChange={onChange}
      getOptionLabel={(option: MapIdResponseType) => `${option.area_name}, ${option.parent_name}`}
      getOptionSelected={(current, selected) => current.area_id === selected.area_id}
    />
  )
}

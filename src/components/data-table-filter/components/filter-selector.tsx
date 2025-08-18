import {
  type Column,
  type ColumnDataType,
  type DataTableFilterActions,
  type FilterStrategy,
  type FiltersState,
  getColumn,
  isAnyOf,
  type Locale,
  t,
} from '@bazzaui/filters'
import { ArrowRightIcon, ChevronRightIcon, FilterIcon } from 'lucide-react'
import React, {
  isValidElement,
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { Button } from '~/components/ui/button'
import { Checkbox } from '~/components/ui/checkbox'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '~/components/ui/command'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '~/components/ui/popover'
import { cn } from '~/lib/utils'
import { FilterValueController } from './filter-value'

interface FilterSelectorProps<TData> {
  filters: FiltersState
  columns: Column<TData>[]
  actions: DataTableFilterActions
  strategy: FilterStrategy
  locale?: Locale
}

export const FilterSelector = memo(__FilterSelector) as typeof __FilterSelector

function __FilterSelector<TData>({
  filters,
  columns,
  actions,
  strategy,
  locale = 'en',
}: FilterSelectorProps<TData>) {
  const [open, setOpen] = useState(false)
  const [value, setValue] = useState('')
  const [property, setProperty] = useState<string | undefined>(undefined)
  const inputRef = useRef<HTMLInputElement>(null)

  const visibleColumns = useMemo(
    () => columns.filter((c) => !c.hidden),
    [columns],
  )

  const visibleFilters = useMemo(
    () =>
      filters.filter((f) => visibleColumns.find((c) => c.id === f.columnId)),
    [filters, visibleColumns],
  )

  const column = property ? getColumn(visibleColumns, property) : undefined
  const filter = property
    ? visibleFilters.find((f) => f.columnId === property)
    : undefined

  const hasVisibleFilters = visibleFilters.length > 0

  useEffect(() => {
    if (property && inputRef) {
      inputRef.current?.focus()
      setValue('')
    }
  }, [property])

  useEffect(() => {
    if (!open) setTimeout(() => setValue(''), 150)
  }, [open])

  // biome-ignore lint/correctness/useExhaustiveDependencies: need filters to be updated
  const content = useMemo(
    () =>
      property && column && column.type !== 'boolean' ? (
        <FilterValueController
          filter={filter!}
          column={column as Column<TData, ColumnDataType>}
          actions={actions}
          strategy={strategy}
          locale={locale}
        />
      ) : (
        <Command
          loop
          filter={(value, search, keywords) => {
            const extendValue = `${value} ${keywords?.join(' ')}`
            return extendValue.toLowerCase().includes(search.toLowerCase())
              ? 1
              : 0
          }}
        >
          <CommandInput
            value={value}
            onValueChange={setValue}
            ref={inputRef}
            placeholder={t('search', locale)}
          />
          <CommandEmpty>{t('noresults', locale)}</CommandEmpty>
          <CommandList className="max-h-fit">
            <CommandGroup>
              {visibleColumns.map((column) => (
                <FilterableColumn
                  key={column.id}
                  column={column}
                  setProperty={setProperty}
                  actions={actions}
                />
              ))}
              <QuickSearchFilters
                search={value}
                filters={visibleFilters}
                columns={visibleColumns}
                actions={actions}
                strategy={strategy}
                locale={locale}
              />
            </CommandGroup>
          </CommandList>
        </Command>
      ),
    [property, column, filter, visibleFilters, visibleColumns, actions, value],
  )

  return (
    <Popover
      open={open}
      onOpenChange={async (value) => {
        setOpen(value)
        if (!value) setTimeout(() => setProperty(undefined), 100)
      }}
    >
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn('h-7', hasVisibleFilters && 'w-fit !px-2')}
        >
          <FilterIcon className="size-4" />
          {!hasVisibleFilters && <span>{t('filter', locale)}</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        align="start"
        side="bottom"
        className="w-fit p-0 origin-(--radix-popover-content-transform-origin)"
      >
        {content}
      </PopoverContent>
    </Popover>
  )
}

export function FilterableColumn<TData, TType extends ColumnDataType, TVal>({
  column,
  setProperty,
  actions,
}: {
  column: Column<TData, TType, TVal>
  setProperty: (value: string) => void
  actions: DataTableFilterActions
}) {
  const itemRef = useRef<HTMLDivElement>(null)

  const { icon: Icon } = column
  const hasIcon = !!Icon

  const prefetch = useCallback(() => {
    column.prefetchValues()

    // Only prefetch options and faceted values for option and multi-option columns
    if (isAnyOf(column.type, ['option', 'multiOption'])) {
      column.prefetchOptions()
      column.prefetchFacetedUniqueValues()
    }

    // Only prefetch min/max values for number columns
    if (column.type === 'number') {
      column.prefetchFacetedMinMaxValues()
    }
  }, [column])

  useEffect(() => {
    const target = itemRef.current

    if (!target) return

    // Set up MutationObserver
    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (mutation.type === 'attributes') {
          const isSelected = target.getAttribute('data-selected') === 'true'
          if (isSelected) prefetch()
        }
      }
    })

    // Set up observer
    observer.observe(target, {
      attributes: true,
      attributeFilter: ['data-selected'],
    })

    // Cleanup on unmount
    return () => observer.disconnect()
  }, [prefetch])

  function handleSelect() {
    if (column.type === 'boolean') {
      actions.setFilterValue(column as any, [true])
      return
    }

    setProperty(column.id)
  }

  return (
    <CommandItem
      ref={itemRef}
      value={column.id}
      keywords={[column.displayName]}
      onSelect={handleSelect}
      className="group"
      onMouseEnter={prefetch}
    >
      <div className="flex w-full items-center justify-between">
        <div className="inline-flex items-center gap-1.5">
          {hasIcon &&
            (isValidElement(Icon) ? (
              Icon
            ) : (
              <Icon className="size-4 stroke-[2.25px]" />
            ))}
          <span>{column.displayName}</span>
        </div>
        {column.type !== 'boolean' && (
          <ArrowRightIcon className="size-4 opacity-0 group-aria-selected:opacity-100" />
        )}
      </div>
    </CommandItem>
  )
}

interface QuickSearchFiltersProps<TData> {
  search?: string
  filters: FiltersState
  columns: Column<TData>[]
  actions: DataTableFilterActions
  strategy: FilterStrategy
  locale?: Locale
}

export const QuickSearchFilters = memo(
  __QuickSearchFilters,
) as typeof __QuickSearchFilters

function __QuickSearchFilters<TData>({
  search,
  filters,
  columns,
  actions,
  strategy,
  locale = 'en',
}: QuickSearchFiltersProps<TData>) {
  if (!search || search.trim().length < 2) return null

  // biome-ignore lint/correctness/useHookAtTopLevel: its okay
  const cols = useMemo(
    () =>
      columns.filter((c) =>
        isAnyOf<ColumnDataType>(c.type, ['option', 'multiOption']),
      ),
    [columns],
  )

  return (
    <>
      {cols.map((column) => {
        const filter = filters.find((f) => f.columnId === column.id)
        const options = column.getOptions()
        const optionsCount = column.getFacetedUniqueValues()

        function handleOptionSelect(value: string, check: boolean) {
          if (check) actions.addFilterValue(column, [value])
          else actions.removeFilterValue(column, [value])
        }

        return (
          <React.Fragment key={column.id}>
            {options.map((v) => {
              const checked = Boolean(filter?.values.includes(v.value))
              const count = optionsCount?.get(v.value) ?? 0

              return (
                <CommandItem
                  key={v.value}
                  value={v.value}
                  keywords={[v.label, v.value]}
                  onSelect={() => {
                    handleOptionSelect(v.value, !checked)
                  }}
                  className="group"
                >
                  <div className="flex items-center gap-1.5 group">
                    <Checkbox
                      checked={checked}
                      className="opacity-0 data-[state=checked]:opacity-100 group-data-[selected=true]:opacity-100 dark:border-ring mr-1"
                    />
                    <div className="flex items-center w-4 justify-center">
                      {v.icon &&
                        (isValidElement(v.icon) ? (
                          v.icon
                        ) : (
                          <v.icon className="size-4 text-primary" />
                        ))}
                    </div>
                    <div className="flex items-center gap-0.5">
                      <span className="text-muted-foreground">
                        {column.displayName}
                      </span>
                      <ChevronRightIcon className="size-3.5 text-muted-foreground/75" />
                      <span>
                        {v.label}
                        <sup
                          className={cn(
                            !optionsCount && 'hidden',
                            'ml-0.5 tabular-nums tracking-tight text-muted-foreground',
                            count === 0 && 'slashed-zero',
                          )}
                        >
                          {count < 100 ? count : '100+'}
                        </sup>
                      </span>
                    </div>
                  </div>
                </CommandItem>
              )
            })}
          </React.Fragment>
        )
      })}
    </>
  )
}

// Unit conversion types
export type Unit = {
  name: string
  factor?: number
}

export type Category = {
  name: string
  units: Record<string, Unit>
  allowNegative: boolean
  convert?: (value: number, from: string, to: string) => number
}

export type ConversionCategories = Record<string, Category>

export type CategoryKey = keyof ConversionCategories

export type ConversionResult = {
  value: string
  error: string | null
}

export type ConversionState = {
  category: CategoryKey
  fromUnit: string
  toUnit: string
  fromValue: string
  toValue: string
  error: string | null
}

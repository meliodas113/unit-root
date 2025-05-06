"use client"

import { useState, useEffect } from "react"
import type { CategoryKey, ConversionState } from "@/types/converter"
import { conversionCategories } from "@/lib/conversion-data"
import { convertValue, validateInput } from "@/lib/conversion-utils"
import { useDebounce } from "./use-debounce"

export function useConverter(initialCategory: CategoryKey = "length") {
  const [state, setState] = useState<ConversionState>({
    category: initialCategory,
    fromUnit: "",
    toUnit: "",
    fromValue: "",
    toValue: "",
    error: null,
  })

  // Add immediate validation state for UI feedback
  const [inputError, setInputError] = useState<string | null>(null)

  // Debounce the input value to prevent excessive calculations
  const debouncedFromValue = useDebounce(state.fromValue, 300)

  // Initialize units when category changes
  useEffect(() => {
    const units = Object.keys(conversionCategories[state.category].units)
    setState((prev) => ({
      ...prev,
      fromUnit: units[0],
      toUnit: units[1],
      fromValue: "",
      toValue: "",
      error: null,
    }))
    setInputError(null)
  }, [state.category])

  // Handle category change
  const setCategory = (category: CategoryKey) => {
    setState((prev) => ({
      ...prev,
      category,
    }))
  }

  // Handle unit changes
  const setFromUnit = (unit: string) => {
    setState((prev) => ({
      ...prev,
      fromUnit: unit,
    }))
  }

  const setToUnit = (unit: string) => {
    setState((prev) => ({
      ...prev,
      toUnit: unit,
    }))
  }

  // Handle input value change with immediate validation feedback
  const handleInputChange = (value: string) => {
    // Validate input immediately for UI feedback
    const { isValid, error } = validateInput(value, state.category)
    setInputError(error)

    setState((prev) => ({
      ...prev,
      fromValue: value,
    }))
  }

  // Perform conversion when debounced input changes
  useEffect(() => {
    if (state.fromUnit && state.toUnit && debouncedFromValue !== "") {
      // Skip conversion for just a minus sign
      if (debouncedFromValue === "-") {
        setState((prev) => ({
          ...prev,
          toValue: "",
          error: null,
        }))
        return
      }

      const result = convertValue(debouncedFromValue, state.category, state.fromUnit, state.toUnit)

      setState((prev) => ({
        ...prev,
        toValue: result.value,
        error: result.error,
      }))
    } else {
      setState((prev) => ({
        ...prev,
        toValue: "",
        error: debouncedFromValue === "" ? null : prev.error,
      }))
    }
  }, [state.category, state.fromUnit, state.toUnit, debouncedFromValue])

  // Swap units and values
  const handleSwap = () => {
    if (!state.error && state.toValue) {
      setState((prev) => ({
        ...prev,
        fromUnit: prev.toUnit,
        toUnit: prev.fromUnit,
        fromValue: prev.toValue,
        toValue: prev.fromValue,
      }))
    }
  }

  return {
    state,
    inputError, // Expose immediate validation error for UI
    setCategory,
    setFromUnit,
    setToUnit,
    handleInputChange,
    handleSwap,
  }
}

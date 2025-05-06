import type { ConversionResult } from "@/types/converter"
import { conversionCategories } from "./conversion-data"

// Validate input value
export function validateInput(value: string, category: string): { isValid: boolean; error: string | null } {
  // Allow empty input
  if (value === "") {
    return { isValid: true, error: null }
  }

  // Allow a single minus sign during typing
  if (value === "-") {
    return { isValid: true, error: null }
  }

  // Check if the input is a valid number format (allow negative, decimal)
  if (!/^-?\d*\.?\d*$/.test(value)) {
    return { isValid: false, error: "Please enter a valid number" }
  }

  const numValue = Number.parseFloat(value)

  // Check if the input is a valid number
  if (isNaN(numValue)) {
    return { isValid: false, error: "Please enter a valid number" }
  }

  // Check for extremely large numbers that might cause precision issues
  if (Math.abs(numValue) > 1e15) {
    return { isValid: false, error: "Value is too large for accurate conversion" }
  }

  // Check for negative values in categories that don't allow them
  if (numValue < 0 && !conversionCategories[category].allowNegative) {
    return { isValid: false, error: `Negative ${category} values are not valid` }
  }

  // Special handling for temperature absolute zero
  if (category === "temperature") {
    const fromUnit = Object.keys(conversionCategories.temperature.units)[0] // Default unit
    if (
      (fromUnit === "celsius" && numValue < -273.15) ||
      (fromUnit === "fahrenheit" && numValue < -459.67) ||
      (fromUnit === "kelvin" && numValue < 0)
    ) {
      return {
        isValid: false,
        error: `Value below absolute zero (-273.15°C, -459.67°F, or 0K)`,
      }
    }
  }

  return { isValid: true, error: null }
}

// Convert value between units
export function convertValue(value: string, category: string, fromUnit: string, toUnit: string): ConversionResult {
  // Skip conversion for empty input or just a minus sign
  if (value === "" || value === "-") {
    return { value: "", error: null }
  }

  try {
    const numValue = Number.parseFloat(value)

    // Validate input
    const { isValid, error } = validateInput(value, category)
    if (!isValid) {
      return { value: "", error }
    }

    // Special handling for temperature
    if (category === "temperature") {
      // Check for absolute zero violations
      if (
        (fromUnit === "celsius" && numValue < -273.15) ||
        (fromUnit === "fahrenheit" && numValue < -459.67) ||
        (fromUnit === "kelvin" && numValue < 0)
      ) {
        return {
          value: "",
          error: `Value below absolute zero (-273.15°C, -459.67°F, or 0K)`,
        }
      }

      const result = conversionCategories.temperature.convert!(numValue, fromUnit, toUnit)
      return { value: formatResult(result), error: null }
    }

    // Standard conversion for other categories
    const fromFactor = conversionCategories[category].units[fromUnit].factor!
    const toFactor = conversionCategories[category].units[toUnit].factor!

    // Check for division by zero
    if (toFactor === 0) {
      return { value: "", error: "Cannot convert to this unit (division by zero)" }
    }

    const result = (numValue * fromFactor) / toFactor

    // Check for overflow or NaN result
    if (!isFinite(result)) {
      return { value: "", error: "Conversion resulted in an invalid value" }
    }

    return { value: formatResult(result), error: null }
  } catch (err) {
    return { value: "", error: "Invalid conversion" }
  }
}

// Format the result based on the magnitude
export function formatResult(result: number): string {
  if (Math.abs(result) < 0.0001 && result !== 0) {
    return result.toExponential(4)
  } else if (Math.abs(result) >= 1e10) {
    return result.toExponential(4)
  } else {
    return result.toFixed(4).replace(/\.?0+$/, "")
  }
}

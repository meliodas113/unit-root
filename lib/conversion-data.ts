import type { ConversionCategories } from "@/types/converter"

// Conversion categories and their units
export const conversionCategories: ConversionCategories = {
  length: {
    name: "Length",
    units: {
      meter: { name: "Meter", factor: 1 },
      kilometer: { name: "Kilometer", factor: 1000 },
      centimeter: { name: "Centimeter", factor: 0.01 },
      millimeter: { name: "Millimeter", factor: 0.001 },
      mile: { name: "Mile", factor: 1609.34 },
      yard: { name: "Yard", factor: 0.9144 },
      foot: { name: "Foot", factor: 0.3048 },
      inch: { name: "Inch", factor: 0.0254 },
    },
    allowNegative: false,
  },
  weight: {
    name: "Weight",
    units: {
      kilogram: { name: "Kilogram", factor: 1 },
      gram: { name: "Gram", factor: 0.001 },
      milligram: { name: "Milligram", factor: 0.000001 },
      pound: { name: "Pound", factor: 0.453592 },
      ounce: { name: "Ounce", factor: 0.0283495 },
      ton: { name: "Metric Ton", factor: 1000 },
    },
    allowNegative: false,
  },
  temperature: {
    name: "Temperature",
    units: {
      celsius: { name: "Celsius" },
      fahrenheit: { name: "Fahrenheit" },
      kelvin: { name: "Kelvin" },
    },
    allowNegative: true,
    convert: (value: number, from: string, to: string) => {
      if (isNaN(value)) return 0

      // Convert to Celsius first
      let celsius = value
      if (from === "fahrenheit") {
        celsius = (value - 32) * (5 / 9)
      } else if (from === "kelvin") {
        celsius = value - 273.15
      }

      // Convert from Celsius to target unit
      if (to === "celsius") {
        return celsius
      } else if (to === "fahrenheit") {
        return celsius * (9 / 5) + 32
      } else if (to === "kelvin") {
        return celsius + 273.15
      }

      return value
    },
  },
  volume: {
    name: "Volume",
    units: {
      liter: { name: "Liter", factor: 1 },
      milliliter: { name: "Milliliter", factor: 0.001 },
      cubicMeter: { name: "Cubic Meter", factor: 1000 },
      gallon: { name: "Gallon (US)", factor: 3.78541 },
      quart: { name: "Quart (US)", factor: 0.946353 },
      pint: { name: "Pint (US)", factor: 0.473176 },
      cup: { name: "Cup (US)", factor: 0.236588 },
      fluidOunce: { name: "Fluid Ounce (US)", factor: 0.0295735 },
    },
    allowNegative: false,
  },
}

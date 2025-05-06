"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowRightLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"

// Conversion categories and their units
const conversionCategories = {
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
    // Temperature requires special conversion functions
    convert: (value: number, from: string, to: string) => {
      if (isNaN(value)) return ""

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

type CategoryKey = keyof typeof conversionCategories

export default function UnitConverter() {
  const [category, setCategory] = useState<CategoryKey>("length")
  const [fromUnit, setFromUnit] = useState<string>("")
  const [toUnit, setToUnit] = useState<string>("")
  const [fromValue, setFromValue] = useState<string>("")
  const [toValue, setToValue] = useState<string>("")
  const [error, setError] = useState<string>("")
  const [warning, setWarning] = useState<string>("")

  // Set default units when category changes
  useEffect(() => {
    const units = Object.keys(conversionCategories[category].units)
    setFromUnit(units[0])
    setToUnit(units[1])
    setFromValue("")
    setToValue("")
    setError("")
    setWarning("")
  }, [category])

  // Validate input as user types
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value

    // Allow empty input
    if (value === "") {
      setFromValue("")
      setError("")
      setWarning("")
      setToValue("")
      return
    }

    // Allow a single minus sign during typing
    if (value === "-") {
      setFromValue(value)
      setToValue("")
      // Don't show error for just a minus sign as it's incomplete input
      return
    }

    // Check if the input is a valid number format (allow negative, decimal)
    if (!/^-?\d*\.?\d*$/.test(value)) {
      setError("Please enter a valid number")
      setFromValue(value)
      setToValue("")
      return
    }

    // Valid number - update the value
    setFromValue(value)

    // Check for negative values in categories that don't typically allow them
    const numValue = Number.parseFloat(value)
    if (!isNaN(numValue) && numValue < 0) {
      if (!conversionCategories[category].allowNegative) {
        setError(`Negative ${category} values are not valid`)
        setToValue("")
        return
      }
    }

    // Clear any previous errors since the format is now valid
    setError("")
  }

  // Convert values when inputs change
  useEffect(() => {
    // Don't attempt conversion if there's an error
    if (error) {
      setToValue("")
      return
    }

    if (fromUnit && toUnit && fromValue !== "") {
      try {
        // Skip conversion for just a minus sign
        if (fromValue === "-") {
          setToValue("")
          return
        }

        const numValue = Number.parseFloat(fromValue)

        // Check if the input is a valid number
        if (isNaN(numValue)) {
          setError("Please enter a valid number")
          setToValue("")
          return
        }

        // Check for extremely large numbers that might cause precision issues
        if (Math.abs(numValue) > 1e15) {
          setError("Value is too large for accurate conversion")
          setToValue("")
          return
        }

        // Check for negative values in categories that don't allow them
        if (numValue < 0 && !conversionCategories[category].allowNegative) {
          setError(`Negative ${category} values are not valid`)
          setToValue("")
          return
        }

        // Special handling for temperature
        if (category === "temperature") {
          // Check for absolute zero violations
          if (
            (fromUnit === "celsius" && numValue < -273.15) ||
            (fromUnit === "fahrenheit" && numValue < -459.67) ||
            (fromUnit === "kelvin" && numValue < 0)
          ) {
            setError(`Value below absolute zero (-273.15°C, -459.67°F, or 0K)`)
            setToValue("")
            return
          }

          const result = conversionCategories.temperature.convert(numValue, fromUnit, toUnit)
          setToValue(result.toFixed(4).replace(/\.?0+$/, ""))
          return
        }

        // Standard conversion for other categories
        const fromFactor = conversionCategories[category].units[fromUnit].factor
        const toFactor = conversionCategories[category].units[toUnit].factor

        // Check for division by zero (shouldn't happen with our units, but just in case)
        if (toFactor === 0) {
          setError("Cannot convert to this unit (division by zero)")
          setToValue("")
          return
        }

        const result = (numValue * fromFactor) / toFactor

        // Check for overflow or NaN result
        if (!isFinite(result)) {
          setError("Conversion resulted in an invalid value")
          setToValue("")
          return
        }

        // Format the result based on the magnitude
        let formattedResult
        if (Math.abs(result) < 0.0001 && result !== 0) {
          formattedResult = result.toExponential(4)
        } else if (Math.abs(result) >= 1e10) {
          formattedResult = result.toExponential(4)
        } else {
          formattedResult = result.toFixed(4).replace(/\.?0+$/, "")
        }

        setToValue(formattedResult)
      } catch (err) {
        setError("Invalid conversion")
        setToValue("")
      }
    } else {
      setToValue("")
    }
  }, [category, fromUnit, toUnit, fromValue, error])

  // Swap units and values
  const handleSwap = () => {
    // Only swap if there's no error
    if (!error && toValue) {
      setFromUnit(toUnit)
      setToUnit(fromUnit)
      setFromValue(toValue)
      setToValue(fromValue)
    }
  }

  return (
    <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm rounded-xl overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-sky-500 to-indigo-500 pb-8 pt-6">
        <CardTitle className="text-center text-white text-2xl font-medium">
          {conversionCategories[category].name} Converter
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6 pt-6 px-6">
        {/* Category Selection */}
        <div className="space-y-2">
          <Label htmlFor="category" className="text-sm font-medium text-gray-700">
            Category
          </Label>
          <Select value={category} onValueChange={(value: CategoryKey) => setCategory(value)}>
            <SelectTrigger
              id="category"
              className="bg-white border-gray-200 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all"
            >
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(conversionCategories).map(([key, { name }]) => (
                <SelectItem key={key} value={key}>
                  {name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-[1fr,auto,1fr] gap-3 items-end">
          {/* From Unit */}
          <div className="space-y-2">
            <Label htmlFor="fromUnit" className="text-sm font-medium text-gray-700">
              From
            </Label>
            <Select value={fromUnit} onValueChange={setFromUnit}>
              <SelectTrigger
                id="fromUnit"
                className="bg-white border-gray-200 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all"
              >
                <SelectValue placeholder="Select unit" />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(conversionCategories[category].units).map(([key, { name }]) => (
                  <SelectItem key={key} value={key}>
                    {name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Swap Button */}
          <Button
            variant="outline"
            size="icon"
            className={`h-10 w-10 rounded-full border-gray-200 transition-all duration-200 ${
              !error && toValue
                ? "hover:bg-sky-50 hover:border-sky-200 hover:text-sky-600"
                : "opacity-50 cursor-not-allowed"
            }`}
            onClick={handleSwap}
            disabled={!!error || !toValue}
          >
            <ArrowRightLeft className="h-4 w-4" />
            <span className="sr-only">Swap units</span>
          </Button>

          {/* To Unit */}
          <div className="space-y-2">
            <Label htmlFor="toUnit" className="text-sm font-medium text-gray-700">
              To
            </Label>
            <Select value={toUnit} onValueChange={setToUnit}>
              <SelectTrigger
                id="toUnit"
                className="bg-white border-gray-200 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all"
              >
                <SelectValue placeholder="Select unit" />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(conversionCategories[category].units).map(([key, { name }]) => (
                  <SelectItem key={key} value={key}>
                    {name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Input Values */}
        <div className="grid grid-cols-[1fr,auto,1fr] gap-3 items-center">
          <div className="space-y-2">
            <Label htmlFor="fromValue" className="text-sm font-medium text-gray-700">
              Value
            </Label>
            <Input
              id="fromValue"
              type="text"
              value={fromValue}
              onChange={handleInputChange}
              placeholder="Enter value"
              className={`bg-white border-gray-200 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all ${
                error ? "border-red-300 focus:border-red-500 focus:ring-red-500" : ""
              }`}
              aria-invalid={error ? "true" : "false"}
              aria-describedby={error ? "input-error" : undefined}
            />
          </div>
          <div className="h-10 flex items-center justify-center">
            <span className="text-gray-400 font-medium">=</span>
          </div>
          <div className="space-y-2">
            <Label htmlFor="toValue" className="text-sm font-medium text-gray-700">
              Result
            </Label>
            <Input
              id="toValue"
              type="text"
              value={toValue}
              readOnly
              className="bg-gray-50 border-gray-200 text-gray-700 font-medium"
            />
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <Alert variant="destructive" className="mt-4 animate-in fade-in slide-in-from-top-1 duration-300">
            <AlertDescription id="input-error">{error}</AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  )
}

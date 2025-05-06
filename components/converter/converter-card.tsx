"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ArrowRightLeft, Loader2 } from "lucide-react"
import { CategorySelector } from "./category-selector"
import { UnitSelector } from "./unit-selector"
import { ValueInput } from "./value-input"
import { useConverter } from "@/hooks/use-converter"
import { conversionCategories } from "@/lib/conversion-data"
import { useState, useEffect } from "react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"

export function ConverterCard() {
  const { state, inputError, setCategory, setFromUnit, setToUnit, handleInputChange, handleSwap } = useConverter()
  const [isCalculating, setIsCalculating] = useState(false)

  // Show calculating indicator when input changes but before debounced value updates
  useEffect(() => {
    if (state.fromValue && !state.error) {
      setIsCalculating(true)
      const timer = setTimeout(() => {
        setIsCalculating(false)
      }, 350) // Slightly longer than debounce time
      return () => clearTimeout(timer)
    } else {
      setIsCalculating(false)
    }
  }, [state.fromValue, state.error])

  // Display either the debounced error or the immediate validation error
  const displayError = state.error || inputError

  return (
    <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm rounded-xl overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-sky-500 to-indigo-500 pb-8 pt-6">
        <CardTitle className="text-center text-white text-2xl font-medium">
          {conversionCategories[state.category].name} Converter
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6 pt-6 px-6">
        {/* Category Selection */}
        <CategorySelector value={state.category} onChange={setCategory} />

        <div className="grid grid-cols-[1fr,auto,1fr] gap-3 items-end">
          {/* From Unit */}
          <UnitSelector
            label="From"
            id="fromUnit"
            category={state.category}
            value={state.fromUnit}
            onChange={setFromUnit}
          />

          {/* Swap Button */}
          <Button
            variant="outline"
            size="icon"
            className={`h-10 w-10 rounded-full border-gray-200 transition-all duration-200 ${
              !displayError && state.toValue
                ? "hover:bg-sky-50 hover:border-sky-200 hover:text-sky-600"
                : "opacity-50 cursor-not-allowed"
            }`}
            onClick={handleSwap}
            disabled={!!displayError || !state.toValue}
          >
            <ArrowRightLeft className="h-4 w-4" />
            <span className="sr-only">Swap units</span>
          </Button>

          {/* To Unit */}
          <UnitSelector label="To" id="toUnit" category={state.category} value={state.toUnit} onChange={setToUnit} />
        </div>

        {/* Input Values */}
        <div className="grid grid-cols-[1fr,auto,1fr] gap-3 items-center">
          <ValueInput
            id="fromValue"
            label="Value"
            value={state.fromValue}
            onChange={handleInputChange}
            placeholder="Enter value"
            error={!!displayError}
          />

          <div className="h-10 flex items-center justify-center">
            <span className="text-gray-400 font-medium">=</span>
          </div>

          <div className="space-y-2 relative">
            <Label htmlFor="toValue" className="text-sm font-medium text-gray-700">
              Result
            </Label>
            <Input
              id="toValue"
              type="text"
              value={state.toValue}
              readOnly
              className="bg-gray-50 border-gray-200 text-gray-700 font-medium"
            />
            {isCalculating && (
              <div className="absolute right-3 top-[38px] transform -translate-y-1/2">
                <Loader2 className="h-4 w-4 text-gray-400 animate-spin" />
              </div>
            )}
          </div>
        </div>

        {/* Error Message */}
        {displayError && (
          <Alert variant="destructive" className="mt-4 animate-in fade-in slide-in-from-top-1 duration-300">
            <AlertDescription id="input-error">{displayError}</AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  )
}

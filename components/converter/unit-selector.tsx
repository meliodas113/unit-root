"use client"

import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { conversionCategories } from "@/lib/conversion-data"

interface UnitSelectorProps {
  label: string
  id: string
  category: string
  value: string
  onChange: (value: string) => void
}

export function UnitSelector({ label, id, category, value, onChange }: UnitSelectorProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id} className="text-sm font-medium text-gray-700">
        {label}
      </Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger
          id={id}
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
  )
}

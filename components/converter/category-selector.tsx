"use client"

import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { conversionCategories } from "@/lib/conversion-data"
import type { CategoryKey } from "@/types/converter"

interface CategorySelectorProps {
  value: CategoryKey
  onChange: (value: CategoryKey) => void
}

export function CategorySelector({ value, onChange }: CategorySelectorProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor="category" className="text-sm font-medium text-gray-700">
        Category
      </Label>
      <Select value={value} onValueChange={(value: CategoryKey) => onChange(value)}>
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
  )
}

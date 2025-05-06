"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2 } from "lucide-react"

interface ValueInputProps {
  id: string
  label: string
  value: string
  onChange?: (value: string) => void
  placeholder?: string
  readOnly?: boolean
  error?: boolean
  isLoading?: boolean
}

export function ValueInput({
  id,
  label,
  value,
  onChange,
  placeholder,
  readOnly = false,
  error = false,
  isLoading = false,
}: ValueInputProps) {
  return (
    <div className="space-y-2 relative">
      <Label htmlFor={id} className="text-sm font-medium text-gray-700">
        {label}
      </Label>
      <div className="relative">
        <Input
          id={id}
          type="text"
          value={value}
          onChange={onChange ? (e) => onChange(e.target.value) : undefined}
          placeholder={placeholder}
          readOnly={readOnly}
          className={`${
            readOnly
              ? "bg-gray-50 border-gray-200 text-gray-700 font-medium"
              : "bg-white border-gray-200 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all"
          } ${error ? "border-red-300 focus:border-red-500 focus:ring-red-500" : ""}`}
          aria-invalid={error ? "true" : "false"}
        />
        {isLoading && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <Loader2 className="h-4 w-4 text-gray-400 animate-spin" />
          </div>
        )}
      </div>
    </div>
  )
}

# Unit Converter App

A modern unit conversion application built with Next.js and Tailwind CSS that converts between different units of measurement in real-time.

## Approach

### Architecture

- **Types Layer**: TypeScript interfaces for type safety and documentation
- **Data Layer**: Conversion categories, units, and their properties
- **Utility Layer**: Pure functions for validation and conversion logic
- **Hook Layer**: Custom React hooks for state management
- **Component Layer**: UI components focused solely on rendering

### Business Logic

The core conversion logic is implemented through:

1. **Conversion Data Structure**:

   - Each category (length, weight, etc.) has a set of units
   - Units have conversion factors relative to a base unit
   - Temperature uses special conversion functions instead of factors

2. **Validation Logic**:

   - Input validation for numeric values
   - Category-specific validation (e.g., negative values not allowed for length)
   - Edge case handling (absolute zero for temperature, extremely large numbers)

3. **Conversion Process**:

   - For standard categories: Convert using multiplication/division with factors
   - For temperature: Use specific formulas for Celsius/Fahrenheit/Kelvin
   - Format results based on magnitude (standard notation vs. scientific)

4. **Performance Optimization**:
   - Debounced input to prevent excessive calculations
   - Separation of validation and conversion concerns

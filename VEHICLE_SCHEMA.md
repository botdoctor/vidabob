# Comprehensive Vehicle Schema

This document defines the unified vehicle schema used across both frontend and backend.

## Core Vehicle Information
- `id` (string) - Unique identifier
- `make` (string) - Vehicle manufacturer (e.g., "Toyota", "Nissan")
- `model` (string) - Vehicle model (e.g., "Camry", "Altima")
- `year` (number) - Model year
- `vin` (string, optional) - Vehicle Identification Number

## Categorization
- `category` (enum) - Primary category: sedan, suv, truck, coupe, hatchback, convertible, van, motorcycle
- `subcategory` (string, optional) - More specific classification (e.g., "compact", "full-size")
- `type` (enum) - Availability type: sale, rental, both

## Pricing
- `salePrice` (number, optional) - Sale price in USD
- `rentalPrice` (number, optional) - Daily rental price in USD
- `salePriceColones` (number, optional) - Sale price in CRC
- `rentalPriceColones` (number, optional) - Daily rental price in CRC
- `minRentalPrice` (number, optional) - Minimum price resellers can set

## Technical Specifications
- `engine` (object)
  - `fuel` (enum) - gasoline, diesel, hybrid, electric, hydrogen
  - `displacement` (number, optional) - Engine size in liters
  - `horsepower` (number, optional) - Engine power
  - `fuelCapacity` (number, optional) - Fuel tank capacity in gallons (0-200)
  - `mpg` (object, optional)
    - `city` (number) - City MPG
    - `highway` (number) - Highway MPG
    - `combined` (number) - Combined MPG
- `transmission` (enum) - manual, automatic, cvt
- `drivetrain` (enum, optional) - fwd, rwd, awd, 4wd
- `towingCapacity` (number, optional) - Maximum towing capacity in pounds (0-50,000)
- `seats` (number) - Number of seats
- `doors` (number, optional) - Number of doors

## Physical Attributes
- `mileage` (number) - Odometer reading in miles
- `color` (object)
  - `exterior` (string) - Exterior color
  - `interior` (string, optional) - Interior color
- `condition` (enum) - new, excellent, good, fair, poor
- `images` (array of strings) - Array of image URLs
- `primaryImage` (string) - Main display image URL

## Features & Equipment
- `features` (array of strings) - List of features/equipment
- `safetyFeatures` (array of strings, optional) - Safety-specific features
- `techFeatures` (array of strings, optional) - Technology features
- `packages` (array of strings, optional) - Option packages

## Availability & Status
- `status` (enum) - available, sold, reserved, maintenance, featured
- `available` (boolean) - Quick availability check
- `isFeatures` (boolean) - Featured on homepage
- `location` (string, optional) - Where vehicle is located

## Rental-Specific
- `bookedDates` (array of objects) - Rental booking dates
  - `start` (date) - Booking start date
  - `end` (date) - Booking end date
  - `bookingId` (string) - Reference to booking
- `minRentalDays` (number, optional) - Minimum rental period
- `maxRentalDays` (number, optional) - Maximum rental period

## Metadata
- `description` (string) - Detailed description
- `notes` (string, optional) - Internal notes
- `tags` (array of strings, optional) - Search tags
- `createdAt` (date) - Record creation date
- `updatedAt` (date) - Last modification date
- `createdBy` (string, optional) - User who created record
- `updatedBy` (string, optional) - User who last updated record

## SEO & Marketing
- `slug` (string, optional) - URL-friendly identifier
- `metaTitle` (string, optional) - SEO title
- `metaDescription` (string, optional) - SEO description
- `keywords` (array of strings, optional) - SEO keywords

## Validation Rules
- At least one of `salePrice` or `rentalPrice` must be provided
- If `type` is "sale", `salePrice` is required
- If `type` is "rental", `rentalPrice` is required
- `year` must be between 1900 and current year + 2
- `mileage` must be non-negative
- `seats` must be between 1 and 50
- Images must be valid URLs
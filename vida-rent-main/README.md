# Vida Motors CR - Car Rental Page

## Overview
This is a fully functional car rental booking system for Vida Motors CR. The page includes:
- 10 different vehicles across multiple categories (Economy, Compact, SUV, Luxury)
- Real-time availability tracking
- Interactive calendar for date selection
- Complete booking form with validation
- Persistent storage of bookings

## Files Created
1. **rent-page.html** - Main rental page with Bubble.io-inspired styling
2. **rent-page-script.js** - JavaScript functionality for booking system
3. **README.md** - This documentation file

## Features
- **Car Filtering**: Filter by category (Economy, Compact, SUV, Luxury) and price range
- **Calendar Integration**: Uses Flatpickr for date selection with blocked dates for existing bookings
- **Booking System**: Complete form with validation and confirmation
- **Availability Tracking**: Prevents double-booking of vehicles
- **Local Storage**: Bookings are saved locally (in production, this would use a database)
- **Responsive Design**: Works on desktop, tablet, and mobile devices

## How to Use
1. Open `rent-page.html` in a web browser
2. Browse available cars or use filters to narrow down options
3. Click "Rent Now" on any car to open the booking modal
4. Fill in your details and select rental dates
5. The system will show unavailable dates in the calendar
6. Submit the form to confirm your booking

## Admin Functions (for testing)
Open the browser console and use:
- `viewBookings()` - View all current bookings
- `clearBookings()` - Clear all bookings (with confirmation)

## Integration with Your Website
To integrate this with your existing vidamotorscr.com website:
1. Upload all files to your web server
2. Update the navigation links to match your site structure
3. Replace the sample car images with actual photos of your vehicles
4. Connect to a real backend/database for production use
5. Add payment processing integration

## Customization
- Car data is stored in the `cars` array in `rent-page-script.js`
- Styling matches your existing Bubble.io design system
- Colors use CSS variables for easy theme changes
- All text can be easily translated or modified

## Notes
- The booking data is currently stored in browser localStorage
- In production, you'll want to connect this to a proper backend API
- Email confirmations would be handled server-side in production
- Consider adding payment integration for deposits/full payment
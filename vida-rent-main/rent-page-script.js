// Car rental data
const cars = [
    {
        id: 1,
        name: "Tesla Model S",
        category: "economy",
        price: 45,
        image: "https://images.pexels.com/photos/2526127/pexels-photo-2526127.jpeg?auto=compress&cs=tinysrgb&w=600",
        seats: 5,
        transmission: "Automatic",
        fuel: "Gasoline",
        available: true,
        bookedDates: []
    },
    {
        id: 2,
        name: "VW Van",
        category: "suv",
        price: 75,
        image: "https://images.pexels.com/photos/2533092/pexels-photo-2533092.jpeg?auto=compress&cs=tinysrgb&w=600",
        seats: 7,
        transmission: "Automatic",
        fuel: "Gasoline",
        available: true,
        bookedDates: []
    },
    {
        id: 3,
        name: "Lamborghini Huracan",
        category: "luxury",
        price: 150,
        image: "https://images.pexels.com/photos/3802510/pexels-photo-3802510.jpeg?auto=compress&cs=tinysrgb&w=600",
        seats: 5,
        transmission: "Automatic",
        fuel: "Gasoline",
        available: true,
        bookedDates: []
    },
    {
        id: 4,
        name: "AMG GTR",
        category: "sport",
        price: 40,
        image: "https://images.pexels.com/photos/3729464/pexels-photo-3729464.jpeg?auto=compress&cs=tinysrgb&w=600",
        seats: 5,
        transmission: "Manual",
        fuel: "Gasoline",
        available: true,
        bookedDates: []
    },
    {
        id: 5,
        name: "Jeep Wrangler",
        category: "suv",
        price: 85,
        image: "https://images.pexels.com/photos/1638459/pexels-photo-1638459.jpeg?auto=compress&cs=tinysrgb&w=600",
        seats: 5,
        transmission: "Automatic",
        fuel: "Hybrid",
        available: true,
        bookedDates: []
    },
    {
        id: 6,
        name: "BMW 4 Series",
        category: "luxury",
        price: 175,
        image: "https://images.pexels.com/photos/892522/pexels-photo-892522.jpeg?auto=compress&cs=tinysrgb&w=600",
        seats: 5,
        transmission: "Automatic",
        fuel: "Gasoline",
        available: true,
        bookedDates: []
    },
    {
        id: 7,
        name: "Toyota Supra",
        category: "economy",
        price: 38,
        image: "https://images.pexels.com/photos/3874337/pexels-photo-3874337.jpeg?auto=compress&cs=tinysrgb&w=600",
        seats: 5,
        transmission: "Automatic",
        fuel: "Gasoline",
        available: true,
        bookedDates: []
    },
    {
        id: 8,
        name: "Toyota RAV4",
        category: "suv",
        price: 80,
        image: "https://images.pexels.com/photos/2036544/pexels-photo-2036544.jpeg?auto=compress&cs=tinysrgb&w=600",
        seats: 5,
        transmission: "Automatic",
        fuel: "Gasoline",
        available: true,
        bookedDates: []
    },
    {
        id: 9,
        name: "Dodge Charger",
        category: "compact",
        price: 50,
        image: "https://images.pexels.com/photos/3311574/pexels-photo-3311574.jpeg?auto=compress&cs=tinysrgb&w=600",
        seats: 5,
        transmission: "Automatic",
        fuel: "Gasoline",
        available: true,
        bookedDates: []
    },
    {
        id: 10,
        name: "Audi R8",
        category: "luxury",
        price: 165,
        image: "https://images.pexels.com/photos/1545743/pexels-photo-1545743.jpeg?auto=compress&cs=tinysrgb&w=600",
        seats: 5,
        transmission: "Automatic",
        fuel: "Gasoline",
        available: true,
        bookedDates: []
    }
];

// Initialize bookings from localStorage
let bookings = JSON.parse(localStorage.getItem('carBookings')) || [];

// Apply saved bookings to cars
bookings.forEach(booking => {
    const car = cars.find(c => c.id === booking.carId);
    if (car) {
        car.bookedDates.push({
            start: booking.pickupDate,
            end: booking.returnDate
        });
    }
});

// State variables
let selectedCar = null;
let pickupDatePicker = null;
let returnDatePicker = null;

// DOM elements (will be initialized after DOM loads)
let carsGrid, categoryFilter, priceFilter, bookingModal, bookingForm, closeModal;

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
    try {
        // Get DOM elements after page loads
        carsGrid = document.getElementById('carsGrid');
        categoryFilter = document.getElementById('categoryFilter');
        priceFilter = document.getElementById('priceFilter');
        bookingModal = document.getElementById('bookingModal');
        bookingForm = document.getElementById('bookingForm');
        closeModal = document.querySelector('.close');
        
        if (!carsGrid) {
            console.error('Cars grid container not found!');
            return;
        }
        
        // Initialize everything
        renderCars();
        initializeDatePickers();
        setupEventListeners();
    } catch (error) {
        console.error('Error initializing page:', error);
        // Try to render cars anyway
        if (carsGrid) {
            renderCarsDirectly();
        }
    }
});

// Direct render without filters as fallback
function renderCarsDirectly() {
    console.log('Direct render fallback...');
    if (!carsGrid) return;
    
    carsGrid.innerHTML = '';
    cars.forEach(car => {
        const carCard = createCarCard(car);
        carsGrid.appendChild(carCard);
    });
}

// Render cars based on filters
function renderCars() {
    console.log('Rendering cars...', cars.length, 'cars found');
    
    if (!carsGrid) {
        console.error('Cars grid not initialized');
        return;
    }
    
    const category = categoryFilter ? categoryFilter.value : 'all';
    const priceRange = priceFilter ? priceFilter.value : 'all';
    
    let filteredCars = cars.filter(car => {
        // Category filter
        if (category !== 'all' && car.category !== category) {
            return false;
        }
        
        // Price filter
        if (priceRange !== 'all') {
            const [min, max] = priceRange.split('-').map(Number);
            if (car.price < min || car.price > max) {
                return false;
            }
        }
        
        return true;
    });
    
    carsGrid.innerHTML = '';
    
    filteredCars.forEach(car => {
        const carCard = createCarCard(car);
        carsGrid.appendChild(carCard);
    });
    
    console.log('Rendered', filteredCars.length, 'cars');
}

// Create car card HTML
function createCarCard(car) {
    const div = document.createElement('div');
    div.className = 'car-card';
    div.innerHTML = `
        <img src="${car.image}" alt="${car.name}" class="car-image">
        <div class="car-details">
            <h3 class="car-name">${car.name}</h3>
            <div class="car-features">
                <div class="feature">
                    <span>🪑</span>
                    <span>${car.seats} Seats</span>
                </div>
                <div class="feature">
                    <span>⚙️</span>
                    <span>${car.transmission}</span>
                </div>
                <div class="feature">
                    <span>⛽</span>
                    <span>${car.fuel}</span>
                </div>
            </div>
            <div class="car-price">
                <div>
                    <div class="price-amount">$${car.price}</div>
                    <div class="price-period">per day</div>
                </div>
                <button class="rent-button" onclick="openBookingModal(${car.id})">Rent Now</button>
            </div>
        </div>
    `;
    return div;
}

// Initialize Flatpickr date pickers
function initializeDatePickers() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    pickupDatePicker = flatpickr("#pickupDate", {
        minDate: today,
        dateFormat: "Y-m-d",
        onChange: function(selectedDates) {
            if (selectedDates.length > 0) {
                returnDatePicker.set('minDate', selectedDates[0]);
                calculateTotal();
            }
        }
    });
    
    returnDatePicker = flatpickr("#returnDate", {
        minDate: today,
        dateFormat: "Y-m-d",
        onChange: function() {
            calculateTotal();
        }
    });
}

// Setup event listeners
function setupEventListeners() {
    categoryFilter.addEventListener('change', renderCars);
    priceFilter.addEventListener('change', renderCars);
    
    closeModal.addEventListener('click', closeBookingModal);
    
    window.addEventListener('click', function(event) {
        if (event.target === bookingModal) {
            closeBookingModal();
        }
    });
    
    bookingForm.addEventListener('submit', handleBookingSubmit);
}

// Open booking modal
function openBookingModal(carId) {
    selectedCar = cars.find(car => car.id === carId);
    
    if (!selectedCar) return;
    
    // Update modal with car info
    document.getElementById('modalCarImage').src = selectedCar.image;
    document.getElementById('modalCarName').textContent = selectedCar.name;
    document.getElementById('modalCarCategory').textContent = selectedCar.category.charAt(0).toUpperCase() + selectedCar.category.slice(1);
    document.getElementById('modalCarPrice').textContent = `$${selectedCar.price} per day`;
    document.getElementById('summaryDailyRate').textContent = `$${selectedCar.price}`;
    
    // Disable booked dates in calendar
    const disabledDates = [];
    selectedCar.bookedDates.forEach(booking => {
        const start = new Date(booking.start);
        const end = new Date(booking.end);
        for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
            disabledDates.push(new Date(d));
        }
    });
    
    pickupDatePicker.set('disable', disabledDates);
    returnDatePicker.set('disable', disabledDates);
    
    // Reset form
    bookingForm.reset();
    document.getElementById('successMessage').style.display = 'none';
    bookingForm.style.display = 'block';
    
    // Show modal
    bookingModal.style.display = 'block';
}

// Close booking modal
function closeBookingModal() {
    bookingModal.style.display = 'none';
    selectedCar = null;
}

// Calculate total cost
function calculateTotal() {
    if (!selectedCar) return;
    
    const pickupDate = pickupDatePicker.selectedDates[0];
    const returnDate = returnDatePicker.selectedDates[0];
    
    if (pickupDate && returnDate) {
        const days = Math.ceil((returnDate - pickupDate) / (1000 * 60 * 60 * 24)) + 1;
        const total = days * selectedCar.price;
        
        document.getElementById('summaryDays').textContent = days;
        document.getElementById('summaryTotal').textContent = `$${total}`;
    }
}

// Handle booking form submission
function handleBookingSubmit(event) {
    event.preventDefault();
    
    if (!selectedCar) return;
    
    // Get form data
    const formData = new FormData(bookingForm);
    const booking = {
        id: Date.now(),
        carId: selectedCar.id,
        carName: selectedCar.name,
        fullName: formData.get('fullName'),
        email: formData.get('email'),
        phone: formData.get('phone'),
        pickupDate: formData.get('pickupDate'),
        returnDate: formData.get('returnDate'),
        pickupTime: formData.get('pickupTime'),
        notes: formData.get('notes'),
        totalCost: document.getElementById('summaryTotal').textContent,
        bookingDate: new Date().toISOString()
    };
    
    // Check if dates are available
    if (isDateRangeAvailable(selectedCar, booking.pickupDate, booking.returnDate)) {
        // Save booking
        bookings.push(booking);
        localStorage.setItem('carBookings', JSON.stringify(bookings));
        
        // Update car's booked dates
        selectedCar.bookedDates.push({
            start: booking.pickupDate,
            end: booking.returnDate
        });
        
        // Show success message
        bookingForm.style.display = 'none';
        document.getElementById('successMessage').style.display = 'block';
        
        // Close modal after 3 seconds
        setTimeout(() => {
            closeBookingModal();
            renderCars(); // Refresh the car list
        }, 3000);
        
        // Send confirmation email (in real app, this would be server-side)
        console.log('Booking confirmed:', booking);
        
    } else {
        alert('Sorry, the selected dates are not available for this vehicle. Please choose different dates.');
    }
}

// Check if date range is available
function isDateRangeAvailable(car, startDate, endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    for (let booking of car.bookedDates) {
        const bookingStart = new Date(booking.start);
        const bookingEnd = new Date(booking.end);
        
        // Check for overlap
        if ((start <= bookingEnd && end >= bookingStart)) {
            return false;
        }
    }
    
    return true;
}

// Admin function to view all bookings (for testing)
window.viewBookings = function() {
    console.log('All bookings:', bookings);
    return bookings;
}

// Admin function to clear all bookings (for testing)
window.clearBookings = function() {
    if (confirm('Are you sure you want to clear all bookings?')) {
        bookings = [];
        localStorage.removeItem('carBookings');
        cars.forEach(car => car.bookedDates = []);
        renderCars();
        console.log('All bookings cleared');
    }
}
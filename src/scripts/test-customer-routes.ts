import { fetch } from 'undici'

const BASE_URL = 'http://localhost:4001'
let customerToken = ''
let dealerToken = ''
let customerId = ''
let carId = ''
let bookingId = ''

const logStep = (step: string) => {
  console.log(`\n--- ${step} ---`)
}

const logResponse = (label: string, data: any) => {
  console.log(`${label}:`, JSON.stringify(data, null, 2))
}

async function parseResponse(res: any) {
  const text = await res.text()
  try {
    return JSON.parse(text)
  } catch (e) {
    console.error('Failed to parse JSON:', text)
    throw e
  }
}

async function test() {
  try {
    // --- SETUP: Dealer & Car ---
    logStep('0. Setup: Register Dealer')
    const dealerData = {
      name: 'Test Dealer',
      email: `testdealer_${Date.now()}@example.com`,
      password: 'password123',
      phone: `12345${Date.now().toString().slice(-5)}`,
      dealershipName: 'Best Cars',
      dealershipLocation: 'Downtown',
    }
    const dealerRegRes = await fetch(`${BASE_URL}/auth/register/dealer`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dealerData),
    })
    const dealerRegJson: any = await parseResponse(dealerRegRes)
    logResponse('Dealer Register Response', dealerRegJson)

    logStep('0. Setup: Login Dealer')
    const dealerLoginRes = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: dealerData.email,
        password: dealerData.password,
      }),
    })
    const dealerLoginJson: any = await parseResponse(dealerLoginRes)
    logResponse('Dealer Login Response', dealerLoginJson)
    dealerToken = dealerLoginJson.accessToken

    logStep('0. Setup: Create Car')
    const carData = {
      brand: 'Toyota',
      model: 'Camry',
      year: 2023,
      price: 30000,
      specs: {
        color: 'Blue',
        transmission: 'Automatic',
      },
    }
    const carRes = await fetch(`${BASE_URL}/dealer/cars`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${dealerToken}`,
      },
      body: JSON.stringify(carData),
    })
    const carJson: any = await parseResponse(carRes)
    logResponse('Create Car Response', carJson)
    carId = carJson._id

    logStep('0. Setup: Create Slot')
    const startTime = new Date()
    startTime.setHours(startTime.getHours() + 24) // Tomorrow
    const endTime = new Date(startTime)
    endTime.setHours(endTime.getHours() + 2) // 2 hours duration

    const slotRes = await fetch(`${BASE_URL}/dealer/cars/${carId}/slots`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${dealerToken}`,
      },
      body: JSON.stringify({ startTime, endTime }),
    })
    const slotJson: any = await parseResponse(slotRes)
    logResponse('Create Slot Response', slotJson)

    // --- CUSTOMER TESTS ---

    // 1. Register Customer
    logStep('1. Register Customer')
    const registerData = {
      email: `testcustomer_${Date.now()}@example.com`,
      password: 'password123',
      name: 'Test Customer',
      phone: `12345${Date.now().toString().slice(-5)}`,
    }
    const registerRes = await fetch(`${BASE_URL}/auth/register/customer`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(registerData),
    })
    const registerJson: any = await parseResponse(registerRes)
    logResponse('Register Response', registerJson)

    // 2. Login
    logStep('2. Login')
    const loginRes = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: registerData.email,
        password: registerData.password,
      }),
    })
    const loginJson: any = await parseResponse(loginRes)
    logResponse('Login Response', loginJson)
    customerToken = loginJson.accessToken
    if (!customerToken) throw new Error('No access token received')

    // 3. Get Profile
    logStep('3. Get Profile')
    const profileRes = await fetch(`${BASE_URL}/customer/me`, {
      headers: { Authorization: `Bearer ${customerToken}` },
    })
    const profileJson: any = await parseResponse(profileRes)
    logResponse('Get Profile Response', profileJson)
    customerId = profileJson._id

    // 4. Update Profile
    logStep('4. Update Profile')
    const updateRes = await fetch(`${BASE_URL}/customer/me`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${customerToken}`,
      },
      body: JSON.stringify({ firstName: 'Updated Name' }), // Note: API uses name, but let's see if it accepts partial updates or if I need to send 'name'
    })
    // Checking updateCustomerProfile in service... it takes partial updates.
    // But user schema has 'name'. If I send 'firstName', it might be ignored or fail if strict.
    // Let's send 'name' to be safe.
    const updateResCorrect = await fetch(`${BASE_URL}/customer/me`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${customerToken}`,
      },
      body: JSON.stringify({ name: 'Updated Name' }),
    })

    const updateJson: any = await parseResponse(updateResCorrect)
    logResponse('Update Profile Response', updateJson)

    // 5. List Cars
    logStep('5. List Cars')
    const carsRes = await fetch(`${BASE_URL}/customer/cars`, {
      headers: { Authorization: `Bearer ${customerToken}` },
    })
    const carsJson: any = await parseResponse(carsRes)
    logResponse('List Cars Response', carsJson)

    // We already have carId from setup, but let's verify we can find it
    if (carsJson.data && carsJson.data.length > 0) {
      console.log(`Found ${carsJson.data.length} cars.`)
    } else {
      console.log('No cars found in list (unexpected).')
    }

    if (carId) {
      // 6. Get Car Details
      logStep('6. Get Car Details')
      const carRes = await fetch(`${BASE_URL}/customer/cars/${carId}`, {
        headers: { Authorization: `Bearer ${customerToken}` },
      })
      const carJson: any = await parseResponse(carRes)
      logResponse('Get Car Details Response', carJson)

      // 7. Get Available Slots
      logStep('7. Get Available Slots')
      const slotsRes = await fetch(`${BASE_URL}/customer/cars/${carId}/slots`, {
        headers: { Authorization: `Bearer ${customerToken}` },
      })
      const slotsJson: any = await parseResponse(slotsRes)
      logResponse('Get Slots Response', slotsJson)

      if (slotsJson.slots && slotsJson.slots.length > 0) {
        const availabilityId = slotsJson.slots[0]._id

        // 8. Create Booking
        logStep('8. Create Booking')
        const bookingRes = await fetch(`${BASE_URL}/customer/bookings`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${customerToken}`,
          },
          body: JSON.stringify({ carId, availabilityId }),
        })
        const bookingJson: any = await parseResponse(bookingRes)
        logResponse('Create Booking Response', bookingJson)
        if (bookingJson.booking) {
          bookingId = bookingJson.booking._id
        }
      } else {
        console.log('No slots available for this car (unexpected).')
      }
    }

    // 9. List Bookings
    logStep('9. List Bookings')
    const bookingsRes = await fetch(`${BASE_URL}/customer/bookings`, {
      headers: { Authorization: `Bearer ${customerToken}` },
    })
    const bookingsJson: any = await parseResponse(bookingsRes)
    logResponse('List Bookings Response', bookingsJson)

    if (bookingId) {
      // 10. Get Booking By ID
      logStep('10. Get Booking By ID')
      const bookingByIdRes = await fetch(
        `${BASE_URL}/customer/bookings/${bookingId}`,
        {
          headers: { Authorization: `Bearer ${customerToken}` },
        },
      )
      const bookingByIdJson: any = await parseResponse(bookingByIdRes)
      logResponse('Get Booking By ID Response', bookingByIdJson)

      // 11. Cancel Booking
      logStep('11. Cancel Booking')
      const cancelRes = await fetch(
        `${BASE_URL}/customer/bookings/${bookingId}/cancel`,
        {
          method: 'PATCH',
          headers: { Authorization: `Bearer ${customerToken}` },
        },
      )
      const cancelJson: any = await parseResponse(cancelRes)
      logResponse('Cancel Booking Response', cancelJson)
    }
  } catch (error) {
    console.error('Test failed:', error)
  }
}

test()

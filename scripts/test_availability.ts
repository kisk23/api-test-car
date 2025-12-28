/**
 * Test script for car availability and booking functionality
 * 
 * Run with: npx ts-node scripts/test_availability.ts
 * 
 * This script tests:
 * 1. Creating test data (dealer, car, availability slots)
 * 2. Checking car availability for a specific date
 * 3. Booking a car if it's available at a specific time
 */

import { request as undiciRequest } from 'undici'

const BASE_URL = 'http://localhost:4000'

// Helper function to make HTTP requests
async function request(method: string, path: string, body: any = null, token: string | null = null) {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  }
  
  if (token) {
    headers['Cookie'] = `token=${token}`
  }

  const options: any = {
    method,
    headers,
  }

  if (body) {
    options.body = JSON.stringify(body)
  }

  const response = await undiciRequest(`${BASE_URL}${path}`, options)
  const data = await response.body.json()
  
  return { status: response.statusCode, data }
}


async function main() {
  console.log('🚀 Starting Car Availability and Booking Test\n')

  // Step 1: Register a dealer
  console.log('📝 Step 1: Registering dealer...')
  const dealerData = {
    name: 'Test Dealer',
    email: `dealer_${Date.now()}@test.com`,
    phone: `+1555${Math.floor(Math.random() * 10000000)}`,
    password: 'password123',
    dealershipName: 'Premium Cars Inc',
    dealershipLocation: 'New York'
  }

  const dealerRegister = await request('POST', '/auth/dealer/register', dealerData)
  if (dealerRegister.status !== 201) {
    console.error('❌ Failed to register dealer:', dealerRegister.data)
    return
  }
  console.log('✅ Dealer registered successfully')

  // Step 2: Login as dealer
  console.log('\n📝 Step 2: Logging in as dealer...')
  const dealerLogin = await request('POST', '/auth/dealer/login', {
    email: dealerData.email,
    password: dealerData.password
  })
  
  if (dealerLogin.status !== 200) {
    console.error('❌ Failed to login dealer:', dealerLogin.data)
    return
  }
  
  const dealerToken = dealerLogin.data.token
  console.log('✅ Dealer logged in successfully')

  // Step 3: Create a car
  console.log('\n📝 Step 3: Creating a car...')
  const carData = {
    brand: 'Tesla',
    model: 'Model 3',
    year: 2024,
    price: 45000,
    specs: {
      engine: 'Electric',
      transmission: 'Automatic',
      fuelType: 'Electric',
      horsepower: 283,
      color: 'Pearl White'
    },
    features: ['Autopilot', 'Premium Sound System', 'Glass Roof']
  }

  const carCreate = await request('POST', '/dealer/cars', carData, dealerToken)
  if (carCreate.status !== 201) {
    console.error('❌ Failed to create car:', carCreate.data)
    return
  }
  
  const carId = carCreate.data.car._id
  console.log(`✅ Car created successfully (ID: ${carId})`)

  // Step 4: Create availability slots for tomorrow
  console.log('\n📝 Step 4: Creating availability slots...')
  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  tomorrow.setHours(0, 0, 0, 0)
  
  const dateStr = tomorrow.toISOString().split('T')[0]
  
  // Create slots for 9:00, 10:00, and 14:00
  const timeslots = [9, 10, 14]
  
  for (const hour of timeslots) {
    const startTime = new Date(tomorrow)
    startTime.setHours(hour, 0, 0, 0)
    
    const endTime = new Date(startTime)
    endTime.setHours(hour + 1, 0, 0, 0)
    
    const slotData = {
      carId,
      startTime: startTime.toISOString(),
      endTime: endTime.toISOString()
    }
    
    const slotCreate = await request('POST', '/dealer/cars/create-avail-slot', slotData, dealerToken)
    if (slotCreate.status !== 201) {
      console.error(`❌ Failed to create slot for ${hour}:00:`, slotCreate.data)
    } else {
      console.log(`✅ Created availability slot for ${hour}:00`)
    }
  }

  // Step 5: Register a customer
  console.log('\n📝 Step 5: Registering customer...')
  const customerData = {
    name: 'Test Customer',
    email: `customer_${Date.now()}@test.com`,
    phone: `+1666${Math.floor(Math.random() * 10000000)}`,
    password: 'password123'
  }

  const customerRegister = await request('POST', '/auth/customer/register', customerData)
  if (customerRegister.status !== 201) {
    console.error('❌ Failed to register customer:', customerRegister.data)
    return
  }
  console.log('✅ Customer registered successfully')

  // Step 6: Login as customer
  console.log('\n📝 Step 6: Logging in as customer...')
  const customerLogin = await request('POST', '/auth/customer/login', {
    email: customerData.email,
    password: customerData.password
  })
  
  if (customerLogin.status !== 200) {
    console.error('❌ Failed to login customer:', customerLogin.data)
    return
  }
  
  const customerToken = customerLogin.data.token
  console.log('✅ Customer logged in successfully')

  // Step 7: Check car availability for specific date
  console.log(`\n📝 Step 7: Checking availability for ${dateStr}...`)
  const availabilityCheck = await request('GET', `/customer/cars/${carId}/availability?date=${dateStr}`, null, customerToken)
  
  if (availabilityCheck.status !== 200) {
    console.error('❌ Failed to check availability:', availabilityCheck.data)
    return
  }
  
  console.log('✅ Availability retrieved successfully:')
  console.log(JSON.stringify(availabilityCheck.data, null, 2))
  
  // Find an available slot
  const availableSlots = availabilityCheck.data.filter((slot: any) => slot.available)
  if (availableSlots.length === 0) {
    console.error('❌ No available slots found')
    return
  }
  
  const selectedTime = availableSlots[0].time
  console.log(`\n✅ Found available slot at ${selectedTime}`)

  // Step 8: Book the car for the available time
  console.log(`\n📝 Step 8: Booking car for ${dateStr} at ${selectedTime}...`)
  const bookingData = {
    date: dateStr,
    time: selectedTime
  }
  
  const booking = await request('POST', `/customer/cars/${carId}/book`, bookingData, customerToken)
  
  if (booking.status !== 201) {
    console.error('❌ Failed to book car:', booking.data)
    return
  }
  
  console.log('✅ Car booked successfully!')
  console.log(JSON.stringify(booking.data, null, 2))

  // Step 9: Check availability again to verify the slot is now booked
  console.log(`\n📝 Step 9: Checking availability again after booking...`)
  const availabilityCheck2 = await request('GET', `/customer/cars/${carId}/availability?date=${dateStr}`, null, customerToken)
  
  if (availabilityCheck2.status !== 200) {
    console.error('❌ Failed to check availability:', availabilityCheck2.data)
    return
  }
  
  console.log('✅ Availability after booking:')
  console.log(JSON.stringify(availabilityCheck2.data, null, 2))
  
  const bookedSlot = availabilityCheck2.data.find((slot: any) => slot.time === selectedTime)
  if (bookedSlot && !bookedSlot.available) {
    console.log(`\n✅ Verified: ${selectedTime} is now marked as unavailable`)
  } else {
    console.log(`\n⚠️  Warning: ${selectedTime} is still showing as available`)
  }

  // Step 10: Try to book the same slot again (should fail)
  console.log(`\n📝 Step 10: Attempting to book the same slot again (should fail)...`)
  const duplicateBooking = await request('POST', `/customer/cars/${carId}/book`, bookingData, customerToken)
  
  if (duplicateBooking.status !== 201) {
    console.log('✅ Correctly rejected duplicate booking:', duplicateBooking.data.message || duplicateBooking.data)
  } else {
    console.log('⚠️  Warning: Duplicate booking was allowed (this should not happen)')
  }

  console.log('\n🎉 Test completed successfully!')
}

main().catch(console.error)

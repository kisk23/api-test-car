rotate refresh token .........> todo 


1. Profile Management
Needed endpoints:

GET /users/me
Return user profile: name, phone, email, role, dealership info (if dealer).

PATCH /users/me
Update:

name

phone

timezone

avatar

dealershipName / dealershipLocation (dealer only)

Why you need it:

User must manage their data before booking test drives.

2. User → Car Browsing History / Favorites (optional but common)

Not required, but almost every booking platform supports:

POST /users/me/favorites/:carId

DELETE /users/me/favorites/:carId

GET /users/me/favorites

Useful for frontend UX.

3. User → Booking (Rent/Test-Drive) Logic

THIS is what you were asking for.

A user must be able to:

Browse cars (GET /cars)

View availability (GET /cars/:id/availability)

Create booking (POST /bookings)

Modify booking (PATCH /bookings/:id)

Cancel booking (DELETE /bookings/:id)

View all their bookings (GET /users/me/bookings)

So your user.service needs functions like:
getUserBookings(userId: string)
createBooking(userId: string, carId: string, slotStart: Date, slotEnd: Date)
cancelBooking(userId: string, bookingId: string)
updateBooking(userId: string, bookingId: string, newSlot: {...})


(Business rules below ⬇️)

4. Dealer-Specific User Logic

If user.role === "dealer", they must be able to:

Add car

Remove car

Edit car details

Set availability slots

View all bookings for their cars

Approve / Decline bookings (optional workflow)

Endpoints needed:

POST   /dealer/cars
PATCH  /dealer/cars/:carId
DELETE /dealer/cars/:carId
POST   /dealer/cars/:carId/availability
GET    /dealer/bookings
PATCH  /dealer/bookings/:bookingId/status

5. Admin User Logic

Admin must be able to:

List users

Change user role

Deactivate user

See system stats (cars, dealers, bookings)

Endpoints:

GET    /admin/users
PATCH  /admin/users/:id/role
PATCH  /admin/users/:id/deactivate
GET    /admin/stats

6. User Ratings & Test-Drive Feedback

After driving, user should be able to:

Rate the car or dealer

Leave feedback

Endpoints:

POST /bookings/:id/review
GET  /cars/:id/reviews

7. Notifications (Email/SMS)

You must implement for the user:

receive booking confirmation

receive cancellation notice

reminders before test drive

dealer confirmation or rejection

Service functions:

sendBookingConfirmation(user, booking)
sendBookingReminder(user, booking)
sendBookingCancelled(user, booking)

8. User Status Control

Useful business logic:

deactivate account

delete account

update lastLoginAt

verify email/phone (optional)

Endpoints:

DELETE /users/me   → delete account
PATCH  /users/me/deactivate

9. User Analytics / Dashboard Data

For customer dashboard:

Number of completed bookings

Upcoming bookings

Last visited dealership

Recently viewed cars

Service functions:

getUserDashboardStats(userId)

SUMMARY — What you actually need to add
Required
Customer

✔ Profile update
✔ View cars
✔ View availability
✔ Create booking
✔ Modify booking
✔ Cancel booking
✔ View their bookings
✔ Leave review

Dealer

✔ Add/edit/delete cars
✔ Set availability
✔ View bookings for their cars
✔ Approve/decline
✔ View stats

Admin

✔ Manage users
✔ Manage dealers
✔ View platform stats

Shared

✔ Notifications
✔ Account deactivation
✔ Dashboard stats
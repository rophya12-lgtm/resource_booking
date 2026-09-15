// Convert 24-hour time to AM/PM
function formatTime(time) {

    let parts = time.split(":");

    let hour = parseInt(parts[0]);
    let minute = parts[1];

    let period = hour >= 12 ? "PM" : "AM";

    if (hour === 0) {
        hour = 12;
    } 
    else if (hour > 12) {
        hour = hour - 12;
    }

    return hour + ":" + minute + " " + period;
}


// Book Resource
function bookResource() {

    let department =
        document.getElementById("department").value;

    let resource =
        document.getElementById("resource").value;

    let date =
        document.getElementById("date").value;

    let start =
        document.getElementById("start").value;

    let end =
        document.getElementById("end").value;

    let purpose =
        document.getElementById("purpose").value;


    // Check empty fields
    if (
        department === "" ||
        resource === "" ||
        date === "" ||
        start === "" ||
        end === "" ||
        purpose === ""
    ) {

        alert("Please fill all the details.");

        return;
    }


    // Check time
    if (start >= end) {

        alert("End time must be later than Start time.");

        return;
    }


    // Get previous bookings
    let bookings =
        JSON.parse(localStorage.getItem("bookings")) || [];


    // Check already booked
    let alreadyBooked = bookings.some(function(booking) {

        if (
            booking.resource === resource &&
            booking.date === date
        ) {

            // Check overlapping time
            if (
                start < booking.end &&
                end > booking.start
            ) {
                return true;
            }
        }

        return false;

    });


    // Already booked message
    if (alreadyBooked) {

        document.getElementById("result").innerHTML = `

            <div class="already-booked">

                <h3>🔴 Already Booked</h3>

                <p>
                    <b>${resource}</b> is already booked
                    for the selected date and time.
                </p>

                <p>
                    Please select another time or resource.
                </p>

            </div>

        `;

        alert(
            "This resource is already booked!"
        );

        return;
    }


    // Create booking
    let newBooking = {

        department: department,

        resource: resource,

        date: date,

        start: start,

        end: end,

        purpose: purpose

    };


    // Add booking
    bookings.push(newBooking);


    // Save booking
    localStorage.setItem(
        "bookings",
        JSON.stringify(bookings)
    );


    // Display bookings
    displayBookings();


    alert(
        "Booking confirmed successfully!"
    );


    // Clear form
    document.getElementById("resource").value = "";

    document.getElementById("date").value = "";

    document.getElementById("start").value = "";

    document.getElementById("end").value = "";

    document.getElementById("purpose").value = "";
}



// Display all bookings
function displayBookings() {

    let bookings =
        JSON.parse(localStorage.getItem("bookings")) || [];

    let result =
        document.getElementById("result");


    if (bookings.length === 0) {

        result.innerHTML =
            "No booking yet.";

        return;
    }


    result.innerHTML = "";


    bookings.forEach(function(booking, index) {

        result.innerHTML += `

            <div class="booking">

                <h3>
                    Booking ${index + 1} ✅
                </h3>

                <p>
                    <b>Department:</b>
                    ${booking.department}
                </p>

                <p>
                    <b>Resource:</b>
                    ${booking.resource}
                </p>

                <p>
                    <b>Date:</b>
                    ${booking.date}
                </p>

                <p>
                    <b>Time:</b>
                    ${formatTime(booking.start)}
                    -
                    ${formatTime(booking.end)}
                </p>

                <p>
                    <b>Purpose:</b>
                    ${booking.purpose}
                </p>

            </div>

        `;
    });
}


// Load saved bookings
window.onload = function() {

    displayBookings();

};

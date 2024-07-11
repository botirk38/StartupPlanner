
// Luhn algorithm for validating card numbers
function luhnCheck(cardNumber: string): boolean {
  let sum = 0;
  let isEven = false;

  for (let i = cardNumber.length - 1; i >= 0; i--) {
    let digit = parseInt(cardNumber.charAt(i), 10);

    if (isEven) {
      digit *= 2;
      if (digit > 9) {
        digit -= 9;
      }
    }

    sum += digit;
    isEven = !isEven;
  }

  return sum % 10 === 0;
}

export function isValidCardNumber(cardNumber: string): boolean {
  const sanitizedNumber = cardNumber.replace(/\s+/g, '');

  // Check if the card number contains only digits
  if (!/^\d+$/.test(sanitizedNumber)) {
    return false;
  }

  // Check if the length is between 13 and 19 digits
  if (sanitizedNumber.length < 13 || sanitizedNumber.length > 19) {
    return false;
  }

  // Perform Luhn algorithm check
  return luhnCheck(sanitizedNumber);
}

export function isValidExpiryDate(expiryDate: string): boolean {
  const [month, year] = expiryDate.split('/');

  if (!month || !year || month.length !== 2 || year.length !== 2) {
    return false;
  }

  const currentDate = new Date();
  const currentYear = currentDate.getFullYear() % 100; // Get last two digits of current year
  const currentMonth = currentDate.getMonth() + 1; // getMonth() returns 0-11

  const expMonth = parseInt(month, 10);
  const expYear = parseInt(year, 10);

  if (expMonth < 1 || expMonth > 12) {
    return false;
  }

  if (expYear < currentYear || (expYear === currentYear && expMonth < currentMonth)) {
    return false;
  }

  return true;
}

export function isValidCVC(cvc: string): boolean {
  // CVC should be 3 or 4 digits
  return /^[0-9]{3,4}$/.test(cvc);
}


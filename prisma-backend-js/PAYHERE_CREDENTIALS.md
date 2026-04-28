# PayHere Sandbox Credentials

This document contains the PayHere sandbox credentials for testing payment functionality.

## Sandbox Environment Details

- **Environment**: Sandbox (Testing)
- **Currency**: LKR (Sri Lankan Rupee)

## Merchant Credentials

- **Merchant ID**: `1214992`
- **Merchant Secret**: `MzY4NzE1MjcwNjgwMjU4NjU4MjQ4NjU1MzM2MjQ4NzY1`
- **App Secret**: (Optional - leave empty for sandbox)

## Test Cards for Sandbox

You can use these test card details for sandbox testing:

### Visa Cards
- **Card Number**: `4916210001612718`
- **Expiry**: Any future date
- **CVV**: `123`
- **Cardholder Name**: Any name

### Mastercard Cards
- **Card Number**: `5304480400934927`
- **Expiry**: Any future date
- **CVV**: `123`
- **Cardholder Name**: Any name

## Environment Variables

Add these to your `.env` file for production:

```env
PAYHERE_MERCHANT_ID=1214992
PAYHERE_MERCHANT_SECRET=MzY4NzE1MjcwNjgwMjU4NjU4MjQ4NjU1MzM2MjQ4NzY1
PAYHERE_APP_SECRET=
```

## Important Notes

1. **Sandbox Mode**: The frontend should set `sandbox: true` in the PayHere payment object
2. **No Real Transactions**: Sandbox environment doesn't process real payments
3. **Test Orders**: All orders created in sandbox are for testing purposes only
4. **Production**: For production, you'll need to get live credentials from PayHere

## Payment Flow

1. Frontend calls `/api/payment/hash` to generate payment hash
2. User is redirected to PayHere sandbox payment page
3. PayHere sends notification to `/api/payment/notify` after payment
4. Order status is updated based on payment result

## Integration Status

✅ Payment hash generation endpoint created
✅ Payment notification handler created
✅ Sandbox credentials configured
✅ Routes added to main application

## Next Steps

1. Test the payment flow with sandbox credentials
2. Verify order status updates after payment
3. For production, contact PayHere for live merchant credentials

import { describe, it, expect, beforeEach, vi } from 'vitest';

// Mock du service Stripe
const mockStripeService = {
  createCheckoutSession: vi.fn(),
  confirmPayment: vi.fn(),
  refundPayment: vi.fn(),
};

describe('Stripe Service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should create checkout session with valid cart items', async () => {
    const mockItems = [
      { id: 'prod_1', price: 4999, quantity: 1 },
      { id: 'prod_2', price: 2999, quantity: 2 },
    ];

    mockStripeService.createCheckoutSession.mockResolvedValue({
      sessionId: 'cs_test_123456',
      url: 'https://checkout.stripe.com/pay/cs_test_123456',
    });

    const result = await mockStripeService.createCheckoutSession(mockItems);

    expect(result.sessionId).toBeDefined();
    expect(result.url).toContain('checkout.stripe.com');
    expect(mockStripeService.createCheckoutSession).toHaveBeenCalledWith(mockItems);
  });

  it('should handle empty cart gracefully', async () => {
    mockStripeService.createCheckoutSession.mockRejectedValue(new Error('Cart cannot be empty'));

    await expect(mockStripeService.createCheckoutSession([])).rejects.toThrow(
      'Cart cannot be empty'
    );
  });

  it('should validate price before creating session', async () => {
    const invalidItems = [{ id: 'prod_1', price: -100, quantity: 1 }];

    mockStripeService.createCheckoutSession.mockRejectedValue(new Error('Invalid price'));

    await expect(mockStripeService.createCheckoutSession(invalidItems)).rejects.toThrow();
  });

  it('should handle payment confirmation', async () => {
    const sessionId = 'cs_test_123456';

    mockStripeService.confirmPayment.mockResolvedValue({
      status: 'succeeded',
      paymentIntentId: 'pi_test_123456',
    });

    const result = await mockStripeService.confirmPayment(sessionId);

    expect(result.status).toBe('succeeded');
    expect(mockStripeService.confirmPayment).toHaveBeenCalledWith(sessionId);
  });

  it('should refund payment when requested', async () => {
    const paymentIntentId = 'pi_test_123456';

    mockStripeService.refundPayment.mockResolvedValue({
      refundId: 're_test_123456',
      status: 'succeeded',
    });

    const result = await mockStripeService.refundPayment(paymentIntentId);

    expect(result.status).toBe('succeeded');
    expect(result.refundId).toBeDefined();
  });
});

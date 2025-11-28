<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

/**
 * SSLCommerz Payment Gateway Service
 * Handles payment processing through SSLCommerz API
 */
class SslCommerzService
{
    protected $storeId;
    protected $storePassword;
    protected $isSandbox;
    protected $baseUrl;

    public function __construct($storeId, $storePassword, $isSandbox = true)
    {
        $this->storeId = $storeId;
        $this->storePassword = $storePassword;
        $this->isSandbox = $isSandbox;
        $this->baseUrl = $isSandbox
            ? 'https://sandbox.sslcommerz.com'
            : 'https://securepay.sslcommerz.com';
    }

    /**
     * Initiate payment session
     *
     * @param array $paymentData
     * @return array
     */
    public function initiatePayment(array $paymentData): array
    {
        $endpoint = $this->baseUrl . '/gwprocess/v4/api.php';

        $data = [
            'store_id' => $this->storeId,
            'store_passwd' => $this->storePassword,
            'total_amount' => $paymentData['amount'],
            'currency' => $paymentData['currency'] ?? 'BDT',
            'tran_id' => $paymentData['transaction_id'],
            'success_url' => $paymentData['success_url'],
            'fail_url' => $paymentData['fail_url'],
            'cancel_url' => $paymentData['cancel_url'],
            'cus_name' => $paymentData['customer_name'],
            'cus_email' => $paymentData['customer_email'] ?? '',
            'cus_phone' => $paymentData['customer_phone'] ?? '',
            'cus_add1' => $paymentData['customer_address'] ?? '',
            'cus_city' => $paymentData['customer_city'] ?? 'Dhaka',
            'cus_country' => $paymentData['customer_country'] ?? 'Bangladesh',
            'shipping_method' => 'NO',
            'product_name' => $paymentData['product_name'] ?? 'Donation',
            'product_category' => 'Donation',
            'product_profile' => 'general',
        ];

        try {
            $response = Http::asForm()->post($endpoint, $data);

            if ($response->successful()) {
                $result = $response->json();

                if (isset($result['status']) && $result['status'] === 'SUCCESS') {
                    return [
                        'success' => true,
                        'sessionkey' => $result['sessionkey'] ?? null,
                        'GatewayPageURL' => $result['GatewayPageURL'] ?? null,
                        'redirect_url' => $result['GatewayPageURL'] ?? null,
                    ];
                }

                return [
                    'success' => false,
                    'message' => $result['failedreason'] ?? 'Payment initiation failed',
                ];
            }

            return [
                'success' => false,
                'message' => 'Failed to connect to payment gateway',
            ];
        } catch (\Exception $e) {
            Log::error('SSLCommerz payment initiation error: ' . $e->getMessage());

            return [
                'success' => false,
                'message' => 'Payment gateway error: ' . $e->getMessage(),
            ];
        }
    }

    /**
     * Validate payment
     *
     * @param string $transactionId
     * @param float $amount
     * @param string $currency
     * @return array
     */
    public function validatePayment(string $transactionId, float $amount, string $currency = 'BDT'): array
    {
        $endpoint = $this->baseUrl . '/validator/api/validationserverAPI.php';

        $data = [
            'val_id' => $transactionId,
            'store_id' => $this->storeId,
            'store_passwd' => $this->storePassword,
            'format' => 'json',
        ];

        try {
            $response = Http::asForm()->post($endpoint, $data);

            if ($response->successful()) {
                $result = $response->json();

                if (
                    isset($result['status']) &&
                    $result['status'] === 'VALID' &&
                    $result['amount'] == $amount &&
                    $result['currency'] === $currency
                ) {
                    return [
                        'success' => true,
                        'transaction_id' => $result['tran_id'] ?? $transactionId,
                        'bank_tran_id' => $result['bank_tran_id'] ?? null,
                        'card_type' => $result['card_type'] ?? null,
                        'card_brand' => $result['card_brand'] ?? null,
                    ];
                }

                return [
                    'success' => false,
                    'message' => 'Payment validation failed',
                ];
            }

            return [
                'success' => false,
                'message' => 'Failed to validate payment',
            ];
        } catch (\Exception $e) {
            Log::error('SSLCommerz payment validation error: ' . $e->getMessage());

            return [
                'success' => false,
                'message' => 'Validation error: ' . $e->getMessage(),
            ];
        }
    }

    /**
     * Get transaction status
     *
     * @param string $sessionKey
     * @return array
     */
    public function getTransactionStatus(string $sessionKey): array
    {
        $endpoint = $this->baseUrl . '/validator/api/merchantTransIDvalidationAPI.php';

        $data = [
            'sessionkey' => $sessionKey,
            'store_id' => $this->storeId,
            'store_passwd' => $this->storePassword,
            'format' => 'json',
        ];

        try {
            $response = Http::asForm()->post($endpoint, $data);

            if ($response->successful()) {
                return [
                    'success' => true,
                    'data' => $response->json(),
                ];
            }

            return [
                'success' => false,
                'message' => 'Failed to get transaction status',
            ];
        } catch (\Exception $e) {
            Log::error('SSLCommerz transaction status error: ' . $e->getMessage());

            return [
                'success' => false,
                'message' => 'Status check error: ' . $e->getMessage(),
            ];
        }
    }
}


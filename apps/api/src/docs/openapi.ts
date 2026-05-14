export const openApiSpec: Record<string, unknown> = {
  openapi: '3.0.3',
  info: {
    title: 'Sabi API',
    version: '1.0.0',
    description:
      'Backend API for Sabi, an intelligent informal economy platform. Protected routes require a Bearer access token returned by auth login/register.',
  },
  servers: [
    {
      url: 'http://localhost:5000/api/v1',
      description: 'Local development',
    },
  ],
  tags: [
    { name: 'Health' },
    { name: 'Auth' },
    { name: 'Users' },
    { name: 'Onboarding' },
    { name: 'Payments' },
    { name: 'Webhooks' },
    { name: 'Gigs' },
    { name: 'Matches' },
    { name: 'Buyer Requests' },
    { name: 'Trust Score' },
    { name: 'Vouches' },
    { name: 'Export' },
    {
      name: 'Implementation Status',
      description:
        'Implemented: auth, users/profile, onboarding, payments, Squad webhook, buyer-to-trader escrow, gig browse/apply/hire/complete, matching, buyer image analysis, trust score, vouching, PDF export. Missing from the product spec: public /pay/:username, notifications, settings, opportunity CRUD routes, ratings routes, application shortlisting, and poster delivery confirmation.',
    },
  ],
  security: [{ bearerAuth: [] }],
  paths: {
    '/health': {
      get: {
        tags: ['Health'],
        security: [],
        summary: 'API health check',
        responses: {
          '200': { description: 'API is running', content: { 'application/json': { schema: { $ref: '#/components/schemas/HealthResponse' } } } },
        },
      },
    },
    '/auth/register': {
      post: {
        tags: ['Auth'],
        security: [],
        summary: 'Register a user',
        requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/RegisterRequest' } } } },
        responses: {
          '201': { description: 'Account created', content: { 'application/json': { schema: { $ref: '#/components/schemas/AuthResponse' } } } },
          '400': { $ref: '#/components/responses/ValidationError' },
          '409': { $ref: '#/components/responses/Error' },
        },
      },
    },
    '/auth/login': {
      post: {
        tags: ['Auth'],
        security: [],
        summary: 'Login',
        requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/LoginRequest' } } } },
        responses: {
          '200': { description: 'Login successful', content: { 'application/json': { schema: { $ref: '#/components/schemas/AuthResponse' } } } },
          '400': { $ref: '#/components/responses/ValidationError' },
          '401': { $ref: '#/components/responses/Error' },
        },
      },
    },
    '/auth/refresh': {
      post: {
        tags: ['Auth'],
        security: [],
        summary: 'Refresh access token',
        requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/RefreshRequest' } } } },
        responses: {
          '200': { description: 'Token refreshed', content: { 'application/json': { schema: { $ref: '#/components/schemas/RefreshResponse' } } } },
          '400': { $ref: '#/components/responses/ValidationError' },
          '401': { $ref: '#/components/responses/Error' },
        },
      },
    },
    '/auth/me': {
      get: {
        tags: ['Auth'],
        summary: 'Get authenticated user',
        responses: {
          '200': { description: 'Current user', content: { 'application/json': { schema: { $ref: '#/components/schemas/UserResponse' } } } },
          '401': { $ref: '#/components/responses/Error' },
        },
      },
    },
    '/users': {
      get: {
        tags: ['Users'],
        summary: 'List users',
        parameters: [{ $ref: '#/components/parameters/Page' }, { $ref: '#/components/parameters/Limit' }],
        responses: {
          '200': { description: 'Users retrieved', content: { 'application/json': { schema: { $ref: '#/components/schemas/ListResponse' } } } },
        },
      },
    },
    '/users/{id}': {
      get: {
        tags: ['Users'],
        security: [],
        summary: 'Get public user profile',
        parameters: [{ $ref: '#/components/parameters/UserId' }],
        responses: {
          '200': { description: 'Public profile', content: { 'application/json': { schema: { $ref: '#/components/schemas/UserResponse' } } } },
          '404': { $ref: '#/components/responses/Error' },
        },
      },
    },
    '/users/me/profile': {
      get: {
        tags: ['Users'],
        summary: 'Get own full profile',
        responses: {
          '200': { description: 'Own profile', content: { 'application/json': { schema: { $ref: '#/components/schemas/UserResponse' } } } },
        },
      },
    },
    '/users/me': {
      patch: {
        tags: ['Users'],
        summary: 'Update own user profile',
        requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/UpdateUserRequest' } } } },
        responses: {
          '200': { description: 'Profile updated', content: { 'application/json': { schema: { $ref: '#/components/schemas/UserResponse' } } } },
          '400': { $ref: '#/components/responses/ValidationError' },
        },
      },
    },
    '/users/me/economic-profile': {
      patch: {
        tags: ['Users'],
        summary: 'Update own economic profile',
        requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/EconomicProfileInput' } } } },
        responses: {
          '200': { description: 'Economic profile updated', content: { 'application/json': { schema: { $ref: '#/components/schemas/ApiResponse' } } } },
        },
      },
    },
    '/users/me/financial-report.pdf': {
      get: {
        tags: ['Export'],
        summary: 'Download financial report PDF from users namespace',
        responses: {
          '200': { description: 'PDF file', content: { 'application/pdf': { schema: { type: 'string', format: 'binary' } } } },
        },
      },
    },
    '/onboard/chat': {
      post: {
        tags: ['Onboarding'],
        summary: 'Send an onboarding message to AI',
        description: 'Only TRADER and SEEKER users can use onboarding. BUYER users should create buyer requests instead.',
        requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/OnboardingChatRequest' } } } },
        responses: {
          '200': { description: 'AI onboarding response', content: { 'application/json': { schema: { $ref: '#/components/schemas/OnboardingChatResponse' } } } },
          '400': { $ref: '#/components/responses/ValidationError' },
          '403': { $ref: '#/components/responses/Error' },
        },
      },
    },
    '/onboard/complete': {
      post: {
        tags: ['Onboarding'],
        summary: 'Save completed economic profile',
        description: 'Only TRADER and SEEKER users can save onboarding profiles. Accepts either the raw economic profile, { extractedData }, or { data: { extractedData } }.',
        requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/EconomicProfileInput' } } } },
        responses: {
          '200': { description: 'Profile saved', content: { 'application/json': { schema: { $ref: '#/components/schemas/ApiResponse' } } } },
          '400': { $ref: '#/components/responses/ValidationError' },
          '403': { $ref: '#/components/responses/Error' },
        },
      },
    },
    '/payments/initiate': {
      post: {
        tags: ['Payments'],
        summary: 'Generate Squad checkout URL',
        requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/InitiatePaymentRequest' } } } },
        responses: {
          '200': { description: 'Payment initiated', content: { 'application/json': { schema: { $ref: '#/components/schemas/InitiatePaymentResponse' } } } },
        },
      },
    },
    '/payments/verify/{transactionRef}': {
      get: {
        tags: ['Payments'],
        summary: 'Verify Squad transaction',
        parameters: [{ $ref: '#/components/parameters/TransactionRef' }],
        responses: {
          '200': { description: 'Transaction verified', content: { 'application/json': { schema: { $ref: '#/components/schemas/ApiResponse' } } } },
        },
      },
    },
    '/payments/transactions': {
      get: {
        tags: ['Payments'],
        summary: 'Get Squad transaction history',
        parameters: [{ $ref: '#/components/parameters/Page' }, { name: 'perPage', in: 'query', schema: { type: 'integer', default: 20 } }],
        responses: {
          '200': { description: 'Transactions retrieved', content: { 'application/json': { schema: { $ref: '#/components/schemas/ListResponse' } } } },
        },
      },
    },
    '/payments/wallet': {
      get: {
        tags: ['Payments'],
        summary: 'Get own wallet balance and escrow summary',
        responses: {
          '200': { description: 'Wallet retrieved', content: { 'application/json': { schema: { $ref: '#/components/schemas/WalletResponse' } } } },
        },
      },
    },
    '/payments/escrow': {
      post: {
        tags: ['Payments'],
        summary: 'Buyer funds escrow for a trader',
        description: 'Deducts the amount from the authenticated buyer wallet and creates a FUNDED escrow payment for the selected trader.',
        requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/CreateEscrowRequest' } } } },
        responses: {
          '201': { description: 'Escrow funded', content: { 'application/json': { schema: { $ref: '#/components/schemas/EscrowPaymentResponse' } } } },
          '400': { $ref: '#/components/responses/ValidationError' },
          '401': { $ref: '#/components/responses/Error' },
          '403': { $ref: '#/components/responses/Error' },
        },
      },
      get: {
        tags: ['Payments'],
        summary: 'List my escrow payments',
        parameters: [
          {
            name: 'role',
            in: 'query',
            required: false,
            schema: { type: 'string', enum: ['buyer', 'trader'] },
            description: 'Filter to escrows where the authenticated user is buyer or trader.',
          },
        ],
        responses: {
          '200': { description: 'Escrows retrieved', content: { 'application/json': { schema: { $ref: '#/components/schemas/EscrowPaymentListResponse' } } } },
        },
      },
    },
    '/payments/escrow/{escrowId}/start': {
      patch: {
        tags: ['Payments'],
        summary: 'Trader starts an escrow job',
        description: 'Only the assigned trader can move a FUNDED escrow payment to IN_PROGRESS.',
        parameters: [{ $ref: '#/components/parameters/EscrowId' }],
        responses: {
          '200': { description: 'Escrow marked in progress', content: { 'application/json': { schema: { $ref: '#/components/schemas/EscrowPaymentResponse' } } } },
          '403': { $ref: '#/components/responses/Error' },
          '404': { $ref: '#/components/responses/Error' },
        },
      },
    },
    '/payments/escrow/{escrowId}/release': {
      patch: {
        tags: ['Payments'],
        summary: 'Buyer releases escrow to trader wallet',
        description: 'Only the buyer can release a FUNDED or IN_PROGRESS escrow payment. This credits the trader wallet.',
        parameters: [{ $ref: '#/components/parameters/EscrowId' }],
        responses: {
          '200': { description: 'Escrow released', content: { 'application/json': { schema: { $ref: '#/components/schemas/EscrowPaymentResponse' } } } },
          '403': { $ref: '#/components/responses/Error' },
          '404': { $ref: '#/components/responses/Error' },
        },
      },
    },
    '/payments/escrow/{escrowId}/refund': {
      patch: {
        tags: ['Payments'],
        summary: 'Buyer refunds escrow back to own wallet',
        description: 'Only the buyer can refund a FUNDED or DISPUTED escrow payment. Completed escrow payments cannot be refunded.',
        parameters: [{ $ref: '#/components/parameters/EscrowId' }],
        responses: {
          '200': { description: 'Escrow refunded', content: { 'application/json': { schema: { $ref: '#/components/schemas/EscrowPaymentResponse' } } } },
          '403': { $ref: '#/components/responses/Error' },
          '404': { $ref: '#/components/responses/Error' },
        },
      },
    },
    '/webhooks/squad': {
      post: {
        tags: ['Webhooks'],
        security: [],
        summary: 'Squad webhook callback',
        description: 'Requires x-squad-signature. Swagger cannot calculate this signature automatically; use Postman or Squad/ngrok for signed webhook tests.',
        parameters: [{ $ref: '#/components/parameters/SquadSignature' }],
        requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/SquadWebhookRequest' } } } },
        responses: {
          '200': { description: 'Webhook accepted', content: { 'application/json': { schema: { type: 'object', additionalProperties: true } } } },
          '401': { $ref: '#/components/responses/Error' },
        },
      },
    },
    '/gigs/browse': {
      get: {
        tags: ['Gigs'],
        summary: 'Browse open gigs',
        parameters: [
          { name: 'category', in: 'query', schema: { type: 'string' } },
          { name: 'location', in: 'query', schema: { type: 'string' } },
          { name: 'minBudget', in: 'query', schema: { type: 'number' } },
          { name: 'maxBudget', in: 'query', schema: { type: 'number' } },
          { $ref: '#/components/parameters/Page' },
          { $ref: '#/components/parameters/Limit' },
        ],
        responses: {
          '200': { description: 'Gigs retrieved', content: { 'application/json': { schema: { $ref: '#/components/schemas/ListResponse' } } } },
        },
      },
    },
    '/gigs/recommended': {
      get: {
        tags: ['Gigs'],
        summary: 'Get AI recommended gigs',
        responses: {
          '200': { description: 'Recommended gigs', content: { 'application/json': { schema: { $ref: '#/components/schemas/ApiResponse' } } } },
        },
      },
    },
    '/gigs/my-applications': {
      get: {
        tags: ['Gigs'],
        summary: 'Get my gig applications',
        parameters: [{ $ref: '#/components/parameters/Page' }, { $ref: '#/components/parameters/Limit' }],
        responses: {
          '200': { description: 'Applications retrieved', content: { 'application/json': { schema: { $ref: '#/components/schemas/ListResponse' } } } },
        },
      },
    },
    '/gigs/{opportunityId}/apply': {
      post: {
        tags: ['Gigs'],
        summary: 'Apply to a gig',
        parameters: [{ $ref: '#/components/parameters/OpportunityId' }],
        requestBody: { required: false, content: { 'application/json': { schema: { $ref: '#/components/schemas/ApplyToGigRequest' } } } },
        responses: {
          '201': { description: 'Application submitted', content: { 'application/json': { schema: { $ref: '#/components/schemas/ApiResponse' } } } },
        },
      },
    },
    '/gigs/{opportunityId}/applications': {
      get: {
        tags: ['Gigs'],
        summary: 'Get applicants for a gig you posted',
        parameters: [{ $ref: '#/components/parameters/OpportunityId' }],
        responses: {
          '200': { description: 'Applications retrieved and ranked', content: { 'application/json': { schema: { $ref: '#/components/schemas/ApiResponse' } } } },
        },
      },
    },
    '/gigs/applications/{applicationId}/hire': {
      patch: {
        tags: ['Gigs'],
        summary: 'Hire an applicant and initiate Squad payment',
        parameters: [{ $ref: '#/components/parameters/ApplicationId' }],
        responses: {
          '200': { description: 'Applicant hired', content: { 'application/json': { schema: { $ref: '#/components/schemas/ApiResponse' } } } },
        },
      },
    },
    '/gigs/applications/{applicationId}/complete': {
      patch: {
        tags: ['Gigs'],
        summary: 'Mark hired gig application as complete',
        parameters: [{ $ref: '#/components/parameters/ApplicationId' }],
        responses: {
          '200': { description: 'Gig marked complete', content: { 'application/json': { schema: { $ref: '#/components/schemas/ApiResponse' } } } },
        },
      },
    },
    '/matches/generate': {
      post: {
        tags: ['Matches'],
        summary: 'Generate AI matches for current user',
        requestBody: { required: false, content: { 'application/json': { schema: { $ref: '#/components/schemas/GenerateMatchesRequest' } } } },
        responses: {
          '201': { description: 'Matches generated', content: { 'application/json': { schema: { $ref: '#/components/schemas/ApiResponse' } } } },
        },
      },
    },
    '/matches': {
      get: {
        tags: ['Matches'],
        summary: 'List current user matches',
        responses: {
          '200': { description: 'Matches retrieved', content: { 'application/json': { schema: { $ref: '#/components/schemas/ApiResponse' } } } },
        },
      },
    },
    '/matches/{id}/status': {
      patch: {
        tags: ['Matches'],
        summary: 'Update match status',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }],
        requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/UpdateMatchStatusRequest' } } } },
        responses: {
          '200': { description: 'Match status updated', content: { 'application/json': { schema: { $ref: '#/components/schemas/ApiResponse' } } } },
        },
      },
    },
    '/buyer-requests/analyse': {
      post: {
        tags: ['Buyer Requests'],
        summary: 'Analyse a typed request or optional image and match traders',
        description: 'Only BUYER users can create buyer requests.',
        requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/BuyerRequestInput' } } } },
        responses: {
          '201': { description: 'Buyer request analysed and matched', content: { 'application/json': { schema: { $ref: '#/components/schemas/ApiResponse' } } } },
          '403': { $ref: '#/components/responses/Error' },
        },
      },
    },
    '/buyer-requests': {
      get: {
        tags: ['Buyer Requests'],
        summary: 'List my buyer requests',
        description: 'Only BUYER users can list their buyer requests.',
        responses: {
          '200': { description: 'Buyer requests retrieved', content: { 'application/json': { schema: { $ref: '#/components/schemas/ApiResponse' } } } },
          '403': { $ref: '#/components/responses/Error' },
        },
      },
      post: {
        tags: ['Buyer Requests'],
        summary: 'Create buyer request alias',
        description: 'Only BUYER users can create buyer requests.',
        requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/BuyerRequestInput' } } } },
        responses: {
          '201': { description: 'Buyer request analysed and matched', content: { 'application/json': { schema: { $ref: '#/components/schemas/ApiResponse' } } } },
          '403': { $ref: '#/components/responses/Error' },
        },
      },
    },
    '/trust/me': {
      get: {
        tags: ['Trust Score'],
        summary: 'Get own trust score breakdown',
        responses: {
          '200': { description: 'Trust score retrieved', content: { 'application/json': { schema: { $ref: '#/components/schemas/TrustScoreResponse' } } } },
        },
      },
    },
    '/trust/me/recalculate': {
      post: {
        tags: ['Trust Score'],
        summary: 'Recalculate own trust score',
        responses: {
          '200': { description: 'Trust score recalculated', content: { 'application/json': { schema: { $ref: '#/components/schemas/TrustScoreResponse' } } } },
        },
      },
    },
    '/trust/{userId}': {
      get: {
        tags: ['Trust Score'],
        security: [],
        summary: 'Get trust score breakdown for a user',
        parameters: [{ $ref: '#/components/parameters/UserId' }],
        responses: {
          '200': { description: 'Trust score retrieved', content: { 'application/json': { schema: { $ref: '#/components/schemas/TrustScoreResponse' } } } },
        },
      },
    },
    '/trust-score/me': {
      get: {
        tags: ['Trust Score'],
        summary: 'Get own trust score breakdown alias',
        responses: {
          '200': { description: 'Trust score retrieved', content: { 'application/json': { schema: { $ref: '#/components/schemas/TrustScoreResponse' } } } },
        },
      },
    },
    '/trust-score/me/recalculate': {
      post: {
        tags: ['Trust Score'],
        summary: 'Recalculate own trust score alias',
        responses: {
          '200': { description: 'Trust score recalculated', content: { 'application/json': { schema: { $ref: '#/components/schemas/TrustScoreResponse' } } } },
        },
      },
    },
    '/trust-score/{userId}': {
      get: {
        tags: ['Trust Score'],
        security: [],
        summary: 'Get trust score breakdown for a user alias',
        parameters: [{ $ref: '#/components/parameters/UserId' }],
        responses: {
          '200': { description: 'Trust score retrieved', content: { 'application/json': { schema: { $ref: '#/components/schemas/TrustScoreResponse' } } } },
        },
      },
    },
    '/vouches': {
      post: {
        tags: ['Vouches'],
        summary: 'Vouch for a user',
        requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/CreateVouchRequest' } } } },
        responses: {
          '201': { description: 'Vouch created', content: { 'application/json': { schema: { $ref: '#/components/schemas/ApiResponse' } } } },
        },
      },
    },
    '/vouches/{id}': {
      delete: {
        tags: ['Vouches'],
        summary: 'Remove one of your vouches',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }],
        responses: {
          '200': { description: 'Vouch removed', content: { 'application/json': { schema: { $ref: '#/components/schemas/ApiResponse' } } } },
        },
      },
    },
    '/vouches/me/received': {
      get: {
        tags: ['Vouches'],
        summary: 'List vouches received by me',
        responses: {
          '200': { description: 'Received vouches retrieved', content: { 'application/json': { schema: { $ref: '#/components/schemas/ApiResponse' } } } },
        },
      },
    },
    '/vouches/me/given': {
      get: {
        tags: ['Vouches'],
        summary: 'List vouches I have given',
        responses: {
          '200': { description: 'Given vouches retrieved', content: { 'application/json': { schema: { $ref: '#/components/schemas/ApiResponse' } } } },
        },
      },
    },
    '/vouches/users/{userId}/received': {
      get: {
        tags: ['Vouches'],
        security: [],
        summary: 'List vouches received by a user',
        parameters: [{ $ref: '#/components/parameters/UserId' }],
        responses: {
          '200': { description: 'Received vouches retrieved', content: { 'application/json': { schema: { $ref: '#/components/schemas/ApiResponse' } } } },
        },
      },
    },
    '/export/financial-report': {
      get: {
        tags: ['Export'],
        summary: 'Download financial identity PDF report',
        responses: {
          '200': { description: 'PDF file', content: { 'application/pdf': { schema: { type: 'string', format: 'binary' } } } },
        },
      },
    },
    '/export/financial-report.pdf': {
      get: {
        tags: ['Export'],
        summary: 'Download financial identity PDF report with .pdf extension',
        responses: {
          '200': { description: 'PDF file', content: { 'application/pdf': { schema: { type: 'string', format: 'binary' } } } },
        },
      },
    },
  },
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
    },
    parameters: {
      Page: { name: 'page', in: 'query', schema: { type: 'integer', default: 1, minimum: 1 } },
      Limit: { name: 'limit', in: 'query', schema: { type: 'integer', default: 10, minimum: 1, maximum: 50 } },
      UserId: { name: 'userId', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } },
      OpportunityId: { name: 'opportunityId', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } },
      ApplicationId: { name: 'applicationId', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } },
      EscrowId: { name: 'escrowId', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } },
      TransactionRef: { name: 'transactionRef', in: 'path', required: true, schema: { type: 'string' } },
      SquadSignature: {
        name: 'x-squad-signature',
        in: 'header',
        required: true,
        schema: { type: 'string' },
        description: 'HMAC-SHA512 signature generated with SQUAD_WEBHOOK_SECRET.',
      },
    },
    responses: {
      Error: {
        description: 'Error response',
        content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } },
      },
      ValidationError: {
        description: 'Validation failed',
        content: { 'application/json': { schema: { $ref: '#/components/schemas/ValidationErrorResponse' } } },
      },
    },
    schemas: {
      ApiResponse: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: true },
          message: { type: 'string' },
          data: { nullable: true },
          meta: { type: 'object', nullable: true, additionalProperties: true },
        },
      },
      ErrorResponse: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: false },
          message: { type: 'string' },
          errors: { nullable: true },
        },
      },
      ValidationErrorResponse: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: false },
          message: { type: 'string', example: 'Validation failed' },
          errors: { type: 'object', additionalProperties: { type: 'array', items: { type: 'string' } } },
        },
      },
      HealthResponse: {
        allOf: [{ $ref: '#/components/schemas/ApiResponse' }],
      },
      RegisterRequest: {
        type: 'object',
        required: ['fullName', 'email', 'phone', 'password', 'userType'],
        properties: {
          fullName: { type: 'string', example: 'Amaka Okafor' },
          email: { type: 'string', format: 'email', example: 'amaka@example.com' },
          phone: { type: 'string', example: '08012345678' },
          password: { type: 'string', minLength: 8, example: 'Password123!' },
          userType: { type: 'string', enum: ['TRADER', 'SEEKER', 'BUYER'], example: 'TRADER' },
        },
      },
      LoginRequest: {
        type: 'object',
        required: ['email', 'password'],
        properties: {
          email: { type: 'string', format: 'email', example: 'amaka@example.com' },
          password: { type: 'string', example: 'Password123!' },
        },
      },
      RefreshRequest: {
        type: 'object',
        required: ['refreshToken'],
        properties: { refreshToken: { type: 'string' } },
      },
      User: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          fullName: { type: 'string' },
          email: { type: 'string', format: 'email' },
          phone: { type: 'string' },
          userType: { type: 'string', enum: ['TRADER', 'SEEKER', 'BUYER'] },
          status: { type: 'string', enum: ['PENDING', 'ACTIVE', 'SUSPENDED'] },
          trustScore: { type: 'integer', example: 40 },
          profileImage: { type: 'string', nullable: true },
          economicProfile: { $ref: '#/components/schemas/EconomicProfile' },
        },
      },
      EconomicProfile: {
        type: 'object',
        properties: {
          tradeCategory: { type: 'string', example: 'Tailoring' },
          skills: { type: 'array', items: { type: 'string' }, example: ['sewing', 'alterations'] },
          location: { type: 'string', example: 'Yaba, Lagos' },
          language: { type: 'string', example: 'English' },
          yearsExperience: { type: 'integer', example: 4 },
          description: { type: 'string', example: 'I sew ankara dresses and handle alterations.' },
        },
      },
      EconomicProfileInput: {
        type: 'object',
        required: ['tradeCategory', 'skills', 'location', 'language', 'yearsExperience', 'description'],
        properties: {
          tradeCategory: { type: 'string', example: 'Tailoring' },
          skills: { type: 'array', items: { type: 'string' }, minItems: 1, example: ['sewing', 'alterations'] },
          location: { type: 'string', example: 'Yaba, Lagos' },
          language: { type: 'string', example: 'English' },
          yearsExperience: { type: 'integer', minimum: 0, example: 4 },
          description: { type: 'string', example: 'I sew ankara dresses and handle alterations.' },
        },
      },
      UpdateUserRequest: {
        type: 'object',
        properties: {
          fullName: { type: 'string' },
          phone: { type: 'string', example: '08012345678' },
          profileImage: { type: 'string', format: 'uri' },
        },
      },
      AuthResponse: {
        allOf: [{ $ref: '#/components/schemas/ApiResponse' }],
        example: {
          success: true,
          message: 'Login successful',
          data: { user: { id: 'uuid', fullName: 'Amaka Okafor', userType: 'TRADER' }, accessToken: 'jwt', refreshToken: 'jwt' },
        },
      },
      RefreshResponse: {
        allOf: [{ $ref: '#/components/schemas/ApiResponse' }],
        example: { success: true, message: 'Token refreshed', data: { accessToken: 'jwt' } },
      },
      UserResponse: {
        allOf: [{ $ref: '#/components/schemas/ApiResponse' }],
      },
      OnboardingChatRequest: {
        type: 'object',
        required: ['message'],
        properties: {
          message: { type: 'string', example: 'I sell fabrics in Balogun market.' },
          history: {
            type: 'array',
            items: {
              type: 'object',
              required: ['role', 'content'],
              properties: {
                role: { type: 'string', enum: ['user', 'assistant', 'system'] },
                content: { type: 'string' },
              },
            },
            default: [],
          },
        },
      },
      OnboardingChatResponse: {
        allOf: [{ $ref: '#/components/schemas/ApiResponse' }],
        example: {
          success: true,
          message: 'Response received',
          data: {
            reply: 'Great. Where are you located?',
            isComplete: false,
            extractedData: null,
          },
        },
      },
      InitiatePaymentRequest: {
        type: 'object',
        required: ['amount', 'customerName', 'customerEmail'],
        properties: {
          amount: { type: 'number', minimum: 10000, description: 'Amount in kobo', example: 500000 },
          customerName: { type: 'string', example: 'Customer Name' },
          customerEmail: { type: 'string', format: 'email', example: 'customer@example.com' },
          callbackUrl: { type: 'string', format: 'uri', example: 'http://localhost:3000/payment/callback' },
        },
      },
      InitiatePaymentResponse: {
        allOf: [{ $ref: '#/components/schemas/ApiResponse' }],
        example: { success: true, message: 'Payment initiated successfully', data: { checkoutUrl: 'https://...', transactionRef: 'SABI_ref' } },
      },
      WalletResponse: {
        allOf: [{ $ref: '#/components/schemas/ApiResponse' }],
        example: {
          success: true,
          message: 'Wallet retrieved',
          data: {
            account: {
              id: 'uuid',
              accountNumber: '900000003',
              accountName: 'Fatima Musa',
              bankName: 'Sabi Demo Bank',
              balance: '150000.00',
            },
            balances: {
              available: 150000,
              escrowHeld: 35000,
              pendingEarnings: 0,
            },
          },
        },
      },
      CreateEscrowRequest: {
        type: 'object',
        required: ['traderId', 'amount'],
        properties: {
          traderId: { type: 'string', format: 'uuid', description: 'Trader user ID from auth login or users list.' },
          amount: { type: 'number', minimum: 1, example: 20000 },
          description: { type: 'string', minLength: 2, maxLength: 255, example: 'Payment for rice supply' },
          metadata: { type: 'object', additionalProperties: true, example: { source: 'swagger-test' } },
        },
      },
      EscrowPayment: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          reference: { type: 'string', example: 'ESCROW_abcd1234efgh5678' },
          buyerId: { type: 'string', format: 'uuid' },
          traderId: { type: 'string', format: 'uuid' },
          amount: { type: 'number', example: 20000 },
          status: { type: 'string', enum: ['FUNDED', 'IN_PROGRESS', 'COMPLETED', 'DISPUTED', 'REFUNDED', 'CANCELLED'] },
          description: { type: 'string', nullable: true },
          metadata: { type: 'object', nullable: true, additionalProperties: true },
          fundedAt: { type: 'string', format: 'date-time' },
          releasedAt: { type: 'string', format: 'date-time', nullable: true },
          refundedAt: { type: 'string', format: 'date-time', nullable: true },
        },
      },
      EscrowPaymentResponse: {
        allOf: [{ $ref: '#/components/schemas/ApiResponse' }],
        example: {
          success: true,
          message: 'Escrow payment funded successfully',
          data: {
            id: 'uuid',
            reference: 'ESCROW_abcd1234efgh5678',
            buyerId: 'buyer-uuid',
            traderId: 'trader-uuid',
            amount: '20000.00',
            status: 'FUNDED',
            description: 'Payment for rice supply',
          },
        },
      },
      EscrowPaymentListResponse: {
        allOf: [{ $ref: '#/components/schemas/ApiResponse' }],
        example: {
          success: true,
          message: 'Escrow payments retrieved',
          data: [
            {
              id: 'uuid',
              reference: 'ESCROW_DEMO_FUNDED_RICE',
              amount: '20000.00',
              status: 'FUNDED',
              buyer: { fullName: 'Fatima Musa' },
              trader: { fullName: 'Amina Bello' },
            },
          ],
        },
      },
      SquadWebhookRequest: {
        type: 'object',
        required: [
          'transaction_reference',
          'virtual_account_number',
          'principal_amount',
          'settled_amount',
          'customer_identifier',
          'transaction_indicator',
          'currency',
        ],
        properties: {
          transaction_reference: { type: 'string', example: 'SWAGGER_FUND_TEST_001' },
          virtual_account_number: { type: 'string', example: '900000003' },
          principal_amount: { type: 'string', example: '50000' },
          settled_amount: { type: 'string', example: '50000' },
          fee_charged: { type: 'string', example: '0' },
          transaction_date: { type: 'string', format: 'date-time', example: '2026-05-13T12:00:00.000Z' },
          customer_identifier: { type: 'string', example: 'SABI_buyer-user-id' },
          transaction_indicator: { type: 'string', enum: ['C', 'D'], example: 'C' },
          remarks: { type: 'string', example: 'Swagger wallet funding test' },
          currency: { type: 'string', example: 'NGN' },
          channel: { type: 'string', example: 'bank_transfer' },
          sender_name: { type: 'string', example: 'Swagger Test Sender' },
        },
      },
      ApplyToGigRequest: {
        type: 'object',
        properties: { coverNote: { type: 'string', maxLength: 2000 } },
      },
      GenerateMatchesRequest: {
        type: 'object',
        properties: {
          limit: { type: 'integer', minimum: 1, maximum: 50, default: 20 },
          minScore: { type: 'integer', minimum: 0, maximum: 100, default: 50 },
        },
      },
      UpdateMatchStatusRequest: {
        type: 'object',
        required: ['status'],
        properties: { status: { type: 'string', enum: ['PENDING', 'ACCEPTED', 'REJECTED'] } },
      },
      BuyerRequestInput: {
        type: 'object',
        description: 'Provide description for text search. imageBase64 and mimeType are optional, but must be sent together when uploading an image.',
        anyOf: [
          { required: ['description'] },
          { required: ['imageBase64', 'mimeType'] },
        ],
        properties: {
          imageBase64: { type: 'string', minLength: 100, description: 'Optional base64 image data without data URL prefix' },
          mimeType: { type: 'string', enum: ['image/png', 'image/jpeg', 'image/jpg', 'image/webp', 'image/gif'] },
          description: { type: 'string', minLength: 3, maxLength: 1000, example: 'I need a tailor to sew an ankara dress with puff sleeves' },
        },
      },
      TrustScoreResponse: {
        allOf: [{ $ref: '#/components/schemas/ApiResponse' }],
        example: {
          success: true,
          message: 'Trust score retrieved',
          data: {
            total: 40,
            transactionScore: 0,
            ratingScore: 0,
            tenureScore: 0,
            vouchingScore: 0,
            profileScore: 0,
          },
        },
      },
      CreateVouchRequest: {
        type: 'object',
        required: ['voucheeId'],
        properties: {
          voucheeId: { type: 'string', format: 'uuid' },
          message: { type: 'string', nullable: true, maxLength: 500 },
        },
      },
      ListResponse: {
        allOf: [{ $ref: '#/components/schemas/ApiResponse' }],
      },
    },
  },
  'x-sabi-implementationStatus': {
    completeEnoughForFrontendIntegration: false,
    implemented: [
      'Auth register/login/refresh/me',
      'User profile read/update and economic profile update',
      'AI onboarding chat and complete profile save',
      'Squad payment initiation, verification, transaction history, wallet lookup, webhook',
      'Gig browse, recommendations, apply, applicant ranking, hire, mark complete, my applications',
      'AI match generation/list/status',
      'Buyer visual request analysis and history',
      'Trust score breakdown/recalculation',
      'Vouch create/list/delete',
      'Financial report PDF export',
    ],
    missingFromProductSpec: [
      'POST/GET/PATCH /opportunities routes for creating and managing gigs',
      'POST /ratings and rating history routes',
      'Application shortlist endpoint',
      'Poster confirms delivery and actual Squad escrow release endpoint',
      'Notifications endpoints',
      'Settings/change password/privacy/delete account endpoints',
      'Public /pay/:username payment page API support',
    ],
  },
};

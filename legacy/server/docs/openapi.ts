/**
 * OpenAPI 3.0.0 Specification for The Custodian of the Two Holy Mosques Scholarship Program
 */

export const OPENAPI_SPEC = {
  openapi: '3.0.0',
  info: {
    title: 'The Custodian of the Two Holy Mosques Scholarship Program - Enterprise API',
    description: 'Production-ready, highly-scalable API for the Saudi National Scholarship Platform (KASP). Supports Nafath SSO, Dynamic Rules Engine, Declarative Partitioning, and Redis Caching.',
    version: '1.0.0',
    contact: {
      name: 'Ministry of Education - Overseas Scholarship Agency',
      url: 'https://kasp.moe.gov.sa'
    }
  },
  servers: [
    {
      url: '/api/v1',
      description: 'Primary API Gateway (v1)'
    }
  ],
  components: {
    securitySchemes: {
      BearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Provide Bearer token obtained from /auth/nafath/verify'
      }
    },
    schemas: {
      StandardResponse: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: true },
          data: { type: 'object' },
          meta: {
            type: 'object',
            properties: {
              timestamp: { type: 'string', format: 'date-time' }
            }
          },
          error: { type: 'object', nullable: true }
        }
      },
      ScholarshipTrack: {
        type: 'object',
        properties: {
          id: { type: 'string', example: 'track-pioneers' },
          code: { type: 'string', example: 'PIONEERS' },
          nameAr: { type: 'string', example: 'مسار الرواد' },
          nameEn: { type: 'string', example: 'Pioneers Track' },
          minGpa: { type: 'number', example: 3.75 },
          topUniversitiesRankLimit: { type: 'integer', example: 30 }
        }
      },
      Application: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          applicationNumber: { type: 'string', example: 'SCH-2026-9A82B104' },
          userId: { type: 'string' },
          trackId: { type: 'string' },
          status: { type: 'string', enum: ['draft', 'submitted', 'under_review', 'accepted', 'rejected'] },
          eligibilityDecision: { type: 'string', enum: ['ELIGIBLE', 'CONDITIONALLY_ELIGIBLE', 'NOT_ELIGIBLE'] }
        }
      }
    }
  },
  paths: {
    '/system/health': {
      get: {
        summary: 'System health check and uptime probe',
        tags: ['Observability'],
        responses: {
          '200': { description: 'System is healthy' }
        }
      }
    },
    '/tracks': {
      get: {
        summary: 'Retrieve all 6 scholarship tracks with Redis Cache-Aside',
        tags: ['Tracks'],
        responses: {
          '200': { description: 'List of scholarship tracks' }
        }
      }
    },
    '/requirements/{trackId}': {
      get: {
        summary: 'Retrieve dynamic database requirements rules for a track',
        tags: ['Requirements Engine'],
        parameters: [
          { name: 'trackId', in: 'path', required: true, schema: { type: 'string' } }
        ],
        responses: {
          '200': { description: 'Dynamic rules list' }
        }
      }
    },
    '/eligibility/check': {
      post: {
        summary: 'Run candidate data against dynamic track rules to compute eligibility and score',
        tags: ['Eligibility Engine'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  trackId: { type: 'string', example: 'track-pioneers' },
                  candidateData: {
                    type: 'object',
                    properties: {
                      gpa: { type: 'number', example: 4.85 },
                      qsRank: { type: 'integer', example: 3 },
                      ieltsScore: { type: 'number', example: 7.5 }
                    }
                  }
                }
              }
            }
          }
        },
        responses: {
          '200': { description: 'Eligibility report with matched/failed rules and score' }
        }
      }
    },
    '/applications': {
      get: {
        summary: 'List applications using cursor-based pagination',
        tags: ['Applications'],
        security: [{ BearerAuth: [] }],
        parameters: [
          { name: 'limit', in: 'query', schema: { type: 'integer', default: 20 } },
          { name: 'cursor', in: 'query', schema: { type: 'string' } },
          { name: 'status', in: 'query', schema: { type: 'string' } }
        ],
        responses: {
          '200': { description: 'Cursor paginated list of applications' }
        }
      }
    },
    '/applications/draft': {
      post: {
        summary: 'Create a new scholarship application draft',
        tags: ['Applications'],
        security: [{ BearerAuth: [] }],
        responses: {
          '201': { description: 'Application draft created' }
        }
      }
    },
    '/applications/{id}/submit': {
      post: {
        summary: 'Submit application with distributed locking and eligibility check',
        tags: ['Applications'],
        security: [{ BearerAuth: [] }],
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'string' } }
        ],
        responses: {
          '200': { description: 'Application submitted successfully' }
        }
      }
    },
    '/ai/scan-letter': {
      post: {
        summary: 'Process admission letter with AI/OCR and extract structured academic data',
        tags: ['AI Gateway'],
        security: [{ BearerAuth: [] }],
        responses: {
          '200': { description: 'Extracted university, degree, tuition, and score' }
        }
      }
    }
  }
};

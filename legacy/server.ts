import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { v1Router } from './server/routes/v1';
import { securityHeadersMiddleware } from './server/middleware/security';
import { DatabaseService } from './server/core/database';
import { Logger } from './server/core/logger';
import { OPENAPI_SPEC } from './server/docs/openapi';
import { runLoadTest } from './server/tests/loadTest';

async function startServer() {
  const app = express();
  const PORT = 3000;

  // 1. Initialize Database & Seeding
  DatabaseService.initialize();

  // 2. Body Parser & Security Headers
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));
  app.use(securityHeadersMiddleware);

  // System Health & Liveness Probes
  app.get(['/health', '/api/health'], (req, res) => {
    res.status(200).json({ status: 'UP', service: 'kasp-scholarship-portal', timestamp: new Date().toISOString() });
  });
  app.get('/health/live', (req, res) => res.status(200).send('OK'));
  app.get('/health/ready', (req, res) => res.status(200).send('READY'));

  // 3. API Routes FIRST (Mandatory)
  app.use('/api/v1', v1Router);

  // OpenAPI Specification endpoint
  app.get('/api/v1/openapi.json', (req, res) => {
    res.json(OPENAPI_SPEC);
  });

  // Interactive Swagger UI Mock / Specification Viewer
  app.get('/api/docs', (req, res) => {
    res.send(`
      <!DOCTYPE html>
      <html lang="ar" dir="rtl">
      <head>
        <meta charset="UTF-8">
        <title>وثائق واجهة البرمجة (API Documentation) - برنامج خادم الحرمين الشريفين للابتعاث</title>
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/swagger-ui-dist@5/swagger-ui.css">
        <style>
          body { margin: 0; padding: 20px; font-family: sans-serif; background: #f8fafc; }
          .header { background: #064e3b; color: white; padding: 24px; border-radius: 12px; margin-bottom: 20px; }
          .header h1 { margin: 0 0 8px 0; font-size: 24px; }
          .header p { margin: 0; opacity: 0.9; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>منصة برنامج خادم الحرمين الشريفين للابتعاث - وثائق الـ APIs</h1>
          <p>Enterprise RESTful Services • OpenAPI 3.0 • Dynamic Requirements Engine • Declarative Partitioning</p>
        </div>
        <div id="swagger-ui"></div>
        <script src="https://cdn.jsdelivr.net/npm/swagger-ui-dist@5/swagger-ui-bundle.js"></script>
        <script>
          window.ui = SwaggerUIBundle({
            url: '/api/v1/openapi.json',
            dom_id: '#swagger-ui',
            deepLinking: true,
            presets: [SwaggerUIBundle.presets.apis],
            layout: "BaseLayout"
          });
        </script>
      </body>
      </html>
    `);
  });

  // Legacy deprecated student routes (Section 30 of Master Prompt)
  const deprecatedStudentRoutes = [
    '/student/login',
    '/student/register',
    '/student/dashboard',
    '/nafath',
    '/auth/national-id',
    '/api/v1/auth/nafath/initiate',
    '/api/v1/auth/nafath/verify'
  ];

  deprecatedStudentRoutes.forEach(route => {
    app.all(route, (req, res) => {
      if (req.accepts('html')) {
        return res.redirect(302, '/');
      }
      return res.status(404).json({
        success: false,
        statusCode: 404,
        error: 'DEPRECATED_ENDPOINT',
        message: 'Student accounts and Nafath authentication are not hosted on this platform. Official scholarship applications are processed exclusively at https://kasp.moe.gov.sa'
      });
    });
  });

  // Benchmark On-Demand Trigger Endpoint
  app.get('/api/benchmark', async (req, res) => {
    try {
      const results = await runLoadTest();
      res.json({
        success: true,
        message: 'Benchmark test completed successfully',
        timestamp: new Date().toISOString(),
        results
      });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // 4. Vite middleware for development / Static file serving for production
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  // 5. Start Listening on 0.0.0.0:3000
  app.listen(PORT, '0.0.0.0', () => {
    Logger.info(`KASP Enterprise Server running on http://0.0.0.0:${PORT}`);
    Logger.info(`API Gateway: http://localhost:${PORT}/api/v1`);
    Logger.info(`API Documentation (Swagger): http://localhost:${PORT}/api/docs`);
    Logger.info(`Live Benchmark: http://localhost:${PORT}/api/benchmark`);
  });
}

startServer();

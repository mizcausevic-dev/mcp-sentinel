"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const express_1 = __importDefault(require("express"));
const helmet_1 = __importDefault(require("helmet"));
const cors_1 = __importDefault(require("cors"));
const morgan_1 = __importDefault(require("morgan"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const env_1 = require("./config/env");
const servers_1 = require("./routes/servers");
const audits_1 = require("./routes/audits");
const validate_1 = require("./routes/validate");
const swagger_1 = require("./docs/swagger");
exports.app = (0, express_1.default)();
const startedAt = Date.now();
exports.app.use((0, helmet_1.default)());
exports.app.use((0, cors_1.default)());
exports.app.use(express_1.default.json({ limit: '1mb' }));
exports.app.use((0, morgan_1.default)(env_1.env.nodeEnv === 'production' ? 'combined' : 'dev'));
exports.app.get('/health', (_req, res) => {
    res.json({
        status: 'ok',
        service: 'mcp-sentinel',
        version: '0.1.0',
        uptimeSec: Math.floor((Date.now() - startedAt) / 1000),
        nodeEnv: env_1.env.nodeEnv,
    });
});
exports.app.use('/docs', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swagger_1.openApiSpec));
exports.app.use('/api/servers', servers_1.serversRouter);
exports.app.use('/api/audits', audits_1.auditsRouter);
exports.app.use('/api/incidents', audits_1.incidentsRouter);
exports.app.use('/api/policies', audits_1.policiesRouter);
exports.app.use('/api/dashboard', audits_1.dashboardRouter);
exports.app.use('/api/validate', validate_1.validateRouter);
exports.app.use('/api/security-scan', validate_1.securityScanRouter);
exports.app.use('/api/posture-check', validate_1.postureCheckRouter);
exports.app.use((_req, res) => {
    res.status(404).json({ error: 'not-found' });
});
if (require.main === module) {
    exports.app.listen(env_1.env.port, () => {
        console.log(`[mcp-sentinel] listening on http://localhost:${env_1.env.port}`);
        console.log(`[mcp-sentinel] swagger docs at http://localhost:${env_1.env.port}/docs`);
    });
}
//# sourceMappingURL=index.js.map
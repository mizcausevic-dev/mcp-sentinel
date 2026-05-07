"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.postureCheckRouter = exports.securityScanRouter = exports.validateRouter = void 0;
const express_1 = require("express");
const validation_schemas_1 = require("../schemas/validation-schemas");
const server_validator_1 = require("../governance/server-validator");
const schema_drift_1 = require("../governance/schema-drift");
const injection_detector_1 = require("../governance/injection-detector");
const security_scan_1 = require("../governance/security-scan");
exports.validateRouter = (0, express_1.Router)();
exports.validateRouter.post('/server', (req, res) => {
    const parsed = validation_schemas_1.ServerRegistrationSchema.safeParse(req.body);
    if (!parsed.success) {
        return res.status(400).json({ error: 'invalid-payload', issues: parsed.error.issues });
    }
    return res.json((0, server_validator_1.validateServerRegistration)(parsed.data));
});
exports.validateRouter.post('/schema', (req, res) => {
    const parsed = validation_schemas_1.ToolSchemaSchema.safeParse(req.body);
    if (!parsed.success) {
        return res.status(400).json({ error: 'invalid-payload', issues: parsed.error.issues });
    }
    return res.json((0, schema_drift_1.evaluateToolSchema)(parsed.data));
});
exports.validateRouter.post('/invocation', (req, res) => {
    const parsed = validation_schemas_1.InvocationSchema.safeParse(req.body);
    if (!parsed.success) {
        return res.status(400).json({ error: 'invalid-payload', issues: parsed.error.issues });
    }
    return res.json((0, injection_detector_1.evaluateInvocation)(parsed.data));
});
exports.securityScanRouter = (0, express_1.Router)();
exports.securityScanRouter.post('/', (req, res) => {
    const parsed = validation_schemas_1.SecurityScanSchema.safeParse(req.body);
    if (!parsed.success) {
        return res.status(400).json({ error: 'invalid-payload', issues: parsed.error.issues });
    }
    return res.json((0, security_scan_1.runSecurityScan)(parsed.data));
});
exports.postureCheckRouter = (0, express_1.Router)();
exports.postureCheckRouter.post('/', (req, res) => {
    const regParse = validation_schemas_1.ServerRegistrationSchema.safeParse(req.body);
    if (!regParse.success) {
        return res.status(400).json({ error: 'invalid-payload', issues: regParse.error.issues });
    }
    const validation = (0, server_validator_1.validateServerRegistration)(regParse.data);
    let combinedStatus;
    if (validation.status === 'allowed')
        combinedStatus = 'production-ready';
    else if (validation.status === 'flagged')
        combinedStatus = 'needs-review';
    else
        combinedStatus = 'blocked';
    return res.json({
        combinedStatus,
        postureScore: validation.postureScore,
        issues: validation.issues,
        passedChecks: validation.passedChecks,
        recommendedNextAction: validation.recommendedNextAction,
    });
});
//# sourceMappingURL=validate.js.map
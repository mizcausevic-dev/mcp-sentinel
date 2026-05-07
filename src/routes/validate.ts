import { Router } from 'express';
import {
  ServerRegistrationSchema,
  ToolSchemaSchema,
  InvocationSchema,
  SecurityScanSchema,
} from '../schemas/validation-schemas';
import { validateServerRegistration } from '../governance/server-validator';
import { evaluateToolSchema } from '../governance/schema-drift';
import { evaluateInvocation } from '../governance/injection-detector';
import { runSecurityScan } from '../governance/security-scan';

export const validateRouter = Router();

validateRouter.post('/server', (req, res) => {
  const parsed = ServerRegistrationSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: 'invalid-payload', issues: parsed.error.issues });
  }
  return res.json(validateServerRegistration(parsed.data));
});

validateRouter.post('/schema', (req, res) => {
  const parsed = ToolSchemaSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: 'invalid-payload', issues: parsed.error.issues });
  }
  return res.json(evaluateToolSchema(parsed.data));
});

validateRouter.post('/invocation', (req, res) => {
  const parsed = InvocationSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: 'invalid-payload', issues: parsed.error.issues });
  }
  return res.json(evaluateInvocation(parsed.data));
});

export const securityScanRouter = Router();
securityScanRouter.post('/', (req, res) => {
  const parsed = SecurityScanSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: 'invalid-payload', issues: parsed.error.issues });
  }
  return res.json(runSecurityScan(parsed.data));
});

export const postureCheckRouter = Router();
postureCheckRouter.post('/', (req, res) => {
  const regParse = ServerRegistrationSchema.safeParse(req.body);
  if (!regParse.success) {
    return res.status(400).json({ error: 'invalid-payload', issues: regParse.error.issues });
  }
  const validation = validateServerRegistration(regParse.data);
  let combinedStatus: 'production-ready' | 'needs-review' | 'blocked';
  if (validation.status === 'allowed') combinedStatus = 'production-ready';
  else if (validation.status === 'flagged') combinedStatus = 'needs-review';
  else combinedStatus = 'blocked';

  return res.json({
    combinedStatus,
    postureScore: validation.postureScore,
    issues: validation.issues,
    passedChecks: validation.passedChecks,
    recommendedNextAction: validation.recommendedNextAction,
  });
});

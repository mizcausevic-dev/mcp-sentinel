"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.runSecurityScan = runSecurityScan;
const servers_1 = require("../data/servers");
const audits_1 = require("../data/audits");
const server_validator_1 = require("./server-validator");
function runSecurityScan(payload) {
    const server = (0, servers_1.findServer)(payload.serverId);
    if (!server) {
        return {
            serverId: payload.serverId,
            status: 'fail',
            postureScore: 0,
            failedPolicies: ['server-not-registered'],
            passedPolicies: [],
            issues: [`Server ${payload.serverId} is not registered.`],
            recommendedNextAction: 'Register server through POST /api/validate/server before scanning.',
        };
    }
    const validation = (0, server_validator_1.validateServerRegistration)({
        name: server.name,
        endpoint: server.endpoint,
        transport: server.transport,
        authMethod: server.authMethod,
        oauthScopes: server.oauthScopes,
        declaredTools: server.declaredTools,
        owner: server.owner,
        environment: server.environment,
    });
    const failedPolicies = [];
    const passedPolicies = [];
    const issues = [...validation.issues];
    for (const policy of audits_1.policies) {
        let failed = false;
        if (policy.id === 'pol_least_privilege_oauth') {
            const writeOrAdmin = server.oauthScopes.some((s) => /(write|admin)/i.test(s));
            failed = writeOrAdmin;
        }
        if (policy.id === 'pol_no_auth_destructive') {
            const destructive = server.declaredTools.some((t) => /(delete|drop|remove|truncate|wipe|exec)/i.test(t));
            failed = server.authMethod === 'none' && destructive;
        }
        if (policy.id === 'pol_tls_minimum') {
            failed =
                (server.transport === 'http' || server.transport === 'sse' || server.transport === 'streamable-http') &&
                    !server.endpoint.startsWith('https://');
        }
        if (failed) {
            failedPolicies.push(policy.id);
            issues.push(`Policy violation: ${policy.name}.`);
        }
        else {
            passedPolicies.push(policy.id);
        }
    }
    let status;
    if (validation.postureScore >= 80 && failedPolicies.length === 0) {
        status = 'pass';
    }
    else if (validation.postureScore >= 55 && failedPolicies.length <= 1) {
        status = 'review';
    }
    else {
        status = 'fail';
    }
    let recommendedNextAction;
    if (status === 'pass') {
        recommendedNextAction = 'Continue scheduled posture scans on default cadence.';
    }
    else if (status === 'review') {
        recommendedNextAction = 'Schedule platform security review within 7 days.';
    }
    else {
        recommendedNextAction = 'Quarantine server, suspend agent traffic, escalate to SecOps.';
    }
    return {
        serverId: server.id,
        status,
        postureScore: validation.postureScore,
        failedPolicies,
        passedPolicies,
        issues,
        recommendedNextAction,
    };
}
//# sourceMappingURL=security-scan.js.map
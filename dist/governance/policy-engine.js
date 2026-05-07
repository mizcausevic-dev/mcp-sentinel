"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listPolicies = listPolicies;
exports.findPolicy = findPolicy;
const audits_1 = require("../data/audits");
function listPolicies() {
    return audits_1.policies;
}
function findPolicy(id) {
    return audits_1.policies.find((p) => p.id === id);
}
//# sourceMappingURL=policy-engine.js.map
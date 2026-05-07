export declare const openApiSpec: {
    openapi: string;
    info: {
        title: string;
        version: string;
        description: string;
    };
    servers: {
        url: string;
        description: string;
    }[];
    paths: {
        '/health': {
            get: {
                summary: string;
                responses: {
                    '200': {
                        description: string;
                    };
                };
            };
        };
        '/api/servers': {
            get: {
                summary: string;
            };
        };
        '/api/servers/{id}': {
            get: {
                summary: string;
                parameters: {
                    name: string;
                    in: string;
                    required: boolean;
                    schema: {
                        type: string;
                    };
                }[];
            };
        };
        '/api/servers/{id}/tools': {
            get: {
                summary: string;
                parameters: {
                    name: string;
                    in: string;
                    required: boolean;
                    schema: {
                        type: string;
                    };
                }[];
            };
        };
        '/api/audits': {
            get: {
                summary: string;
            };
        };
        '/api/incidents': {
            get: {
                summary: string;
            };
        };
        '/api/policies': {
            get: {
                summary: string;
            };
        };
        '/api/dashboard/summary': {
            get: {
                summary: string;
            };
        };
        '/api/validate/server': {
            post: {
                summary: string;
            };
        };
        '/api/validate/schema': {
            post: {
                summary: string;
            };
        };
        '/api/validate/invocation': {
            post: {
                summary: string;
            };
        };
        '/api/security-scan': {
            post: {
                summary: string;
            };
        };
        '/api/posture-check': {
            post: {
                summary: string;
            };
        };
    };
};

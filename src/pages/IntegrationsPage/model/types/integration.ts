export interface IntegrationStatus {
    type: string;
    isEnabled: boolean;
    isConfigured: boolean;
    updatedAt: string | null;
    publicConfig: Record<string, unknown>;
}

import { z } from "zod";
export declare const authenticateSchema: z.ZodObject<{}, "strip", z.ZodTypeAny, {}, {}>;
export declare function handleAuthenticate(): Promise<string>;
export declare const listOrganizationsSchema: z.ZodObject<{
    inn: z.ZodOptional<z.ZodString>;
    kpp: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    inn?: string | undefined;
    kpp?: string | undefined;
}, {
    inn?: string | undefined;
    kpp?: string | undefined;
}>;
export declare function handleListOrganizations(params: z.infer<typeof listOrganizationsSchema>): Promise<string>;
export declare const getOrganizationSchema: z.ZodObject<{
    org_id: z.ZodString;
}, "strip", z.ZodTypeAny, {
    org_id: string;
}, {
    org_id: string;
}>;
export declare function handleGetOrganization(params: z.infer<typeof getOrganizationSchema>): Promise<string>;
export declare const listDocumentsSchema: z.ZodObject<{
    box_id: z.ZodString;
    filter_category: z.ZodOptional<z.ZodString>;
    timestamped_from: z.ZodOptional<z.ZodString>;
    timestamped_to: z.ZodOptional<z.ZodString>;
    count: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
    offset: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
}, "strip", z.ZodTypeAny, {
    box_id: string;
    count: number;
    offset: number;
    filter_category?: string | undefined;
    timestamped_from?: string | undefined;
    timestamped_to?: string | undefined;
}, {
    box_id: string;
    filter_category?: string | undefined;
    timestamped_from?: string | undefined;
    timestamped_to?: string | undefined;
    count?: number | undefined;
    offset?: number | undefined;
}>;
export declare function handleListDocuments(params: z.infer<typeof listDocumentsSchema>): Promise<string>;
export declare const getDocumentSchema: z.ZodObject<{
    box_id: z.ZodString;
    message_id: z.ZodString;
    entity_id: z.ZodString;
}, "strip", z.ZodTypeAny, {
    box_id: string;
    message_id: string;
    entity_id: string;
}, {
    box_id: string;
    message_id: string;
    entity_id: string;
}>;
export declare function handleGetDocument(params: z.infer<typeof getDocumentSchema>): Promise<string>;
export declare const sendDocumentSchema: z.ZodObject<{
    box_id: z.ZodString;
    to_box_id: z.ZodString;
    document_type: z.ZodString;
    content_base64: z.ZodString;
    file_name: z.ZodString;
}, "strip", z.ZodTypeAny, {
    box_id: string;
    to_box_id: string;
    document_type: string;
    content_base64: string;
    file_name: string;
}, {
    box_id: string;
    to_box_id: string;
    document_type: string;
    content_base64: string;
    file_name: string;
}>;
export declare function handleSendDocument(params: z.infer<typeof sendDocumentSchema>): Promise<string>;
export declare const signDocumentSchema: z.ZodObject<{
    box_id: z.ZodString;
    message_id: z.ZodString;
    entity_id: z.ZodString;
}, "strip", z.ZodTypeAny, {
    box_id: string;
    message_id: string;
    entity_id: string;
}, {
    box_id: string;
    message_id: string;
    entity_id: string;
}>;
export declare function handleSignDocument(params: z.infer<typeof signDocumentSchema>): Promise<string>;
export declare const listCounterpartiesSchema: z.ZodObject<{
    box_id: z.ZodString;
}, "strip", z.ZodTypeAny, {
    box_id: string;
}, {
    box_id: string;
}>;
export declare function handleListCounterparties(params: z.infer<typeof listCounterpartiesSchema>): Promise<string>;

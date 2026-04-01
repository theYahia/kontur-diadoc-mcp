import { z } from "zod";
import { authenticate, diadocGet, diadocPost } from "../client.js";

// --- authenticate ---

export const authenticateSchema = z.object({});

export async function handleAuthenticate(): Promise<string> {
  const token = await authenticate();
  return JSON.stringify({ status: "authenticated", token_preview: token.substring(0, 12) + "..." }, null, 2);
}

// --- list_organizations ---

export const listOrganizationsSchema = z.object({
  inn: z.string().optional().describe("INN to search for"),
  kpp: z.string().optional().describe("KPP to search for"),
});

export async function handleListOrganizations(params: z.infer<typeof listOrganizationsSchema>): Promise<string> {
  const query: Record<string, string> = {};
  if (params.inn) query.innKpp = params.kpp ? `${params.inn}-${params.kpp}` : params.inn;
  const result = await diadocGet("/GetOrganizationsByInnKpp", query);
  return JSON.stringify(result, null, 2);
}

// --- get_organization ---

export const getOrganizationSchema = z.object({
  org_id: z.string().describe("Organization ID (box ID or org ID)"),
});

export async function handleGetOrganization(params: z.infer<typeof getOrganizationSchema>): Promise<string> {
  const result = await diadocGet("/GetOrganization", { orgId: params.org_id });
  return JSON.stringify(result, null, 2);
}

// --- list_documents ---

export const listDocumentsSchema = z.object({
  box_id: z.string().describe("Box ID of the organization"),
  filter_category: z.string().optional().describe("Document category filter (e.g., 'Any.InboundNotFinished')"),
  timestamped_from: z.string().optional().describe("Start date filter (ISO format)"),
  timestamped_to: z.string().optional().describe("End date filter (ISO format)"),
  count: z.number().optional().default(25).describe("Number of documents to return"),
  offset: z.number().optional().default(0).describe("Offset for pagination"),
});

export async function handleListDocuments(params: z.infer<typeof listDocumentsSchema>): Promise<string> {
  const query: Record<string, string> = { boxId: params.box_id };
  if (params.filter_category) query.filterCategory = params.filter_category;
  if (params.timestamped_from) query.timestampedFrom = params.timestamped_from;
  if (params.timestamped_to) query.timestampedTo = params.timestamped_to;
  query.count = String(params.count);
  query.offset = String(params.offset);
  const result = await diadocGet("/V3/GetDocuments", query);
  return JSON.stringify(result, null, 2);
}

// --- get_document ---

export const getDocumentSchema = z.object({
  box_id: z.string().describe("Box ID"),
  message_id: z.string().describe("Message ID"),
  entity_id: z.string().describe("Entity ID of the document"),
});

export async function handleGetDocument(params: z.infer<typeof getDocumentSchema>): Promise<string> {
  const result = await diadocGet("/V3/GetDocument", {
    boxId: params.box_id,
    messageId: params.message_id,
    entityId: params.entity_id,
  });
  return JSON.stringify(result, null, 2);
}

// --- send_document ---

export const sendDocumentSchema = z.object({
  box_id: z.string().describe("Sender box ID"),
  to_box_id: z.string().describe("Recipient box ID"),
  document_type: z.string().describe("Document type (e.g., 'Invoice', 'Act', 'Torg12')"),
  content_base64: z.string().describe("Document content as base64 string"),
  file_name: z.string().describe("File name for the document"),
});

export async function handleSendDocument(params: z.infer<typeof sendDocumentSchema>): Promise<string> {
  const body = {
    FromBoxId: params.box_id,
    ToBoxId: params.to_box_id,
    MessageBodyItems: [{
      DocumentType: params.document_type,
      Content: params.content_base64,
      FileName: params.file_name,
    }],
  };
  const result = await diadocPost("/V3/PostMessage", body);
  return JSON.stringify(result, null, 2);
}

// --- sign_document ---

export const signDocumentSchema = z.object({
  box_id: z.string().describe("Box ID"),
  message_id: z.string().describe("Message ID"),
  entity_id: z.string().describe("Entity ID of the document to sign"),
});

export async function handleSignDocument(params: z.infer<typeof signDocumentSchema>): Promise<string> {
  const body = {
    BoxId: params.box_id,
    MessageId: params.message_id,
    RecipientTitles: [{
      ParentEntityId: params.entity_id,
    }],
  };
  const result = await diadocPost("/V3/PostMessagePatch", body);
  return JSON.stringify(result, null, 2);
}

// --- list_counterparties ---

export const listCounterpartiesSchema = z.object({
  box_id: z.string().describe("Box ID of the organization"),
});

export async function handleListCounterparties(params: z.infer<typeof listCounterpartiesSchema>): Promise<string> {
  const result = await diadocGet("/GetCounteragents", { myOrgId: params.box_id });
  return JSON.stringify(result, null, 2);
}

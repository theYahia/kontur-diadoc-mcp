import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  authenticateSchema, handleAuthenticate,
  listOrganizationsSchema, handleListOrganizations,
  getOrganizationSchema, handleGetOrganization,
  listDocumentsSchema, handleListDocuments,
  getDocumentSchema, handleGetDocument,
  sendDocumentSchema,
  signDocumentSchema,
  listCounterpartiesSchema, handleListCounterparties,
} from "../tools/documents.js";

vi.mock("../client.js", () => ({
  authenticate: vi.fn().mockResolvedValue("test-token-abc123def456"),
  diadocGet: vi.fn().mockResolvedValue({ organizations: [{ name: "Test Org", inn: "1234567890" }] }),
  diadocPost: vi.fn().mockResolvedValue({ messageId: "msg-123", success: true }),
}));

import { diadocGet, diadocPost } from "../client.js";
const mockDiadocGet = vi.mocked(diadocGet);
const mockDiadocPost = vi.mocked(diadocPost);

beforeEach(() => { mockDiadocGet.mockClear(); mockDiadocPost.mockClear(); });

describe("authenticate", () => {
  it("returns token preview", async () => {
    const result = await handleAuthenticate();
    const parsed = JSON.parse(result);
    expect(parsed.status).toBe("authenticated");
    expect(parsed.token_preview).toContain("...");
  });
});

describe("list_organizations", () => {
  it("validates schema with inn", () => {
    const result = listOrganizationsSchema.safeParse({ inn: "7707083893" });
    expect(result.success).toBe(true);
  });

  it("calls diadocGet with /GetOrganizationsByInnKpp", async () => {
    await handleListOrganizations({ inn: "7707083893" });
    expect(mockDiadocGet).toHaveBeenCalledWith("/GetOrganizationsByInnKpp", { innKpp: "7707083893" });
  });
});

describe("get_organization", () => {
  it("calls diadocGet with /GetOrganization", async () => {
    await handleGetOrganization({ org_id: "org-123" });
    expect(mockDiadocGet).toHaveBeenCalledWith("/GetOrganization", { orgId: "org-123" });
  });
});

describe("list_documents", () => {
  it("validates schema with required box_id", () => {
    const result = listDocumentsSchema.safeParse({ box_id: "box-123" });
    expect(result.success).toBe(true);
  });

  it("calls diadocGet with filters", async () => {
    await handleListDocuments({ box_id: "box-123", filter_category: "Any.InboundNotFinished", count: 10, offset: 0 });
    expect(mockDiadocGet).toHaveBeenCalledWith("/V3/GetDocuments", expect.objectContaining({
      boxId: "box-123",
      filterCategory: "Any.InboundNotFinished",
    }));
  });
});

describe("get_document", () => {
  it("validates schema", () => {
    const result = getDocumentSchema.safeParse({ box_id: "b", message_id: "m", entity_id: "e" });
    expect(result.success).toBe(true);
  });
});

describe("send_document", () => {
  it("validates schema", () => {
    const result = sendDocumentSchema.safeParse({
      box_id: "b1", to_box_id: "b2", document_type: "Invoice",
      content_base64: "dGVzdA==", file_name: "invoice.xml",
    });
    expect(result.success).toBe(true);
  });
});

describe("list_counterparties", () => {
  it("calls diadocGet with /GetCounteragents", async () => {
    await handleListCounterparties({ box_id: "box-123" });
    expect(mockDiadocGet).toHaveBeenCalledWith("/GetCounteragents", { myOrgId: "box-123" });
  });
});

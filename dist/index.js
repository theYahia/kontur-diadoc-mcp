#!/usr/bin/env node
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { authenticateSchema, handleAuthenticate, listOrganizationsSchema, handleListOrganizations, getOrganizationSchema, handleGetOrganization, listDocumentsSchema, handleListDocuments, getDocumentSchema, handleGetDocument, sendDocumentSchema, handleSendDocument, signDocumentSchema, handleSignDocument, listCounterpartiesSchema, handleListCounterparties, } from "./tools/documents.js";
const server = new McpServer({ name: "kontur-diadoc-mcp", version: "1.0.0" });
server.tool("authenticate", "Authenticate with Kontur.Diadoc API.", authenticateSchema.shape, async () => ({ content: [{ type: "text", text: await handleAuthenticate() }] }));
server.tool("list_organizations", "Search organizations by INN/KPP in Diadoc.", listOrganizationsSchema.shape, async (params) => ({ content: [{ type: "text", text: await handleListOrganizations(params) }] }));
server.tool("get_organization", "Get organization details by ID.", getOrganizationSchema.shape, async (params) => ({ content: [{ type: "text", text: await handleGetOrganization(params) }] }));
server.tool("list_documents", "List documents in a box with filters.", listDocumentsSchema.shape, async (params) => ({ content: [{ type: "text", text: await handleListDocuments(params) }] }));
server.tool("get_document", "Get a specific document by box/message/entity ID.", getDocumentSchema.shape, async (params) => ({ content: [{ type: "text", text: await handleGetDocument(params) }] }));
server.tool("send_document", "Send a document to a counterparty.", sendDocumentSchema.shape, async (params) => ({ content: [{ type: "text", text: await handleSendDocument(params) }] }));
server.tool("sign_document", "Sign/accept a received document.", signDocumentSchema.shape, async (params) => ({ content: [{ type: "text", text: await handleSignDocument(params) }] }));
server.tool("list_counterparties", "List counterparties for an organization.", listCounterpartiesSchema.shape, async (params) => ({ content: [{ type: "text", text: await handleListCounterparties(params) }] }));
async function main() {
    const transport = new StdioServerTransport();
    await server.connect(transport);
    console.error("[kontur-diadoc-mcp] Server started. 8 tools registered.");
}
main().catch((error) => { console.error("[kontur-diadoc-mcp] Error:", error); process.exit(1); });
//# sourceMappingURL=index.js.map
#!/usr/bin/env node

import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import type { CallToolResult } from "@modelcontextprotocol/sdk/types.js";
import {
  authenticateSchema,
  getDocumentSchema,
  getOrganizationSchema,
  handleAuthenticate,
  handleGetDocument,
  handleGetOrganization,
  handleListCounterparties,
  handleListDocuments,
  handleListOrganizations,
  handleSendDocument,
  handleSignDocument,
  listCounterpartiesSchema,
  listDocumentsSchema,
  listOrganizationsSchema,
  sendDocumentSchema,
  signDocumentSchema,
} from "./tools/documents.js";

function resolveVersion(): string {
  try {
    const here = dirname(fileURLToPath(import.meta.url));
    const pkg = JSON.parse(readFileSync(join(here, "..", "package.json"), "utf8")) as {
      version?: string;
    };
    return pkg.version ?? "0.0.0";
  } catch {
    return "0.0.0";
  }
}

const VERSION = resolveVersion();

/** Run a handler, turning thrown errors into a structured MCP error result. */
async function run(handler: () => Promise<string>): Promise<CallToolResult> {
  try {
    return { content: [{ type: "text", text: await handler() }] };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return { isError: true, content: [{ type: "text", text: `Ошибка / Error: ${message}` }] };
  }
}

const server = new McpServer({ name: "kontur-diadoc-mcp", version: VERSION });

server.tool(
  "authenticate",
  "Аутентификация в Kontur.Diadoc API (возвращает превью токена). / Authenticate with Diadoc.",
  authenticateSchema.shape,
  () => run(() => handleAuthenticate()),
);

server.tool(
  "list_organizations",
  "Поиск организаций по ИНН/КПП в Diadoc. / Search organizations by INN/KPP.",
  listOrganizationsSchema.shape,
  (params) => run(() => handleListOrganizations(params)),
);

server.tool(
  "get_organization",
  "Детали организации по orgId / boxId / ИНН. / Get organization details.",
  getOrganizationSchema.shape,
  (params) => run(() => handleGetOrganization(params)),
);

server.tool(
  "list_documents",
  "Список документов в ящике с фильтрами и пагинацией. / List documents in a box.",
  listDocumentsSchema.shape,
  (params) => run(() => handleListDocuments(params)),
);

server.tool(
  "get_document",
  "Получить конкретный документ по box/message/entity ID. / Get a specific document.",
  getDocumentSchema.shape,
  (params) => run(() => handleGetDocument(params)),
);

server.tool(
  "send_document",
  "Отправить документ контрагенту. Подпись (base64) формирует клиент; для песочницы шлите без подписи. / Send a document; the client supplies the signature.",
  sendDocumentSchema.shape,
  (params) => run(() => handleSendDocument(params)),
);

server.tool(
  "sign_document",
  "Подписать входящий документ. Нужна готовая подпись (base64) или sign_with_test_signature в песочнице. / Sign a received document with a client-supplied signature.",
  signDocumentSchema.shape,
  (params) => run(() => handleSignDocument(params)),
);

server.tool(
  "list_counterparties",
  "Список контрагентов организации (myBoxId). / List counterparties for an organization.",
  listCounterpartiesSchema.shape,
  (params) => run(() => handleListCounterparties(params)),
);

const TOOL_COUNT = 8;

async function main(): Promise<void> {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error(`[kontur-diadoc-mcp] v${VERSION} started. ${TOOL_COUNT} tools registered.`);
}

main().catch((error) => {
  console.error("[kontur-diadoc-mcp] Fatal error:", error);
  process.exit(1);
});

# @theyahia/kontur-diadoc-mcp

MCP server for **Kontur.Diadoc** -- electronic document interchange (EDI) for Russian businesses. Send, receive, and sign invoices, acts, and other fiscal documents.

## Tools

| Tool | Description |
|------|-------------|
| `authenticate` | Get Diadoc authentication token |
| `list_organizations` | Search organizations by INN/KPP |
| `get_organization` | Get organization details |
| `list_documents` | List documents with filters |
| `get_document` | Get specific document details |
| `send_document` | Send document to counterparty |
| `sign_document` | Sign/accept a received document |
| `list_counterparties` | List counterparties |

## Install

### Claude Desktop / Cline / Cursor

```json
{
  "mcpServers": {
    "kontur-diadoc": {
      "command": "npx",
      "args": ["-y", "@theyahia/kontur-diadoc-mcp"],
      "env": {
        "DIADOC_CLIENT_ID": "<YOUR_CLIENT_ID>",
        "DIADOC_API_KEY": "<YOUR_API_KEY>",
        "DIADOC_LOGIN": "<YOUR_LOGIN>",
        "DIADOC_PASSWORD": "<YOUR_PASSWORD>"
      }
    }
  }
}
```

### Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `DIADOC_CLIENT_ID` | Yes | Diadoc API client ID |
| `DIADOC_API_KEY` | Yes | Diadoc API key |
| `DIADOC_LOGIN` | Yes | Diadoc account login |
| `DIADOC_PASSWORD` | Yes | Diadoc account password |

## Demo Prompts

- "Find organization by INN 7707083893 in Diadoc"
- "List my inbound unsigned documents"
- "Get document details for message msg-123"
- "Send an invoice to counterparty box-456"
- "Sign the incoming act from Sberbank"
- "Show all my counterparties in Diadoc"
- "List documents received this month"
- "Authenticate with Diadoc"

## API Reference

Docs: [https://developer.kontur.ru/doc/diadoc](https://developer.kontur.ru/doc/diadoc)

## License

MIT

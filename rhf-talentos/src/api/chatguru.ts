/**
 * ChatGuru API Client
 *
 * All requests are POST to a single endpoint using application/x-www-form-urlencoded.
 * Every request includes: key, account_id, phone_id, action + specific params.
 */

export interface ChatGuruConfig {
  endpoint: string;
  key: string;
  accountId: string;
  phoneId: string;
}

export interface ChatGuruResponse {
  status: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

export class ChatGuruClient {
  private config: ChatGuruConfig;

  constructor(config: ChatGuruConfig) {
    this.config = config;
  }

  /**
   * Internal method: builds URLSearchParams body and POSTs to the ChatGuru endpoint.
   * Logs every request and response for debugging.
   */
  private async _request(
    action: string,
    params: Record<string, string>
  ): Promise<ChatGuruResponse> {
    const body = new URLSearchParams({
      key: this.config.key,
      account_id: this.config.accountId,
      phone_id: this.config.phoneId,
      action,
      ...params,
    });

    console.log(`[ChatGuru] → action=${action}`, {
      account_id: this.config.accountId,
      phone_id: this.config.phoneId,
      action,
      ...params,
    });

    const response = await fetch(this.config.endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: body.toString(),
    });

    const text = await response.text();

    let data: ChatGuruResponse;
    try {
      data = JSON.parse(text);
    } catch {
      data = { status: "raw", body: text };
    }

    console.log(`[ChatGuru] ← action=${action} status=${response.status}`, data);

    if (!response.ok) {
      throw new Error(
        `ChatGuru API error: HTTP ${response.status} — ${JSON.stringify(data)}`
      );
    }

    return data;
  }

  /**
   * Send a text message to a contact.
   * action: message_send
   */
  async sendMessage(
    chatNumber: string,
    text: string,
    sendDate?: string
  ): Promise<ChatGuruResponse> {
    const params: Record<string, string> = {
      chat_number: chatNumber,
      text,
    };
    if (sendDate) params["send_date"] = sendDate;
    return this._request("message_send", params);
  }

  /**
   * Send a file (image, document, audio, video) to a contact.
   * action: message_file_send
   */
  async sendFile(
    chatNumber: string,
    fileUrl: string,
    caption: string
  ): Promise<ChatGuruResponse> {
    return this._request("message_file_send", {
      chat_number: chatNumber,
      file_url: fileUrl,
      caption,
    });
  }

  /**
   * Get the delivery/read status of a previously sent message.
   * action: message_status
   */
  async getMessageStatus(
    chatNumber: string,
    messageId: string
  ): Promise<ChatGuruResponse> {
    return this._request("message_status", {
      chat_number: chatNumber,
      message_id: messageId,
    });
  }

  /**
   * Add / create a new contact chat.
   * action: chat_add
   */
  async addChat(
    chatNumber: string,
    name: string,
    text: string,
    userId?: string,
    dialogId?: string
  ): Promise<ChatGuruResponse> {
    const params: Record<string, string> = {
      chat_number: chatNumber,
      name,
      text,
    };
    if (userId) params["user_id"] = userId;
    if (dialogId) params["dialog_id"] = dialogId;
    return this._request("chat_add", params);
  }

  /**
   * Check the status of a chat_add operation (async creation).
   * action: chat_add_status
   */
  async getChatAddStatus(
    chatNumber: string,
    chatAddId: string
  ): Promise<ChatGuruResponse> {
    return this._request("chat_add_status", {
      chat_number: chatNumber,
      chat_add_id: chatAddId,
    });
  }

  /**
   * Update the display name of an existing contact.
   * action: chat_update_name
   */
  async updateChatName(
    chatNumber: string,
    name: string
  ): Promise<ChatGuruResponse> {
    return this._request("chat_update_name", {
      chat_number: chatNumber,
      name,
    });
  }

  /**
   * Update custom fields on a contact.
   * Each field key is automatically prefixed with "field__".
   * action: chat_update_custom_fields
   */
  async updateCustomFields(
    chatNumber: string,
    fields: Record<string, string>
  ): Promise<ChatGuruResponse> {
    const prefixed: Record<string, string> = { chat_number: chatNumber };
    for (const [key, value] of Object.entries(fields)) {
      prefixed[`field__${key}`] = value;
    }
    return this._request("chat_update_custom_fields", prefixed);
  }

  /**
   * Update context variables on a contact.
   * Each key is automatically prefixed with "var__".
   * action: chat_update_context
   */
  async updateContext(
    chatNumber: string,
    context: Record<string, string>
  ): Promise<ChatGuruResponse> {
    const prefixed: Record<string, string> = { chat_number: chatNumber };
    for (const [key, value] of Object.entries(context)) {
      prefixed[`var__${key}`] = value;
    }
    return this._request("chat_update_context", prefixed);
  }

  /**
   * Add an internal note to a contact's chat.
   * action: note_add
   */
  async addNote(
    chatNumber: string,
    noteText: string
  ): Promise<ChatGuruResponse> {
    return this._request("note_add", {
      chat_number: chatNumber,
      text: noteText,
    });
  }

  /**
   * Trigger the execution of a dialog/bot flow for a contact.
   * action: dialog_execute
   */
  async executeDialog(
    chatNumber: string,
    dialogId: string
  ): Promise<ChatGuruResponse> {
    return this._request("dialog_execute", {
      chat_number: chatNumber,
      dialog_id: dialogId,
    });
  }
}

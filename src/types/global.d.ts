// global.d.ts

export { }; // Ensure this file is treated as a module

declare global {
  interface CodicentConfig {
    token: string;
    signalRHost?: string;
    baseUrl?: string;
  }

  interface PostMessageConfig {
    message: string;
    parentId?: string;
    type?: string;
  }

  interface GetMessagesConfig {
    start?: number;
    length?: number;
    search?: string;
    afterTimestamp?: Date;
  }

  interface Message {
    id: string;
    content: string;
    parentId?: string;
    type?: string;
    createdAt: Date;
  }

  interface GetDataMessagesConfig {
    codicent: string;
    tags: string[];
    search?: string;
  }

  interface ChatMessageConfig {
    message: string;
    codicent: string;
    messageId?: string;
  }

  interface ChatMessageReply {
    id: string;
    content: string;
  }

  type MessageData = { [key: string]: string };

  interface DataMessage {
    id: string;
    fileId: string | null;
    fileIds: string[];
    data: MessageData;
    createdAt: string;
    tags: string[];
    mentions: string[];
  }

  interface FileInfo {
    id: string;
    filename: string;
    contentType: string;
    createdAt: string;
  }
  interface Codicent {
    /**
     * Initializes the Codicent library with the provided configuration.
     * @param config - Configuration object containing the API token and optional SignalR host.
     */
    init(config: CodicentConfig): void;

    /**
     * Uploads a file to Codicent.
     * @param formData - FormData object containing the file to upload.
     * @param fileName - Name of the file being uploaded.
     * @returns A promise that resolves to the ID of the uploaded file.
     */
    upload(formData: FormData, fileName: string): Promise<string>;

    /**
     * Gets file info.
     * @param fileId - file id.
     * @returns A promise that resolves to the file info of the file.
     */
    getFileInfo(fileId: string): Promise<FileInfo>;

    /**
     * Posts a message to Codicent.
     * @param config - Configuration object containing message details.
     * @returns A promise that resolves to the ID of the posted message.
     */
    postMessage(config: PostMessageConfig): Promise<string>;

    /**
     * Retrieves messages from Codicent.
     * @param config - Configuration object specifying message retrieval parameters.
     * @returns A promise that resolves to an array of messages.
     */
    getMessages(config?: GetMessagesConfig): Promise<Message[]>;

    /**
     * Handles incoming messages. Assign a function to process new messages.
     */
    handleMessage: (message: Message) => void;

    /**
     * Handles logging from Codicent. Assign a function to process log messages.
     */
    log: (message: object) => void;

    /**
     * Retrieves a chat reply from Codicent AI.
     * @param message - The message to get a reply for.
     * @returns A promise that resolves to the AI's reply.
     */
    getChatReply(message: string): Promise<string>;

    /**
     * Retrieves a chat reply from Codicent AI.
     * @param config - Configuration object containing message, codicent, and optional messageId.
     * @returns A promise that resolves to the AI's reply.
     */
    getChatReply3(config: ChatMessageConfig): Promise<ChatMessageReply>;

    /**
     * Creates a custom HTML element for Codicent UI.
     * @param tagName - The name of the custom element to create.
     * @param html - The HTML content of the custom element.
     */
    createCustomElement(tagName: string, html: string): void;
    /**
     * Retrieves data messages from Codicent.
     * @param config - Configuration object containing codicent, tags, and optional search string.
     * @returns A promise that resolves to the data messages.
     */
    getDataMessages(config: GetDataMessagesConfig): Promise<DataMessage[]>;
  }

  interface Window {
    /**
     * The Codicent global object provided by the Codicent JavaScript library.
     */
    Codicent: Codicent;
  }
}

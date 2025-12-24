import { Proxy } from "@puremvc/puremvc-typescript-multicore-framework";
import type {
  ILoggingFacade,
  MCPTrafficMessage,
} from "../../common/interfaces.js";
import type { IPipeMessage } from "@puremvc/puremvc-typescript-util-pipes";

type StreamsByClient = Map<string, IPipeMessage[]>;
type ClientsByCore = Map<string, StreamsByClient>;

/**
 * Represents a proxy for managing dashboard streams; message lists organized
 * by core identifiers and client IDs.
 */
export class DashboardStreamsProxy extends Proxy {
  static NAME: string = "DashboardStreamsProxy";
  constructor() {
    // Initialize the streams map
    const streamsMap = new Map<string, StreamsByClient>();
    super(DashboardStreamsProxy.NAME, streamsMap);
  }

  onRegister() {
    super.onRegister();
    const f = this.facade as ILoggingFacade;
    f.log(`💾 DashboardStreamsProxy - registered`, 6);
  }

  /**
   * Adds a message to the appropriate client array within the streams map.
   * Messages are organized by a core identifier and a client ID.
   * If no client exists for the given core and client ID, a new client is initialized.
   *
   * @param {IPipeMessage} message The message object to be added, containing headers with core and client ID information.
   * @return {void} No return value.
   */
  public addMessage(message: MCPTrafficMessage): boolean {
    const core = message?.header?.core;
    const clientId = message?.header?.clientId;

    if (typeof core !== "string" || typeof clientId !== "string") {
      (this.facade as ILoggingFacade).log(
        "💾 DashboardStreamsProxy: Message is missing 'core' or clientId' in header.",
        5,
      );
      return false;
    }

    // Get or create the client map for the given core
    let clients = this.streamsMap.get(core);
    if (!clients) {
      clients = new Map<string, IPipeMessage[]>();
      this.streamsMap.set(core, clients);
    }

    // Get or create the stream for the given client ID
    let stream = clients.get(clientId);
    if (!stream) {
      stream = [];
      clients.set(clientId, stream);
    }

    // Add the message to the stream
    stream.push(message);

    return true;
  }

  /**
   * Calculates the length of a stream associated with the given core and client ID.
   *
   * @param {string} core - The identifier for the core to which the stream belongs.
   * @param {string} clientId - The identifier for the client associated with the stream.
   * @return {number} The length of the stream, or 0 if the stream is not found.
   */
  public getStreamLength(core: string, clientId: string): number {
    const stream = this.getStream(core, clientId);
    return stream ? stream.length : 0;
  }

  /**
   * Retrieves the stream of messages for a specific core and client ID.
   *
   * @param {string} core - The identifier for the core to retrieve the stream from.
   * @param {string} clientId - The client ID associated with the stream to retrieve.
   * @return {IPipeMessage[] | undefined} The array of messages in the stream if found, otherwise undefined.
   */
  public getStream(core: string, clientId: string): IPipeMessage[] | undefined {
    return this.streamsMap.get(core)?.get(clientId);
  }

  /**
   * Retrieves the mapping of streams stored in the current instance.
   * @return {ClientsByCore} The representation of streams as stored in the data property.
   */
  get streamsMap(): ClientsByCore {
    return this.data as ClientsByCore;
  }
}

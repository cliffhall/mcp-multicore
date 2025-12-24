import { Proxy } from "@puremvc/puremvc-typescript-multicore-framework";
import type { ILoggingFacade } from "../../common/interfaces.js";
import type { IPipeMessage } from "@puremvc/puremvc-typescript-util-pipes";

type StreamsBySession = Map<string, IPipeMessage[]>;
type SessionsByCore = Map<string, StreamsBySession>;

/**
 * Represents a proxy for managing dashboard streams; message lists organized
 * by core identifiers and session IDs.
 */
export class DashboardStreamsProxy extends Proxy {
  static NAME: string = "DashboardStreamsProxy";
  constructor() {
    // Initialize the streams map
    const streamsMap = new Map<string, StreamsBySession>();
    super(DashboardStreamsProxy.NAME, streamsMap);
  }

  onRegister() {
    super.onRegister();
    const f = this.facade as ILoggingFacade;
    f.log(`💾 DashboardStreamsProxy - registered`, 6);
  }

  /**
   * Adds a message to the appropriate session array within the streams map.
   * Messages are organized by a core identifier and a session ID.
   * If no session exists for the given core and session ID, a new session is initialized.
   *
   * @param {IPipeMessage} message The message object to be added, containing headers with core and session ID information.
   * @return {void} No return value.
   */
  public addMessage(message: IPipeMessage): void {
    const core = message?.header?.["core"] as string;
    const sessionId = message?.header?.["mcp-session-id"] as string;

    // Get the session map for the given core
    let sessions = this.streamsMap.get(core);

    // Initialize the given core's session list for the given sessionId if need be
    if (sessions) {
      if (!sessions?.has(sessionId)) {
        sessions.set(sessionId, [] as IPipeMessage[]);
      }
    } else {
      // Initialize the given core's session map and its session list for the given sessionId
      this.streamsMap.set(core, new Map<string, IPipeMessage[]>());
      this.streamsMap.get(core)?.set(sessionId, [] as IPipeMessage[]);
      sessions = this.streamsMap.get(core);
    }

    // Get the session array and add the message
    let stream = sessions!.get(sessionId);
    stream!.push(message);
  }

  /**
   * Calculates the length of a stream associated with the given core and session ID.
   *
   * @param {string} core - The identifier for the core to which the stream belongs.
   * @param {string} sessionId - The identifier for the session associated with the stream.
   * @return {number} The length of the stream, or 0 if the stream is not found.
   */
  public getStreamLength(core: string, sessionId: string): number {
    const stream = this.getStream(core, sessionId);
    return stream ? stream.length : 0;
  }

  /**
   * Retrieves the stream of messages for a specific core and session ID.
   *
   * @param {string} core - The identifier for the core to retrieve the stream from.
   * @param {string} sessionId - The session ID associated with the stream to retrieve.
   * @return {IPipeMessage[] | void} The array of messages in the stream if found, otherwise undefined.
   */
  public getStream(core: string, sessionId: string): IPipeMessage[] | void {
    return this.streamsMap.get(core)?.get(sessionId);
  }

  /**
   * Retrieves the mapping of streams stored in the current instance.
   * @return {SessionsByCore} The representation of streams as stored in the data property.
   */
  get streamsMap(): SessionsByCore {
    return this.data as SessionsByCore;
  }
}

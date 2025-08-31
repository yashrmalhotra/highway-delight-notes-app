import { Connection } from "mongoose";
import { EventEmitter } from "stream";
export {};
declare global {
  // eslint-disable-next-line no-var
  var mongoose: {
    connection: Connection | null;
    promise: Promise<Connection> | null;
  };
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: any) => void;
          prompt: (callback: (notification: any) => void) => void;
          cancel: () => void;
          revoke: (hint: string, callback: () => void) => void;
        };
      };
    };
  }

  // eslint-disable-next-line no-var
  var emailEvent: EventEmitter | undefined;
}

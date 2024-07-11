// src/utils/dokuConfig.ts
import { v4 } from 'uuid';

export const DokuVariablesData = {
  Client_Id: 'BRN-0261-1701964375234',
  // Request_Id: requestId,
  // Request_Timestamp: utcString,
  SecretKey: 'SK-l9ZHunRxx0vYrBPPOI15',
};

export const generateRequestId = (): string => v4();

export const getCurrentTimestamp = (): string => {
  const now = new Date();
  return now.toISOString().slice(0, 19) + 'Z';
};

export const getCurrentTimeString = (): string => {
  const now = new Date();
  return now.getTime().toString();
};

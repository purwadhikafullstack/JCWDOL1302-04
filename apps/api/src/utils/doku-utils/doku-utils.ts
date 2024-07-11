import { DokuVariablesData } from './doku-config';
import CryptoJS from 'crypto-js';

export const generateSignature = (
  jsonBody: string,
  requestId: string,
  requestTimestamp: string,
): string => {
  const digestSHA256 = CryptoJS.SHA256(CryptoJS.enc.Utf8.parse(jsonBody));
  const digestBase64 = CryptoJS.enc.Base64.stringify(digestSHA256);

  const signatureComponents = [
    `Client-Id:${DokuVariablesData.Client_Id}`,
    `Request-Id:${requestId}`,
    `Request-Timestamp:${requestTimestamp}`,
    'Request-Target:/checkout/v1/payment',
    `Digest:${digestBase64}`,
  ].join('\n');

  const signatureHmacSha256 = CryptoJS.HmacSHA256(
    signatureComponents,
    DokuVariablesData.SecretKey,
  );
  const signatureBase64 = CryptoJS.enc.Base64.stringify(signatureHmacSha256);

  return `HMACSHA256=${signatureBase64}`;
};

export const generateSignatureCheckV2 = (
  invoiceNumber: string,
  requestId: string,
  requestTimestamp: string,
): string => {
  const signatureComponents = [
    `Client-Id:${DokuVariablesData.Client_Id}`,
    `Request-Id:${requestId}`,
    `Request-Timestamp:${requestTimestamp}`,
    `Request-Target:/orders/v1/status/${invoiceNumber}`,
  ].join('\n');

  const signatureHmacSha256 = CryptoJS.HmacSHA256(
    signatureComponents,
    DokuVariablesData.SecretKey,
  );
  const signatureBase64 = CryptoJS.enc.Base64.stringify(signatureHmacSha256);

  return `HMACSHA256=${signatureBase64}`;
};

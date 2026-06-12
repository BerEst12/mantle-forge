"use strict";

const https = require("https");
const http = require("http");
const crypto = require("crypto");
const path = require("path");

function getEnvOrThrow(name) {
  const val = process.env[name];
  if (!val) throw new Error(`Missing required env var: ${name}`);
  return val;
}

function hmacSha1(key, data) {
  return crypto.createHmac("sha1", key).update(data).digest("base64");
}

function md5Base64(buffer) {
  return crypto.createHash("md5").update(buffer).digest("base64");
}

function buildCosAuth(method, pathname, secretId, secretKey) {
  const now = Math.floor(Date.now() / 1000);
  const expire = now + 3600;
  const keyTime = `${now};${expire}`;
  const signKey = crypto.createHmac("sha1", secretKey).update(keyTime).digest("hex");

  const httpString = [method.toLowerCase(), pathname, "", "", ""].join("\n");
  const sha1ofHttpString = crypto.createHash("sha1").update(httpString).digest("hex");

  const stringToSign = ["sha1", keyTime, sha1ofHttpString, ""].join("\n");
  const signature = crypto.createHmac("sha1", signKey).update(stringToSign).digest("hex");

  return [
    "q-sign-algorithm=sha1",
    `q-ak=${secretId}`,
    `q-sign-time=${keyTime}`,
    `q-key-time=${keyTime}`,
    `q-header-list=`,
    `q-url-param-list=`,
    `q-signature=${signature}`,
  ].join("&");
}

function uploadToCos(fileBuffer, options) {
  const { bucket, region, cosKey, contentType, acl } = options;
  const secretId = options.secretId || getEnvOrThrow("TENCENT_COS_SECRET_ID");
  const secretKey = options.secretKey || getEnvOrThrow("TENCENT_COS_SECRET_KEY");

  const hostname = `${bucket}.cos.${region}.myqcloud.com`;
  const pathname = `/${cosKey}`;
  const authorization = buildCosAuth("PUT", pathname, secretId, secretKey);

  const headers = {
    Host: hostname,
    Authorization: authorization,
    "Content-Type": contentType || "application/octet-stream",
    "Content-Length": fileBuffer.length,
    "Content-MD5": md5Base64(fileBuffer),
  };

  if (acl) headers["x-cos-acl"] = acl;

  return new Promise((resolve, reject) => {
    const req = https.request(
      { hostname, path: pathname, method: "PUT", headers },
      (res) => {
        let body = "";
        res.on("data", (c) => (body += c));
        res.on("end", () => {
          if (res.statusCode >= 200 && res.statusCode < 300) {
            resolve({
              url: `https://${hostname}${pathname}`,
              statusCode: res.statusCode,
            });
          } else {
            reject(new Error(`COS upload failed (${res.statusCode}): ${body.slice(0, 300)}`));
          }
        });
      }
    );
    req.on("error", reject);
    req.write(fileBuffer);
    req.end();
  });
}

module.exports = { uploadToCos };

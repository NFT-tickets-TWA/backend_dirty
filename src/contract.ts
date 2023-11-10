import * as url from "url";
import * as process from "process";
import { ethers } from "ethers";
import { Request, Response } from "express"; // Import the Request and Response types
import { Event } from './event';

require("dotenv").config();


const axios = require("axios");


const privKey = process.env.PRIVATE_KEY;
const contractAddress = process.env.CONTRACT_ADDRESS;
const providerURL = process.env.PROVIDER_URL;

let provider = new ethers.JsonRpcProvider(providerURL);

let wallet = new ethers.Wallet(privKey, provider);

export const createInternalEvent = async (
  event: Event, // Use the Request type for the request object
  res: Response // Use the Response type for the response object
) => {
  if (!event.name || !event.url || !event.symbol || !event.countOfTokens) {
    // Return a response to the client
    return res.status(400).json({ error: "Incorrect data" });
  }

  const fs = require("fs");
  const contents = fs.readFileSync("src/abi.json");

  const contract = new ethers.Contract(contractAddress, JSON.parse(contents), wallet);

  try {
    const createReceipt = await contract.createInternalEvent(
      event.name,
      event.symbol,
      event.url,
      event.countOfTokens,
      process.env.TOKEN_ADDRESS
    );

    console.log("request sent")
    await createReceipt.wait();
    console.log("response received")

    return res.status(200).json({ success: "Transaction successful", hash: createReceipt.hash });
  } catch (e) {
    console.error(e);
    return res.status(520).json({ error: "An error occurred" });
  }
};

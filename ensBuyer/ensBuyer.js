import ethers from "ethers";
//import crypto from "crypto";
import crypto from "crypto";
import fs from "fs";
import setupENS from "@ensdomains/ui";

const secrets = require("./secrets.json");

const provider = new ethers.providers.AlchemyProvider("homestead", secrets.api);

const walletPrivateKey = new ethers.Wallet(secrets.pkey);

const wallet = walletPrivateKey.connect(provider);

function randomSecret() {
  return "0x" + crypto.randomBytes(32).toString("hex");
}

const commit = async (_, { label, secret }, { cache }) => {
  const registrar = getRegistrar();
  const tx = await registrar.commit(label, secret);
  return sendHelper(tx);
};

const register = async (_, { label, duration, secret }) => {
  const registrar = getRegistrar();
  const tx = await registrar.register(label, duration, secret);

  return sendHelper(tx);
};

async function main() {
  const blockNumber = await provider.getBlockNumber();
  console.log("block number: " + blockNumber);

  const { ens: ensInstance, registrar: registrarInstance } = await setupENS({
    reloadOnAccountsChange: true,
    enforceReadOnly: false,
    enforceReload: true,
    customProvider: provider,
  });

  console.log("balance: " + (await wallet.getBalance()));

  if (false) {
    // add a line to a rocks file, using appendFile
    fs.appendFile("n.txt", "\n " + i + ", " + output, (err) => {
      if (err) throw err;
    });
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    //process.exit(1);
  });

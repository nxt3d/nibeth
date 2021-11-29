const { ethers, BigNumber } = require("ethers");
const fs = require("fs");
var getRandomValues = require("get-random-values");

const secrets = require("./secrets.json");

//const provider = new ethers.providers.AlchemyProvider("homestead", secrets.api);
const provider = new ethers.providers.AlchemyProvider("rinkeby", secrets.api);

const walletPrivateKey = new ethers.Wallet(secrets.pkey, provider);

const controller = new ethers.Contract(
  secrets.contractAddress,
  secrets.abi,
  walletPrivateKey
);

async function register(domainName, owner, duration) {
  // Generate a random value to mask our commitment
  const random = new Uint8Array(32);
  getRandomValues(random);
  console.log("random number: " + random);
  const salt =
    "0x" +
    Array.from(random)
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");

  console.log("salt: " + salt);
  // Submit our commitment to the smart contract
  const commitment = await controller.makeCommitment(domainName, owner, salt);
  console.log("commitment: " + commitment);

  const tx = await controller.commit(commitment);
  const txReceipt = await tx.wait();
  console.log("txReceipt: " + JSON.stringify(txReceipt));

  // Add 10% to account for price fluctuation; the difference is refunded.
  const price = (await controller.rentPrice(domainName, duration)) * 1.1;
  const priceInt = Math.floor(price);
  console.log("price: " + priceInt);

  const gasPrice = await provider.getGasPrice();
  console.log("gas price: ", gasPrice.toString()); //returns the price of gas from the network (WORKS)

  const waitFor = (delay) =>
    new Promise((resolve) => setTimeout(resolve, delay));

  // Wait 60 seconds before registering
  // Submit our registration request
  console.log("test");
  await waitFor(60000);
  console.log("test: ");

  const registeration = await controller.register(
    domainName,
    owner,
    duration,
    salt,
    {
      value: priceInt,
      gasLimit: 330000,
      maxFeePerGas: gasPrice * 2,
      maxPriorityFeePerGas: gasPrice,
    }
  );
  const txRegReceipt = await registeration.wait();
  console.log("registration: " + JSON.stringify(txRegReceipt));
}

async function main() {
  let domainName = "registerdomainname7576-26";

  let minTime = await controller.MIN_REGISTRATION_DURATION();
  const duration = 100 + parseInt(minTime);

  console.log("MIN_REGISTRATION_DURATION + 100: " + duration);

  let available = false;
  i = 0;

  while (!available) {
    available = await controller.available(domainName);
    console.log("available: " + available);
    if (i < 5) {
      available = false;
    } else {
      available = true;
    }
    console.log("available: " + available);
    i++;
  }

  await register(domainName, walletPrivateKey.address, duration.toString());
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    //process.exit(1);
  });

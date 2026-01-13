async function main() {
  const PramaanQR = await ethers.getContractFactory("PramaanQR");
  const contract = await PramaanQR.deploy();
  await contract.deployed();

  console.log("Deployed to:", contract.address);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});

function isBlacklist(address: string): boolean {
  if (!address) {
    return false;
  }
  const blacklist = [
    "0xd2bd7dba133ddbcfd4991075e24ee65a7985bceb",
    "0x384223e50131ecdcda9e2aa0f71b583c9c510091",
    "0x61c8b5b14aa9ede5c0bd8f8e04c66f25dfca2f6f",
    "0xd57d22c6fc5e3de3835db660a0c19dc780333bfd",
    "0xeC0B72fF5e989d4f83a999708A33a591B8E472aB",
    "0xE3567add234126A715731C726Ab6bB89992464Ac",
    "0x9fdaa80bd6b5fb0f09de10f743f48d6716e10e93",
    "0xb9063c1758dddfe2e9ff0a7c6635497e9ae30929",
  ];
  return blacklist.includes(address);
}
export default isBlacklist;

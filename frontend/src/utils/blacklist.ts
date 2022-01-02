function isBlacklist(address: string): boolean {
  if (!address) {
    return false;
  }
  const blacklist = [
    "0xd2bd7dba",
    "0x384223e5",
    "0x61c8b5b1",
    "0xd57d22c6",
    "0xeC0B72fF",
    "0xE3567add",
    "0x9fdaa80b",
    "0xb9063c17"
  ];
  return blacklist.includes(address.slice(0, 10));
}
export default isBlacklist;

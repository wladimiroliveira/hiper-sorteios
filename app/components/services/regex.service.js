export function Regex(regexThis, string) {
  try {
    const regex = regexThis;
    const match = string.match(regex);
    if (match[1]) return match[1];
    throw new Error({ message: "Error during NF key capture" });
  } catch (err) {
    console.error(err);
    throw err;
  }
}

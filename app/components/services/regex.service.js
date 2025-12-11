export function Regex(regexModel, string) {
  try {
    const match = string.match(regexModel);
    if (match[1]) return match[1];
    throw new Error({ message: "Error during NF key capture" });
  } catch (err) {
    console.error(err);
    throw err;
  }
}

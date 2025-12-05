export function NumGeradosComponent() {
  const numGerados = [
    //   "fdsajfslj",
    //   "fdsajfslj",
    //   "fdsajfslj",
    //   "fdsajfslj",
    //   "fdsajfslj",
    //   "fdsajfslj",
    //   "fdsajfslj",
    //   "fdsajfslj",
  ];
  if (!numGerados || numGerados.length <= 0) {
    return false;
  }
  return <span>{numGerados.length}</span>;
}

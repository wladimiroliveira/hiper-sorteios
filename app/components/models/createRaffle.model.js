export async function createRaffleModel(nfcInfo) {
  try {
    let cupomData = {};

    if (typeof nfcInfo === "string") {
      cupomData = {
        nfc_key: nfcInfo,
      };
    } else if (nfcInfo.cupom && nfcInfo.serie) {
      cupomData = {
        nfc_number: Number(nfcInfo.cupom),
        nfc_serie: Number(nfcInfo.serie),
      };
    }

    const responseResult = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/raffles`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(cupomData),
    });
    const responseValue = await responseResult.json();
    if (!responseResult.ok) {
      return {
        ok: responseResult.ok,
        status: responseResult.status,
        ...responseValue,
      };
    }
    if (responseResult.ok) {
      return {
        ok: responseResult.ok,
        status: responseResult.status,
        raffles: [...responseValue],
      };
    }
  } catch (err) {
    console.error(err);
    throw err;
  }
}

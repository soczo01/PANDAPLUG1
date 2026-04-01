function mapToUpdateDto(body) {
  return {
    nev: body.nev ?? body["Név"],
    marka: body.marka ?? body["Márka"],
    ar_usd: body.ar_usd ?? body["Ár(usd)"],
    meret: body.meret ?? body["Méret"],
    tipus: body.tipus ?? body["Típus"]
  };
}

module.exports = { mapToUpdateDto };
